import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { AccountPrefs } from '@/lib/appwrite/types';
import { isActuallyOnline } from '@/utils/connectivity';

export function useInitialAuth() {
  const { user, isHydrated, isAuthenticated, checkAuth, pendingOnboarding, setPendingOnboarding, openOnboardingModal } =
    useAuthStore();
  const hasChecked = useRef(false);

  // Wait for auth state to rehydrate from storage before checking
  useEffect(() => {
    if (!isHydrated || hasChecked.current) return;
    hasChecked.current = true;

    // Check for actual internet connectivity
    isActuallyOnline().then((online) => {
      // If offline and we have a persisted user, skip network checkAuth
      if (!online && (user || isAuthenticated)) {
        return;
      }

      // Online or no cached user - do network check
      checkAuth();
    });
  }, [isHydrated, user, isAuthenticated, checkAuth]);

  useEffect(() => {
    if (user && pendingOnboarding && (user.prefs as AccountPrefs).hasSeenOnboarding !== 'TRUE') {
      setPendingOnboarding(false);

      const hasExistingPreferences =
        (user.profile?.favoriteGenres?.length ?? 0) > 0 ||
        (user.profile?.favoriteNetworks?.length ?? 0) > 0 ||
        (user.profile?.contentPreferences?.length ?? 0) > 0;

      if (!hasExistingPreferences) {
        setTimeout(() => {
          openOnboardingModal();
        }, 800);
      }
    }
  }, [user, pendingOnboarding, setPendingOnboarding, openOnboardingModal]);
}
