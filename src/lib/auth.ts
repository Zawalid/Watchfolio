import { appwriteService } from './api/appwrite-service';

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
      await this.createUserProfile(newAccount.$id, name, email);

      // 4. Create empty library for user with proper permissions
      await this.createUserLibrary(newAccount.$id);

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
        // Get user profile from database
        const userProfile = await appwriteService.profiles.get(currentAccount.$id);

        // Get or create user preferences using the userId
        let userPreferences: UserPreferences;
        try {
          userPreferences = await appwriteService.userPreferences.get(currentAccount.$id);
        } catch {
          // Preferences don't exist, create default ones
          userPreferences = await this.createDefaultUserPreferences(currentAccount.$id);
        }

        // Get user location
        const userLocation = await appwriteService.locale.getUserLocation();

        return {
          ...currentAccount,
          profile: userProfile,
          preferences: userPreferences,
          location: userLocation,
        };
      } catch {
        // Profile might not exist yet, return null
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get user's library ID
   */
  async getUserLibraryId(userId: string) {
    try {
      const userLibrary = await appwriteService.libraries.getByUser(userId);
      return userLibrary?.$id || null;
    } catch (error) {
      console.error('Get user library error:', error);
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
   */
  private async createDefaultUserPreferences(userId: string) {
    try {
      const defaultPreferences = {
        signOutConfirmation: 'enabled' as ConfirmationSetting,
        removeFromWatchlistConfirmation: 'enabled' as ConfirmationSetting,
        theme: 'system' as Theme,
        language: 'en',
        userId,
      };

      // Use the userId as the document ID to make the relationship simpler
      return await appwriteService.userPreferences.create(defaultPreferences, userId);
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
      await appwriteService.profiles.update(userId, { email });

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
      await appwriteService.profiles.update(userId, profileData);
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
    preferencesId: string,
    preferencesData: UpdateUserPreferencesInput
  ): Promise<UserWithProfile | null> {
    try {
      await appwriteService.userPreferences.update(preferencesId, preferencesData);
      return await this.getCurrentUser();
    } catch (error) {
      console.error('Update user preferences error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Delete user account - removes auth account, profile, preferences, and library
   */
  async deleteUserAccount(userId: string) {
    try {
      // Delete profile (this will also delete library, preferences, items, etc. due to cascade delete)
      await appwriteService.profiles.delete(userId);
      await appwriteService.auth.deleteAllSessions();
    } catch (error) {
      console.error('Delete user account error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Create user profile in database with proper permissions
   */
  private async createUserProfile(userId: string, name: string, email: string) {
    try {
      // First create default user preferences with the same ID as the user
      await this.createDefaultUserPreferences(userId);

      const userData = {
        name,
        email,
        username: email.split('@')[0],
        id: userId,
        avatarUrl: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        mediaPreference: 'both' as MediaPreferenceType,
      };

      const profile = await appwriteService.profiles.create(userData, userId);

      return profile;
    } catch (error) {
      console.error('Create user profile error:', error);
      throw error;
    }
  }

  /**
   * Create empty library for user with proper permissions
   */
  async createUserLibrary(userId: string) {
    try {
      const libraryData = {
        user: userId,
        averageRating: 0,
      };

      return await appwriteService.libraries.create(libraryData);
    } catch (error) {
      console.error('Create user library error:', error);
      throw error;
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
}

export const authService = new AuthService();
