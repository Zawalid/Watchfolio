import { getDefaultAvatarUrl } from '@/utils/avatar';
import { appwriteService } from './appwrite/api';
import { OAuthProvider } from 'appwrite';
import { DEFAULT_USER_PREFERENCES } from '@/utils/constants';
import { UpdateProfileInput, UpdateUserPreferencesInput } from './appwrite/types';
import { UserWithProfile } from './appwrite/types';

export interface CreateUserAccount {
  name: string;
  email: string;
  password: string;
}

export interface SignInAccount {
  email: string;
  password: string;
}

export interface AuthError extends Error {
  code?: string;
  type?: string;
}

class AuthService {
  /**
   * Create new user account with profile and library
   */
  async createAccount({ name, email, password }: CreateUserAccount) {
    try {
      // 1. Create Appwrite auth account
      const newAccount = await appwriteService.auth.createAccount(email, password, name);

      if (!newAccount) throw new Error('Failed to create account');

      // 2. Sign in the user automatically
      await this.signIn({ email, password });

      // 3. Create user profile in database with proper permissions
      // This will also create the library and preferences automatically
      await this.createUserProfile(newAccount.$id, name, email);

      return newAccount;
    } catch (error) {
      console.error('Create account error:', error);
      throw this.formatError(error);
    }
  }
  /**
   * Sign in user with email and password
   */
  async signIn({ email, password }: SignInAccount) {
    try {
      const session = await appwriteService.auth.createEmailSession(email, password);
      return session;
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      await appwriteService.auth.deleteCurrentSession();
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.formatError(error);
    }
  }
  /**
   * Get current authenticated user with profile, preferences, and location
   */
  async getCurrentUser(): Promise<UserWithProfile | null> {
    try {
      const currentAccount = await appwriteService.auth.getCurrentUser();
      if (!currentAccount) return null;
      try {
        const userProfile = await appwriteService.profile.getByUserId(currentAccount.$id);
        if (!userProfile) throw new Error('Profile not found');

        const userLocation = await appwriteService.locale.getUserLocation();
        return {
          ...currentAccount,
          profile: userProfile,
          location: userLocation,
        };
      } catch {
        try {
          await this.createUserProfile(currentAccount.$id, currentAccount.name, currentAccount.email);

          return await this.getCurrentUser();
        } catch (profileError) {
          console.error('Failed to create profile for OAuth user:', profileError);
          return null;
        }
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Reset password via email
   */
  async resetPassword(email: string) {
    try {
      return await appwriteService.auth.createRecovery(email, `${window.location.origin}/reset-password`);
    } catch (error) {
      console.error('Reset password error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Update password with recovery token
   */
  async updatePassword(userId: string, secret: string, password: string) {
    try {
      return await appwriteService.auth.updateRecovery(userId, secret, password);
    } catch (error) {
      console.error('Update password error:', error);
      throw this.formatError(error);
    }
  }
  /**
   * Create default user preferences
   */ private async createDefaultUserPreferences() {
    try {
      return await appwriteService.userPreferences.create(DEFAULT_USER_PREFERENCES);
    } catch (error) {
      console.error('Create default user preferences error:', error);
      throw error;
    }
  }

  /**
   * Update user name in both auth and profile
   */
  async updateUserName(name: string) {
    try {
      return await appwriteService.auth.updateName(name);
    } catch (error) {
      console.error('Update user name error:', error);
      throw this.formatError(error);
    }
  }
  /**
   * Update user email in both auth and profile
   */
  async updateUserEmail(userId: string, email: string, password: string): Promise<UserWithProfile | null> {
    try {
      // Update email in Appwrite Auth
      await appwriteService.auth.updateEmail(email, password);

      // Update email in profile
      const profile = await appwriteService.profile.getByUserId(userId);
      if (profile) {
        await appwriteService.profile.update(profile.$id, { email });
      }

      // Return updated user
      return await this.getCurrentUser();
    } catch (error) {
      console.error('Update user email error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Update user password in Appwrite Auth
   */
  async updateUserPassword(newPassword: string, oldPassword: string) {
    try {
      await appwriteService.auth.updatePassword(newPassword, oldPassword);
    } catch (error) {
      console.error('Update user password error:', error);
      throw this.formatError(error);
    }
  }
  /**
   * Update user profile data
   */
  async updateUserProfile(userId: string, profileData: UpdateProfileInput): Promise<UserWithProfile | null> {
    try {
      if (profileData.name) await this.updateUserName(profileData.name);

      const profile = await appwriteService.profile.getByUserId(userId);
      if (profile) {
        await appwriteService.profile.update(profile.$id, profileData);
      }

      return await this.getCurrentUser();
    } catch (error) {
      console.error('Update user profile error:', error);
      throw this.formatError(error);
    }
  }
  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    preferencesData: UpdateUserPreferencesInput
  ): Promise<UserWithProfile | null> {
    try {
      const profile = await appwriteService.profile.getByUserId(userId);
      if (profile?.preferences) {
        await appwriteService.userPreferences.update(profile.preferences.$id, preferencesData);
      }

      return await this.getCurrentUser();
    } catch (error) {
      console.error('Update user preferences error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Update account preferences
   */
  async updateAccountPreferences(preferences: Record<string, string>) {
    try {
      return await appwriteService.auth.updatePreferences(preferences);
    } catch (error) {
      console.error('Update user name error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Delete user account - removes auth account, profile, preferences, and library
   */
  async deleteUserAccount(userId: string) {
    try {
      // Get the profile first to access related data
      const profile = await appwriteService.profile.getByUserId(userId);
      if (profile) {
        // Delete profile (this will cascade delete preferences and library due to relationships)
        await appwriteService.profile.delete(profile.$id);
      }
      await appwriteService.auth.deleteAllSessions();
    } catch (error) {
      console.error('Delete user account error:', error);
      throw this.formatError(error);
    }
  } /**
   * Create user profile in database with proper permissions
   */
  private async createUserProfile(userId: string, name: string, email: string) {
    try {
      // Generate a more unique username
      const baseUsername = email.split('@')[0];
      const timestamp = Date.now().toString(36);
      const username = `${baseUsername}_${timestamp}`;

      const userData = {
        userId,
        name,
        email,
        username,
        avatarUrl: getDefaultAvatarUrl(name, 'fun-emoji'),
      };
      console.log('Creating user profile with data:', name, userId);

      // First create preferences and library without relationships
      const preferences = await this.createDefaultUserPreferences();
      const library = await this.createUserLibrary();

      // Add the relationship IDs to the profile data
      const profileDataWithRelationships = { ...userData, preferences: preferences.$id, library: library.$id };

      // Create the profile with the relationship IDs
      const profile = await appwriteService.profile.create(profileDataWithRelationships);

      return profile;
    } catch (error) {
      console.error('Create user profile error:', error);
      throw error;
    }
  }

  /**
   * Create empty library for user with proper permissions
   */ async createUserLibrary() {
    try {
      const libraryData = {
        averageRating: 0,
      };

      return await appwriteService.library.create(libraryData);
    } catch (error) {
      console.error('Create user library error:', error);
      throw error;
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(prevUrl: string) {
    try {
      // Redirect to Google OAuth
      const success = prevUrl || `${window.location.origin}/library`;
      // TODO : Use error screen or something
      const failure = `${window.location.origin}/home`;

      await appwriteService.auth.createOAuth2Session(OAuthProvider.Google, success, failure);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw this.formatError(error);
    }
  } /**
   * Send email verification
   */
  async sendEmailVerification() {
    try {
      // The verification URL will redirect to our verification page with the parameters
      const url = `${window.location.origin}/verify-email`;
      return await appwriteService.auth.createVerification(url);
    } catch (error) {
      console.error('Send email verification error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Confirm email verification
   */
  async confirmEmailVerification(userId: string, secret: string) {
    try {
      return await appwriteService.auth.updateVerification(userId, secret);
    } catch (error) {
      console.error('Confirm email verification error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Get current user ID (helper for other services)
   */
  async getCurrentUserId() {
    try {
      const currentUser = await appwriteService.auth.getCurrentUser();
      return currentUser?.$id || null;
    } catch {
      return null;
    }
  }

  /**
   * Fetches the list of all active sessions for the currently authenticated user.
   */
  async getActiveSessions() {
    try {
      return await appwriteService.auth.listSessions();
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Deletes a specific session by its ID, effectively signing out that device.
   * @param sessionId The ID of the session to delete.
   */
  async deleteSession(sessionId: string) {
    if (sessionId === 'current') {
      throw new Error('Cannot delete the current session using this method. Use signOut instead.');
    }
    try {
      await appwriteService.auth.deleteSession(sessionId);
    } catch (error) {
      console.error(`Failed to delete session ${sessionId}:`, error);
      throw this.formatError(error);
    }
  }

  /**
   * Deletes all other sessions for the current user.
   */
  async deleteOtherSessions() {
    try {
      await appwriteService.auth.deleteSessions();
    } catch (error) {
      console.error('Failed to delete other sessions:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Format Appwrite errors to user-friendly messages
   */
  private formatError(error: unknown): AuthError {
    const authError = new Error() as AuthError;

    // Type guard for Appwrite errors
    const isAppwriteError = (err: unknown): err is { code?: number; type?: string; message?: string } => {
      return typeof err === 'object' && err !== null;
    };

    if (isAppwriteError(error) && error.code) {
      authError.code = error.code.toString();
      authError.type = error.type;

      // Map common Appwrite error codes to user-friendly messages
      switch (error.code) {
        case 409:
          if (error.type === 'user_already_exists') {
            authError.message = 'An account with this email already exists';
          } else {
            authError.message = 'This account already exists';
          }
          break;
        case 401:
          if (error.type === 'user_invalid_credentials') {
            authError.message = 'Invalid email or password';
          } else {
            authError.message = 'Authentication failed';
          }
          break;
        case 400:
          if (error.message?.includes('password')) {
            authError.message = 'Password must be at least 8 characters long';
          } else if (error.message?.includes('email')) {
            authError.message = 'Please enter a valid email address';
          } else {
            authError.message = 'Invalid input provided';
          }
          break;
        case 429:
          authError.message = 'Too many attempts. Please try again later';
          break;
        default:
          authError.message = error.message || 'An authentication error occurred';
      }
    } else if (isAppwriteError(error) && error.message) {
      authError.message = error.message;
    } else if (error instanceof Error) {
      authError.message = error.message;
    } else {
      authError.message = 'An unexpected error occurred';
    }

    return authError;
  }
}

export const authService = new AuthService();
