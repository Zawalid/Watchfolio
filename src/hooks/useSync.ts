/**
 * useSync Hook - Easy access to sync functionality in components
 * Integrates with authentication system - only syncs when user is logged in
 */

import { useCallback, useEffect } from 'react';
import { useSyncStore } from '@/stores/useSyncStore';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useAuthStore } from '@/stores/useAuthStore';
import type { SyncStatus } from '@/lib/api/sync-service';

export interface UseSyncReturn {
  // Status
  status: SyncStatus;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingOperations: number;
  error: string | null;

  // Auth integration
  isAuthenticated: boolean;
  canSync: boolean; // isOnline && isAuthenticated

  // Actions
  syncToCloud: () => Promise<void>;
  syncFromCloud: () => Promise<void>;
  syncItem: (media: LibraryMedia) => Promise<void>;
  removeFromCloud: (mediaType: 'movie' | 'tv', id: number) => Promise<void>;
  clearError: () => void;

  // Auto-sync controls
  enableAutoSync: () => void;
  disableAutoSync: () => void;
}

export function useSync(): UseSyncReturn {
  const syncStore = useSyncStore();
  const library = useLibraryStore((state) => state.library);
  const { isAuthenticated } = useAuthStore();

  // Can only sync when online AND authenticated
  const canSync = syncStore.status.isOnline && isAuthenticated;
  // Sync to cloud (only if authenticated)
  const syncToCloud = useCallback(async () => {
    if (!canSync) {
      console.log('Skipping sync - user not authenticated or offline');
      return;
    }
    await syncStore.syncToCloud(library);
  }, [library, syncStore, canSync]);

  // Sync from cloud and merge with local (only if authenticated)
  const syncFromCloud = useCallback(async () => {
    if (!canSync) {
      console.log('Skipping sync from cloud - user not authenticated or offline');
      return;
    }

    try {
      const cloudLibrary = await syncStore.syncFromCloud();

      // Merge cloud data with local (cloud wins for conflicts)
      const { importLibrary } = useLibraryStore.getState();
      const cloudItems = Object.values(cloudLibrary);

      if (cloudItems.length > 0) {
        importLibrary(cloudItems, {
          mergeStrategy: 'smart',
          keepExistingFavorites: false, // Cloud data wins
        });
      }
    } catch (error) {
      console.error('Sync from cloud failed:', error);
      throw error;
    }
  }, [syncStore, canSync]);

  // Sync single item (only if authenticated)
  const syncItem = useCallback(
    async (media: LibraryMedia) => {
      if (!canSync) {
        console.log(`Skipping sync for ${media.media_type}-${media.id} - user not authenticated or offline`);
        return;
      }
      await syncStore.syncSingleItem(media);
    },
    [syncStore, canSync]
  );

  // Remove from cloud (only if authenticated)
  const removeFromCloud = useCallback(
    async (mediaType: 'movie' | 'tv', id: number) => {
      await syncStore.removeFromCloud(mediaType, id);
    },
    [syncStore]
  );

  // Clear error
  const clearError = useCallback(() => {
    syncStore.setError(null);
  }, [syncStore]);

  // Auto-sync setup
  const enableAutoSync = useCallback(() => {
    localStorage.setItem('watchfolio-auto-sync', 'true');
  }, []);

  const disableAutoSync = useCallback(() => {
    localStorage.setItem('watchfolio-auto-sync', 'false');
  }, []);
  // Auto-sync on library changes (debounced) - only when authenticated
  useEffect(() => {
    const autoSyncEnabled = localStorage.getItem('watchfolio-auto-sync') !== 'false';
    if (!autoSyncEnabled || !canSync) return;

    const timeoutId = setTimeout(() => {
      syncToCloud().catch(console.error);
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeoutId);
  }, [library, syncToCloud, canSync]);
  return {
    // Status
    status: syncStore.status,
    isOnline: syncStore.status.isOnline,
    isSyncing: syncStore.status.isSyncing,
    lastSyncTime: syncStore.status.lastSyncTime,
    pendingOperations: syncStore.status.pendingOperations,
    error: syncStore.status.error,

    // Auth integration
    isAuthenticated,
    canSync,

    // Actions
    syncToCloud,
    syncFromCloud,
    syncItem,
    removeFromCloud,
    clearError,

    // Auto-sync controls
    enableAutoSync,
    disableAutoSync,
  };
}

// Hook for just sync status (lightweight)
export function useSyncStatus() {
  const { status } = useSyncStore();
  return status;
}
