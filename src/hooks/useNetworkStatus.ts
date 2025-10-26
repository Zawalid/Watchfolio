import { useState, useEffect } from 'react';
import { useSyncStore } from '@/stores/useSyncStore';
import { isActuallyOnline } from '@/utils/connectivity';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial connectivity check
    isActuallyOnline().then(setIsOnline);

    const handleOnline = async () => {
      // Verify we actually have internet (not just network adapter)
      const online = await isActuallyOnline();
      setIsOnline(online);

      // Auto-resume sync when network returns
      if (online) {
        const syncStore = useSyncStore.getState();
        if (syncStore.syncStatus === 'offline' || syncStore.syncStatus === 'error') {
          syncStore.startSync().catch(() => {
            // Silently handle sync resume errors
          });
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Periodic connectivity check (every 30s) to catch changes that don't fire events
    const intervalId = setInterval(async () => {
      const online = await isActuallyOnline();
      setIsOnline(online);
    }, 30000);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  return isOnline;
}
