import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { AccountPrefs } from '@/lib/appwrite/types';

export function useInitialAuth() {
  const { user, checkAuth, pendingOnboarding, setPendingOnboarding, openOnboardingModal } = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    checkAuth();
  }, [user, checkAuth]);

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
