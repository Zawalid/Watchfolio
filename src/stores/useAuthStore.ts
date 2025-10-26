import { Models } from 'appwrite';
import { create } from 'zustand';
import { authService } from '@/lib/auth';
import { persistAndSync } from '@/utils/persistAndSync';
import { DEFAULT_USER_PREFERENCES, LOCAL_STORAGE_PREFIX } from '@/config/app';
import { deepEqual } from '@/utils';
import {
  CreateUserPreferencesInput,
  UpdateProfileInput,
  UpdateUserPreferencesInput,
  UserWithProfile,
} from '@/lib/appwrite/types';
import { destroyDB, getDBStatus } from '@/lib/rxdb';
import { authStorePartializer } from './utils';
import { useSyncStore } from './useSyncStore';
import { isActuallyOnline, isNetworkError } from '@/utils/connectivity';

export interface AuthState {
  // Core user/auth state
  user: UserWithProfile | null;
  userPreferences: CreateUserPreferencesInput;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean; // True when persisted state has been loaded from storage
  syncError: string | null;

  // Modal/UI state
  showAuthModal: boolean;
  authModalType: 'signin' | 'signup';
  showOnboardingModal: boolean;
  pendingOnboarding: boolean;

  // Authentication actions
  signIn: (email: string, password: string) => Promise<Models.Session>;
  signUp: (name: string, email: string, password: string) => Promise<Models.User<Models.Preferences>>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<Models.Token>;

  // User profile & preferences
  updateUserEmail: (email: string, password: string) => Promise<void>;
  updateUserPassword: (newPassword: string, oldPassword: string) => Promise<void>;
  updateUserProfile: (profileData: UpdateProfileInput) => Promise<void>;
  updateUserPreferences: (preferencesData: UpdateUserPreferencesInput) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;

  // Email verification
  sendEmailVerification: () => Promise<Models.Token>;
  confirmEmailVerification: (userId: string, secret: string) => Promise<void>;

  // Modal/UI actions
  openAuthModal: (type: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  switchAuthMode: (type: 'signin' | 'signup') => void;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
  setPendingOnboarding: (value: boolean) => void;

  // Utility & helpers
  checkIsOwnProfile: (username?: string) => boolean;
  clearSyncError: () => void;
  cleanUp: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persistAndSync(
    (set, get) => ({
      user: null,
      userPreferences: DEFAULT_USER_PREFERENCES,
      isLoading: false,
      isAuthenticated: false,
      isHydrated: false,
      syncError: null,
      showAuthModal: false,
      authModalType: 'signin',
      showOnboardingModal: false,
      pendingOnboarding: false,

      signIn: async (email, password) => {
        set({ isLoading: true, syncError: null });
        try {
          const session = await authService.signIn({ email, password });
          const user = await authService.getCurrentUser();
          set({ user, userPreferences: user?.profile.preferences, isAuthenticated: !!user, isLoading: false });
          await useSyncStore.getState().startSync();
          return session;
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to sign in' });
          throw error;
        }
      },

      signUp: async (name, email, password) => {
        set({ isLoading: true, syncError: null });
        try {
          const newUser = await authService.createAccount({ name, email, password });
          const user = await authService.getCurrentUser();
          const preferences = get().userPreferences;
          if (!user) throw new Error('Failed to create user');
          if (!deepEqual(preferences, DEFAULT_USER_PREFERENCES)) {
            await authService.updateUserPreferences(user.$id, preferences);
          }
          set({ user, isAuthenticated: !!user, isLoading: false });
          await useSyncStore.getState().startSync();
          return newUser;
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to sign up' });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true, syncError: null });
        try {
          await get().cleanUp();
          await authService.signOut();
          set({
            user: null,
            userPreferences: DEFAULT_USER_PREFERENCES,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to sign out' });
          throw error;
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, syncError: null });
        try {
          await authService.signInWithGoogle(window.location.href);
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to sign in with Google' });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ isLoading: true, syncError: null });

        // Check for actual internet connectivity (not just network adapter)
        const online = await isActuallyOnline();
        if (!online) {
          const currentState = get();
          set({
            isLoading: false,
            isAuthenticated: currentState.isAuthenticated,
            user: currentState.user,
          });
          return;
        }

        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: !!user, isLoading: false });
          await useSyncStore.getState().startSync();
        } catch (error) {
          // Check if this is a network error (not an auth error)
          if (isNetworkError(error)) {
            // Network error - keep cached state
            const currentState = get();
            set({
              isLoading: false,
              isAuthenticated: currentState.isAuthenticated,
              user: currentState.user,
            });
          } else {
            // Real auth failure (401, 403, etc) - clear state
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        }
      },

      resetPassword: async (email) => authService.resetPassword(email),

      updateUserEmail: async (email, password) => {
        const { user } = get();
        if (!user) throw new Error('No user authenticated');
        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateUserEmail(user.$id, email, password);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to update email' });
          throw error;
        }
      },

      updateUserPassword: async (newPassword, oldPassword) => {
        set({ isLoading: true });
        try {
          await authService.updateUserPassword(newPassword, oldPassword);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to update password' });
          throw error;
        }
      },

      updateUserProfile: async (profileData) => {
        const { user } = get();
        if (!user) throw new Error('No user authenticated');
        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateUserProfile(user.$id, profileData);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to update profile' });
          throw error;
        }
      },

      updateUserPreferences: async (preferencesData) => {
        const { user, userPreferences } = get();
        const updatedPreferences = { ...userPreferences, ...preferencesData };
        set({ userPreferences: updatedPreferences });
        if (!user) return;

        // Check if online before attempting to sync
        const isOnline = await isActuallyOnline();
        if (!isOnline) {
          // Offline: preferences updated locally, will sync when online
          return;
        }

        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateUserPreferences(user.$id, updatedPreferences);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          // Check if this is a network error
          if (isNetworkError(error)) {
            set({ isLoading: false });
            // Silently fail on network error - local state already updated
            return;
          }
          set({ isLoading: false, syncError: 'Failed to update preferences' });
          throw error;
        }
      },

      deleteUserAccount: async () => {
        const { user } = get();
        if (!user) throw new Error('No user authenticated');
        set({ isLoading: true });
        try {
          await get().cleanUp();
          await authService.deleteUserAccount(user.$id);
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to delete account' });
          throw error;
        }
      },

      refreshUser: async () => {
        const { user } = get();
        if (!user) return;
        try {
          const updatedUser = await authService.getCurrentUser();
          set({ user: updatedUser });
        } catch (error) {
          log('ERR', 'Failed to refresh user:', error);
          set({ syncError: 'Failed to refresh user data' });
        }
      },

      sendEmailVerification: async () => authService.sendEmailVerification(),

      confirmEmailVerification: async (userId, secret) => {
        await authService.confirmEmailVerification(userId, secret);
        await get().refreshUser();
      },

      openAuthModal: (type) => set({ showAuthModal: true, authModalType: type }),
      closeAuthModal: () => set({ showAuthModal: false }),
      switchAuthMode: (type) => set({ authModalType: type }),
      openOnboardingModal: () => set({ showOnboardingModal: true }),
      closeOnboardingModal: () => {
        set({ showOnboardingModal: false });
        useSyncStore.getState().triggerSync();
      },
      setPendingOnboarding: (value) => {
        set({ pendingOnboarding: value });
        if (value === false) authService.updateAccountPreferences({ hasSeenOnboarding: 'TRUE' });
      },

      checkIsOwnProfile: (username) => {
        if (!username) return false;
        return get().isAuthenticated && get().user?.profile.username === username;
      },

      clearSyncError: () => set({ syncError: null }),

      cleanUp: async () => {
        if (getDBStatus() === 'ready') {
          await useSyncStore.getState().stopSync();
          await destroyDB();
        }
      },
    }),
    {
      name: `${LOCAL_STORAGE_PREFIX}auth`,
      storage: 'cookie',
      partialize: authStorePartializer,
      onRehydrate: (_state, _store, set) => {
        set({ isHydrated: true });
      },
    }
  )
);
