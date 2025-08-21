import { Models } from 'appwrite';
import { create } from 'zustand';
import { authService } from '@/lib/auth';
import { persistAndSync } from '@/utils/persistAndSync';
import { DEFAULT_USER_PREFERENCES, LOCAL_STORAGE_PREFIX } from '@/utils/constants';
import { useLibraryStore } from './useLibraryStore';
import { deepEqual } from '@/utils';
import { CreateUserPreferencesInput, Profile, UpdateProfileInput, UpdateUserPreferencesInput, UserPreferences, UserWithProfile } from '@/lib/appwrite/types';
import { getCurrentUserId, startReplication, stopReplication, getSyncStatus, recoverSync } from '@/lib/rxdb';

interface AuthState {
  user: UserWithProfile | null;
  userPreferences: CreateUserPreferencesInput;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Enhanced sync state
  isSyncInitializing: boolean;
  syncError: string | null;
  lastSyncAt: string | null;

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

  // Enhanced Sync Actions
  initializeSync: () => Promise<void>;
  forceSyncRecovery: () => Promise<void>;
  clearSyncError: () => void;

  // Modal Actions
  openAuthModal: (type: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  switchAuthMode: (type: 'signin' | 'signup') => void;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
  setPendingOnboarding: (value: boolean) => void;

  // Utils
  checkIsOwnProfile: (username?: string) => boolean;
  getSyncStatus: () => string;
}

export const useAuthStore = create<AuthState>()(
  persistAndSync(
    (set, get) => ({
      user: null,
      userPreferences: DEFAULT_USER_PREFERENCES,
      isLoading: false,
      isAuthenticated: false,
      isSyncInitializing: false,
      syncError: null,
      lastSyncAt: null,
      showAuthModal: false,
      authModalType: 'signin',
      showOnboardingModal: false,
      pendingOnboarding: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, syncError: null });
        try {
          const session = await authService.signIn({ email, password });
          const user = await authService.getCurrentUser();

          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });

          // Initialize sync after successful login
          if (user) {
            await get().initializeSync();
          }

          return session;
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to sign in' });
          throw error;
        }
      },

      signUp: async (name: string, email: string, password: string) => {
        set({ isLoading: true, syncError: null });
        try {
          const newUser = await authService.createAccount({ name, email, password });
          const user = await authService.getCurrentUser();
          const preferences = get().userPreferences;

          if (!user) throw new Error('Failed to create user');

          if (!deepEqual(preferences, DEFAULT_USER_PREFERENCES)) {
            await authService.updateUserPreferences(user.$id, preferences);
          }

          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });

          // Initialize sync after successful signup
          await get().initializeSync();

          return newUser;
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to sign up' });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true, syncError: null });
        try {
          // Stop sync before signing out
          await stopReplication();

          await authService.signOut();
          useLibraryStore.getState().clearLibrary();

          set({
            user: null,
            userPreferences: DEFAULT_USER_PREFERENCES,
            isAuthenticated: false,
            isLoading: false,
            isSyncInitializing: false,
            lastSyncAt: null,
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
        try {
          const user = await authService.getCurrentUser();

          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });

          // Initialize sync if user is authenticated
          if (user) {
            await get().initializeSync();
          }
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
          set({ isLoading: false, syncError: 'Failed to update email' });
          throw error;
        }
      },

      updateUserPassword: async (newPassword: string, oldPassword: string) => {
        set({ isLoading: true });
        try {
          await authService.updateUserPassword(newPassword, oldPassword);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to update password' });
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
          set({ isLoading: false, syncError: 'Failed to update profile' });
          throw error;
        }
      },

      updateUserPreferences: async (preferencesData: UpdateUserPreferencesInput) => {
        const { user, userPreferences } = get();
        const updatedPreferences = { ...userPreferences, ...preferencesData };

        set({ userPreferences: updatedPreferences });

        if (!user) return;

        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateUserPreferences(user.$id, updatedPreferences);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ isLoading: false, syncError: 'Failed to update preferences' });
          throw error;
        }
      },

      deleteUserAccount: async () => {
        const { user } = get();
        if (!user) throw new Error('No user authenticated');

        set({ isLoading: true });
        try {
          // Stop sync before deleting account
          await stopReplication();

          await authService.deleteUserAccount(user.$id);
          useLibraryStore.getState().clearLibrary();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isSyncInitializing: false,
            lastSyncAt: null,
          });
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
          console.error('Failed to refresh user:', error);
          set({ syncError: 'Failed to refresh user data' });
        }
      },

      sendEmailVerification: async () => {
        return await authService.sendEmailVerification();
      },

      confirmEmailVerification: async (userId: string, secret: string) => {
        await authService.confirmEmailVerification(userId, secret);
        await get().refreshUser();
      },

      // Enhanced sync methods
      initializeSync: async () => {
        const { user, isSyncInitializing } = get();

        if (!user?.$id || isSyncInitializing) {
          return;
        }

        set({ isSyncInitializing: true, syncError: null });

        try {
          console.log('🔄 Initializing sync for user:', user.$id);

          // Load library first
          await useLibraryStore.getState().loadLibrary();

          // Start replication
          await startReplication(user.$id, user.profile.library);

          set({
            isSyncInitializing: false,
            lastSyncAt: new Date().toISOString()
          });

          console.log('✅ Sync initialized successfully');
        } catch (error) {
          console.error('❌ Sync initialization failed:', error);
          set({
            isSyncInitializing: false,
            syncError: error instanceof Error ? error.message : 'Sync initialization failed'
          });
        }
      },

      forceSyncRecovery: async () => {
        const { user } = get();
        if (!user?.$id) {
          throw new Error('No authenticated user for sync recovery');
        }

        set({ isSyncInitializing: true, syncError: null });

        try {
          console.log('🔧 Attempting sync recovery...');
          await recoverSync();

          set({
            isSyncInitializing: false,
            lastSyncAt: new Date().toISOString()
          });

          console.log('✅ Sync recovery successful');
        } catch (error) {
          console.error('❌ Sync recovery failed:', error);
          set({
            isSyncInitializing: false,
            syncError: error instanceof Error ? error.message : 'Sync recovery failed'
          });
          throw error;
        }
      },

      clearSyncError: () => {
        set({ syncError: null });
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

      getSyncStatus: () => {
        return getSyncStatus();
      },
    }),
    {
      name: `${LOCAL_STORAGE_PREFIX}auth`,
      storage: 'cookie',
      partialize: (state) => {
        if (!state.user)
          return {
            isAuthenticated: false,
            pendingOnboarding: false,
            userPreferences: state.userPreferences,
            user: null,
            lastSyncAt: null,
          };

        const userKeysToKeep: (keyof UserWithProfile)[] = ['$id', 'name', 'email', 'emailVerification', 'location'];
        const profileKeysToKeep: (keyof Profile)[] = [
          '$id',
          'username',
          'avatarUrl',
          'bio',
          'visibility',
          'contentPreferences',
          'favoriteContentType',
          'favoriteGenres',
          'favoriteNetworks',
          'hiddenProfileSections',
          'userId'
        ];
        const preferencesKeysToKeep = Object.keys(DEFAULT_USER_PREFERENCES) as (keyof UserPreferences)[];

        const user = pick(state.user, userKeysToKeep);
        const profile = pick(state.user.profile, profileKeysToKeep);
        const preferences = pick(state.user.profile.preferences, preferencesKeysToKeep);
        const userPreferences = { ...preferences, ...state.userPreferences };

        return {
          isAuthenticated: state.isAuthenticated,
          user: { ...user, profile } as UserWithProfile,
          userPreferences,
          pendingOnboarding: state.pendingOnboarding,
          lastSyncAt: state.lastSyncAt,
        };
      },
    }
  )
);

function pick<T extends object, K extends keyof T>(obj: T | undefined | null, keys: K[]): Partial<Pick<T, K>> {
  if (!obj) return {};

  const result = {} as Partial<Pick<T, K>>;
  keys.forEach((key) => {
    if (obj && key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// ===== ENHANCED SUBSCRIPTION MANAGEMENT =====

let hasLoaded = false;
let librarySubscription: (() => void) | null = null;
let syncSubscription: (() => void) | null = null;

// Library loading subscription with better error handling
if (!librarySubscription) {
  librarySubscription = useAuthStore.subscribe((state, prevState) => {
    const loadLibrary = useLibraryStore.getState().loadLibrary;

    // Track loading state changes
    if (state.isLoading && !prevState?.isLoading) {
      hasLoaded = true;
    }

    // Load library when authentication completes
    if (!state.isLoading && hasLoaded) {
      console.log('📚 Loading library after authentication');
      loadLibrary().catch(error => {
        console.error('Failed to load library:', error);
        useAuthStore.setState({ syncError: 'Failed to load library data' });
      });
    }
  });
}

// Enhanced sync subscription with better state management
if (!syncSubscription) {
  syncSubscription = useAuthStore.subscribe(async (state, prevState) => {
    try {
      const wasAuthenticated = prevState?.isAuthenticated || false;
      const isNowAuthenticated = state.isAuthenticated;
      const userChanged = state.user?.$id !== prevState?.user?.$id;

      // Start sync when user becomes authenticated or changes
      if (isNowAuthenticated && state.user?.$id && hasLoaded && (!wasAuthenticated || userChanged)) {
        const currentUserId = getCurrentUserId();

        // Only start if not already running for this user
        if (currentUserId !== state.user.$id) {
          console.log('🔄 Starting replication for user:', state.user.$id);

          // Don't set loading state here as it's handled by initializeSync
          try {
            await startReplication(state.user.$id, state.user.profile.library);
            useAuthStore.setState({
              lastSyncAt: new Date().toISOString(),
              syncError: null
            });
          } catch (error) {
            console.error('❌ Auto-sync failed:', error);
            useAuthStore.setState({
              syncError: error instanceof Error ? error.message : 'Auto-sync failed'
            });
          }
        }
      }
      // Stop sync when user becomes unauthenticated
      else if (!isNowAuthenticated && wasAuthenticated) {
        console.log('🛑 Stopping replication - user not authenticated');
        try {
          await stopReplication();
          useAuthStore.setState({ lastSyncAt: null });
        } catch (error) {
          console.error('❌ Failed to stop replication:', error);
        }
      }
    } catch (error) {
      console.error('❌ Sync subscription error:', error);
      useAuthStore.setState({
        syncError: error instanceof Error ? error.message : 'Sync error'
      });
    }
  });
}

// Enhanced cleanup function
export const cleanupAuthSubscriptions = () => {
  if (librarySubscription) {
    librarySubscription();
    librarySubscription = null;
  }
  if (syncSubscription) {
    syncSubscription();
    syncSubscription = null;
  }

  // Also stop any active replication
  stopReplication().catch(console.error);
};

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    cleanupAuthSubscriptions();
  });
}

// Periodic sync health check
let healthCheckInterval: NodeJS.Timeout | null = null;

const startSyncHealthCheck = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }

  healthCheckInterval = setInterval(() => {
    const state = useAuthStore.getState();

    if (state.isAuthenticated && state.user?.$id) {
      const currentUserId = getCurrentUserId();
      const syncStatus = getSyncStatus();

      // Check if sync is in error state or stopped unexpectedly
      if (syncStatus === 'error' || (currentUserId !== state.user.$id && syncStatus === 'offline')) {
        console.warn('⚠️ Sync health check detected issues, attempting recovery');

        state.forceSyncRecovery().catch(error => {
          console.error('❌ Automatic sync recovery failed:', error);
        });
      }
    }
  }, 60000); // Check every minute
};

// Start health check
if (typeof window !== 'undefined') {
  startSyncHealthCheck();
}

// Export health check controls
export const stopSyncHealthCheck = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
};

export { startSyncHealthCheck };