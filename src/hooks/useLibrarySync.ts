import { useEffect, useState, useRef } from 'react';
import { useSyncStore } from '@/stores/useSyncStore';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { LIBRARY_SYNC_DELAY, LOCAL_STORAGE_PREFIX } from '@/utils/constants';

export function useLibrarySync() {
  const syncStore = useSyncStore();
  const library = useLibraryStore((state) => state.library);
  const { isAuthenticated } = useAuthStore();
  const [isSyncInProgress, setIsSyncInProgress] = useState(false);
  const hasPerformedInitialSync = useRef(false);

  // Can only sync when online AND authenticated
  const canSync = syncStore.status.isOnline && isAuthenticated;

  // Initial sync when user becomes authenticated
  useEffect(() => {
    if (canSync && !hasPerformedInitialSync.current && !isSyncInProgress) {
      hasPerformedInitialSync.current = true;

      console.log('🚀 Performing automatic initial sync');

      setTimeout(async () => {
        try {
          const result = await syncStore.smartSync(library);
          if (result && Object.keys(result.mergedLibrary).length > 0) {
            const { importLibrary } = useLibraryStore.getState();
            importLibrary(Object.values(result.mergedLibrary), {
              mergeStrategy: 'overwrite',
              keepExistingFavorites: false,
            });
            console.log('✅ Initial sync completed automatically');
          }
        } catch (error) {
          console.error('❌ Initial sync failed:', error);
        }
      }, 1000);
    }
  }, [canSync, isSyncInProgress, library, syncStore]);

  // Auto-sync for user changes (handles all operations: adds, updates, removes)
  useEffect(() => {
    const autoSyncEnabled = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}auto-sync`) !== 'false';

    if (!autoSyncEnabled || !canSync || isSyncInProgress || syncStore.status.isSyncing) return;

    const timeoutId = setTimeout(async () => {
      try {
        const syncStatus = await syncStore.checkSyncStatus(library);
        if (syncStatus && (syncStatus.needsUpload > 0 || syncStatus.needsDownload > 0)) {
          console.log(`🔄 Auto-syncing: ${syncStatus.needsUpload} to upload, ${syncStatus.needsDownload} to download`);
          setIsSyncInProgress(true);
          try {
            await syncStore.syncToCloud(library);
          } finally {
            setIsSyncInProgress(false);
          }
        }
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, LIBRARY_SYNC_DELAY);

    return () => clearTimeout(timeoutId);
  }, [library, canSync, isSyncInProgress, syncStore]);
}
