import { Profile, UserPreferences, UserWithProfile } from '@/lib/appwrite/types';
import { DEFAULT_USER_PREFERENCES } from '@/utils/constants';
import { AuthState } from './useAuthStore';

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

export const authStorePartializer = (state: AuthState) => {
  if (!state.user) {
    return {
      isAuthenticated: false,
      pendingOnboarding: false,
      userPreferences: state.userPreferences,
      user: null,
    };
  }

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
    'userId',
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
  };
};
