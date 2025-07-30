import { Models } from 'appwrite';
import { create } from 'zustand';
import { authService } from '@/lib/auth';
import { persistAndSync } from '@/utils/persistAndSync';
import { LOCAL_STORAGE_PREFIX } from '@/utils/constants';
import { useLibraryStore } from './useLibraryStore';

interface AuthState {
  user: UserWithProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Modal State
  showAuthModal: boolean;
  authModalType: 'signin' | 'signup';
  showOnboardingModal: boolean;
  pendingOnboarding: boolean;

  // Auth Actions
  signIn: (email: string, password: string) => Promise<Models.Session>;
  signUp: (name: string, email: string, password: string) => Promise<Models.User<Models.Preferences>>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<Models.Token>;
  signInWithGoogle: () => Promise<void>;

  // User Management Actions
  updateUserEmail: (email: string, password: string) => Promise<void>;
  updateUserPassword: (newPassword: string, oldPassword: string) => Promise<void>;
  updateUserProfile: (profileData: UpdateProfileInput) => Promise<void>;
  updateUserPreferences: (preferencesData: UpdateUserPreferencesInput) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;

  // Email Verification Actions
  sendEmailVerification: () => Promise<Models.Token>;
  confirmEmailVerification: (userId: string, secret: string) => Promise<void>;

  // Modal Actions
  openAuthModal: (type: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  switchAuthMode: (type: 'signin' | 'signup') => void;

  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
  setPendingOnboarding: (value: boolean) => void;

  // Utils
  checkIsOwnProfile: (username?: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persistAndSync(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      showAuthModal: false,
      authModalType: 'signin',
      showOnboardingModal: false,
      pendingOnboarding: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const session = await authService.signIn({ email, password });
          const user = await authService.getCurrentUser();

          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });

          return session;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signUp: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const newUser = await authService.createAccount({ name, email, password });
          const user = await authService.getCurrentUser();

          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });

          return newUser;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await authService.signOut();
          useLibraryStore.getState().clearLibrary();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      resetPassword: async (email: string) => {
        return await authService.resetPassword(email);
      },
      updateUserEmail: async (email: string, password: string) => {
        const { user } = get();
        if (!user) throw new Error('No user authenticated');

        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateUserEmail(user.$id, email, password);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateUserPassword: async (newPassword: string, oldPassword: string) => {
        set({ isLoading: true });
        try {
          await authService.updateUserPassword(newPassword, oldPassword);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      updateUserProfile: async (profileData: UpdateProfileInput) => {
        const { user } = get();
        if (!user) throw new Error('No user authenticated');

        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateUserProfile(user.$id, profileData);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      updateUserPreferences: async (preferencesData: UpdateUserPreferencesInput) => {
        const { user } = get();
        if (!user) throw new Error('No user authenticated');

        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateUserPreferences(user.$id, preferencesData);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      deleteUserAccount: async () => {
        const { user } = get();
        if (!user) throw new Error('No user authenticated');

        set({ isLoading: true });
        try {
          await authService.deleteUserAccount(user.$id);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          useLibraryStore.getState().clearLibrary();
        } catch (error) {
          set({ isLoading: false });
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
          console.error('Failed to refresh user:', error);
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true });
        try {
          await authService.signInWithGoogle();
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      sendEmailVerification: async () => {
        return await authService.sendEmailVerification();
      },
      confirmEmailVerification: async (userId: string, secret: string) => {
        await authService.confirmEmailVerification(userId, secret);
        await get().refreshUser();
      },

      // Modal Actions  
      openAuthModal: (type: 'signin' | 'signup') => {
        set({ showAuthModal: true, authModalType: type });
      },

      closeAuthModal: () => {
        set({ showAuthModal: false });
      },

      switchAuthMode: (type: 'signin' | 'signup') => {
        set({ authModalType: type });
      },

      openOnboardingModal: () => {
        set({ showOnboardingModal: true });
      },
      closeOnboardingModal: () => {
        set({ showOnboardingModal: false });
      },

      setPendingOnboarding: (value: boolean) => {
        set({ pendingOnboarding: value });
      },

      checkIsOwnProfile: (username) => {
        if (!username) return false;
        return get().isAuthenticated && get().user?.profile.username === username;
      },
    }),
    {
      name: `${LOCAL_STORAGE_PREFIX}auth`,
      storage: 'cookie',
      partialize: (state) => {
        if (!state.user) return { isAuthenticated: state.isAuthenticated, pendingOnboarding: state.pendingOnboarding };

        const userKeysToKeep: (keyof UserWithProfile)[] = ['$id', 'name', 'email', 'emailVerification', 'location'];
        const profileKeysToKeep: (keyof Profile)[] = [
          'username',
          'avatarUrl',
          'bio',
          'visibility',
          'contentPreferences',
          'favoriteContentType',
          'favoriteGenres',
          'favoriteNetworks',
          'preferences',
          'hiddenProfileSections',
        ];
        const preferencesKeysToKeep: (keyof UserPreferences)[] = [
          'removeFromLibraryConfirmation',
          'signOutConfirmation',
          'clearLibraryConfirmation',
          'language',
          'theme',
        ];

        const partialUser = pick(state.user, userKeysToKeep);
        const partialProfile = pick(state.user.profile, profileKeysToKeep);
        const partialPreferences = pick(state.user.profile.preferences, preferencesKeysToKeep);

        return {
          isAuthenticated: state.isAuthenticated,
          user: { ...partialUser, profile: { ...partialProfile, preferences: partialPreferences } },
        };
      },
    }
  )
);

function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}
