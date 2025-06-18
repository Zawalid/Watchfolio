/**
 * Authentication Store for Watchfolio
 * Manages user authentication state and operations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Models } from 'appwrite';
import { authService } from '@/lib/auth';

interface AuthUser extends Models.User<Models.Preferences> {
  profile?: User;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<Models.Session>;
  signUp: (name: string, email: string, password: string) => Promise<Models.User<Models.Preferences>>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<Models.Token>;
  getUserLibraryId: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
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
            isAuthenticated: true,
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
            isAuthenticated: true,
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

      getUserLibraryId: async () => {
        const { user } = get();
        if (!user) return null;

        return await authService.getUserLibraryId(user.$id);
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
