import { Models } from 'appwrite';
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
  async createAccount({ name, email, password }: CreateUserAccount): Promise<Models.User<Models.Preferences>> {
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
  async signIn({ email, password }: SignInAccount): Promise<Models.Session> {
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
  async signOut(): Promise<void> {
    try {
      await appwriteService.auth.deleteCurrentSession();
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.formatError(error);
    }
  }

  /**
   * Get current authenticated user with profile
   */
  async getCurrentUser(): Promise<(Models.User<Models.Preferences> & { profile?: User }) | null> {
    try {
      const currentAccount = await appwriteService.auth.getCurrentUser();
      if (!currentAccount) return null;

      // Get user profile from database
      try {
        const userProfile = await appwriteService.users.get(currentAccount.$id);

        return {
          ...currentAccount,
          profile: userProfile,
        };
      } catch {
        // Profile might not exist yet, return account without profile
        return currentAccount;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
  /**
   * Get user's library ID
   */
  async getUserLibraryId(userId: string): Promise<string | null> {
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
  async resetPassword(email: string): Promise<Models.Token> {
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
  async updatePassword(userId: string, secret: string, password: string): Promise<Models.Token> {
    try {
      return await appwriteService.auth.updateRecovery(userId, secret, password);
    } catch (error) {
      console.error('Update password error:', error);
      throw this.formatError(error);
    }
  } /**
   * Create user profile in database with proper permissions
   */
  private async createUserProfile(userId: string, name: string, email: string): Promise<User> {
    try {
      const userData = {
        name,
        email,
        username: email.split('@')[0], // Generate username from email
        id: userId, // Include the userId for permissions
      };

      return await appwriteService.users.create(userData, userId);
    } catch (error) {
      console.error('Create user profile error:', error);
      throw error;
    }
  }

  /**
   * Create empty library for user with proper permissions
   */
  private async createUserLibrary(userId: string): Promise<Library> {
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
  } /**
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
  async getCurrentUserId(): Promise<string | null> {
    try {
      const currentUser = await appwriteService.auth.getCurrentUser();
      return currentUser?.$id || null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
