import { create } from 'zustand';
import { syncAPI, type SyncStatus, type SyncOperation } from '../lib/api/sync-service';

interface SyncStore {
  // State
  status: SyncStatus;
  queue: SyncOperation[];

  // Actions
  addToQueue: (operation: SyncOperation) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  // Sync operations
  syncToCloud: (library: LibraryCollection) => Promise<void>;
  syncFromCloud: () => Promise<LibraryCollection>;
  syncSingleItem: (media: LibraryMedia) => Promise<void>;
  removeFromCloud: (mediaType: 'movie' | 'tv', id: number) => Promise<void>;

  // Status management
  setOnlineStatus: (isOnline: boolean) => void;
  setSyncStatus: (isSyncing: boolean) => void;
  setError: (error: string | null) => void;
  updateLastSyncTime: () => void;
}

export const useSyncStore = create<SyncStore>((set, get) => ({
  // Initial state
  status: {
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: localStorage.getItem('watchfolio-last-sync'),
    pendingOperations: 0,
    error: null,
  },
  queue: [],

  // Queue management
  addToQueue: (operation) => {
    set((state) => ({
      queue: [...state.queue, operation],
      status: {
        ...state.status,
        pendingOperations: state.queue.length + 1,
      },
    }));
  },

  removeFromQueue: (index) => {
    set((state) => {
      const newQueue = state.queue.filter((_, i) => i !== index);
      return {
        queue: newQueue,
        status: {
          ...state.status,
          pendingOperations: newQueue.length,
        },
      };
    });
  },

  clearQueue: () => {
    set((state) => ({
      queue: [],
      status: {
        ...state.status,
        pendingOperations: 0,
      },
    }));
  },

  // Sync operations
  syncToCloud: async (library) => {
    const { setSyncStatus, setError, updateLastSyncTime } = get();

    try {
      setSyncStatus(true);
      setError(null);

      await syncAPI.syncToCloud(library);

      updateLastSyncTime();
      console.log('✅ Library synced to cloud successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      setError(errorMessage);
      console.error('❌ Sync to cloud failed:', error);
      throw error;
    } finally {
      setSyncStatus(false);
    }
  },

  syncFromCloud: async () => {
    const { setSyncStatus, setError, updateLastSyncTime } = get();

    try {
      setSyncStatus(true);
      setError(null);

      const cloudLibrary = await syncAPI.getLibraryFromCloud();

      updateLastSyncTime();
      console.log('✅ Library synced from cloud successfully');
      return cloudLibrary;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      setError(errorMessage);
      console.error('❌ Sync from cloud failed:', error);
      throw error;
    } finally {
      setSyncStatus(false);
    }
  },

  syncSingleItem: async (media) => {
    const { setError } = get();

    try {
      setError(null);
      await syncAPI.syncItemToCloud(media);
      console.log(`✅ Item ${media.media_type}-${media.id} synced to cloud`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Item sync failed';
      setError(errorMessage);
      console.error(`❌ Item sync failed for ${media.media_type}-${media.id}:`, error);

      // Add to queue for retry
      get().addToQueue({
        type: 'update',
        key: `${media.media_type}-${media.id}`,
        data: media,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  },

  removeFromCloud: async (mediaType, id) => {
    const { setError } = get();

    try {
      setError(null);
      await syncAPI.removeFromCloud(mediaType, id);
      console.log(`✅ Item ${mediaType}-${id} removed from cloud`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Remove failed';
      setError(errorMessage);
      console.error(`❌ Remove failed for ${mediaType}-${id}:`, error);

      // Add to queue for retry
      get().addToQueue({
        type: 'delete',
        key: `${mediaType}-${id}`,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  },

  // Status management
  setOnlineStatus: (isOnline) => {
    set((state) => ({
      status: {
        ...state.status,
        isOnline,
      },
    }));
  },

  setSyncStatus: (isSyncing) => {
    set((state) => ({
      status: {
        ...state.status,
        isSyncing,
      },
    }));
  },

  setError: (error) => {
    set((state) => ({
      status: {
        ...state.status,
        error,
      },
    }));
  },

  updateLastSyncTime: () => {
    const now = new Date().toISOString();
    localStorage.setItem('watchfolio-last-sync', now);
    set((state) => ({
      status: {
        ...state.status,
        lastSyncTime: now,
      },
    }));
  },
}));

// Listen for online/offline status
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useSyncStore.getState().setOnlineStatus(true);
  });

  window.addEventListener('offline', () => {
    useSyncStore.getState().setOnlineStatus(false);
  });
}
