import { Models } from 'appwrite';
import { create } from 'zustand';
import { authService } from '@/lib/auth';
import { persistAndSync } from '@/utils/persistAndSync';
import { LOCAL_STORAGE_PREFIX } from '@/utils/constants';
import { setupZustandDevtools } from '@/utils';

interface AuthState {
  user: UserWithProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Auth Actions
  signIn: (email: string, password: string) => Promise<Models.Session>;
  signUp: (name: string, email: string, password: string) => Promise<Models.User<Models.Preferences>>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<Models.Token>;

  // User Management Actions
  updateUserEmail: (email: string, password: string) => Promise<void>;
  updateUserPassword: (newPassword: string, oldPassword: string) => Promise<void>;
  updateUserProfile: (profileData: UpdateProfileInput) => Promise<void>;
  updateUserPreferences: (preferencesData: UpdateUserPreferencesInput) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;

  // Helper Actions
  getUserLibraryId: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()(
  persistAndSync(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

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
          const updatedUser = await authService.updateUserEmail(user.profile.$id, email, password);
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
          const updatedUser = await authService.updateUserProfile(user.profile.$id, profileData);
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
          // Use the user ID as the preferences ID since they share the same ID
          const updatedUser = await authService.updateUserPreferences(user.profile.$id, preferencesData);
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
          await authService.deleteUserAccount(user.profile.$id);
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

      getUserLibraryId: async () => {
        const { user } = get();
        if (!user) return null;

        return await authService.getUserLibraryId(user.profile.$id);
      },
    }),
    {
      name: `${LOCAL_STORAGE_PREFIX}auth`,
      include: ['user', 'isAuthenticated'],
      storage: 'cookie',
    }
  )
);

setupZustandDevtools('AuthStore', useAuthStore);
