// Hook for managing library sync operations
import { useEffect } from 'react';
import { useSyncStore } from '@/stores/useSyncStore';
import { useLibraryStore } from '@/stores/useLibraryStore';

export function useLibrarySync() {
  const syncStore = useSyncStore();
  const libraryStore = useLibraryStore();

  // Auto-sync when coming back online
  useEffect(() => {
    if (syncStore.status.isOnline && syncStore.queue.length > 0) {
      // Process pending operations when back online
      const processQueue = async () => {
        for (const operation of syncStore.queue) {
          try {
            switch (operation.type) {
              case 'create':
              case 'update':
                if (operation.data) {
                  await syncStore.syncSingleItem(operation.data);
                }
                break;
              case 'delete': {
                const [mediaType, id] = operation.key.split('-');
                await syncStore.removeFromCloud(mediaType as 'movie' | 'tv', parseInt(id));
                break;
              }
            }
            // Remove processed operation from queue
            const operationIndex = syncStore.queue.indexOf(operation);
            if (operationIndex > -1) {
              syncStore.removeFromQueue(operationIndex);
            }
          } catch (error) {
            console.error('Failed to process queued operation:', error);
            // Keep failed operations in queue for next retry
          }
        }
      };

      processQueue();
    }
  }, [syncStore]);

  // Manual sync functions
  const syncToCloud = async () => {
    const library = libraryStore.library;
    await syncStore.syncToCloud(library);
  };

  const syncFromCloud = async () => {
    try {
      const cloudLibrary = await syncStore.syncFromCloud();

      // Merge cloud library with local (you can customize merge strategy)
      if (cloudLibrary && Object.keys(cloudLibrary).length > 0) {
        // Simple strategy: cloud takes precedence for conflicts
        const mergedLibrary = { ...libraryStore.library, ...cloudLibrary };

        // Update local store
        libraryStore.clearLibrary();
        Object.values(mergedLibrary).forEach((item) => {
          libraryStore.addOrUpdateItem(item);
        });
      }
    } catch (error) {
      console.error('Failed to sync from cloud:', error);
    }
  };

  const forceSyncAll = async () => {
    await syncToCloud();
    await syncFromCloud();
  };
  return {
    // Status
    isOnline: syncStore.status.isOnline,
    isSyncing: syncStore.status.isSyncing,
    lastSyncTime: syncStore.status.lastSyncTime,
    pendingOperations: syncStore.status.pendingOperations,
    error: syncStore.status.error,

    // Actions
    syncToCloud,
    syncFromCloud,
    forceSyncAll,
    clearError: syncStore.setError.bind(null, null),

    // Queue info
    queueLength: syncStore.queue.length,
  };
}

// Hook for displaying sync status in UI
export function useSyncStatus() {
  const { isOnline, isSyncing, lastSyncTime, pendingOperations, error } = useLibrarySync();

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Syncing...';
    if (pendingOperations > 0) return `${pendingOperations} pending`;
    if (lastSyncTime) {
      const lastSync = new Date(lastSyncTime);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));

      if (diffMinutes < 1) return 'Just synced';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
    return 'Not synced';
  };

  const getStatusColor = () => {
    if (error) return 'text-red-400';
    if (!isOnline) return 'text-gray-400';
    if (isSyncing) return 'text-blue-400';
    if (pendingOperations > 0) return 'text-yellow-400';
    return 'text-green-400';
  };

  return {
    statusText: getStatusText(),
    statusColor: getStatusColor(),
    isOnline,
    isSyncing,
    hasError: !!error,
    error,
    pendingOperations,
  };
}
