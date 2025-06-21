import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { syncAPI } from '@/lib/api/sync-service';
import { LOCAL_STORAGE_PREFIX } from '@/utils/constants';

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

  // Enhanced sync operations
  checkSyncStatus: (library: LibraryCollection) => Promise<SyncComparison | null>;
  smartSync: (library: LibraryCollection) => Promise<{
    mergedLibrary: LibraryCollection;
    changes: string[];
    uploadedCount: number;
  }>;

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
    lastSyncTime: localStorage.getItem(`${LOCAL_STORAGE_PREFIX}last-sync`),
    pendingOperations: 0,
    error: null,
  },
  queue: [],

  // Queue management
  addToQueue: (operation) => {
    set((state) => ({
      queue: [...state.queue, operation],
      status: { ...state.status, pendingOperations: state.queue.length + 1 },
    }));
  },

  removeFromQueue: (index) => {
    set((state) => {
      const newQueue = state.queue.filter((_, i) => i !== index);
      return {
        queue: newQueue,
        status: { ...state.status, pendingOperations: newQueue.length },
      };
    });
  },

  clearQueue: () => {
    set((state) => ({
      queue: [],
      status: { ...state.status, pendingOperations: 0 },
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

  checkSyncStatus: async (library) => {
    try {
      return await syncAPI.compareWithCloud(library);
    } catch (error) {
      console.error('Failed to check sync status:', error);
      return null;
    }
  },

  smartSync: async (library) => {
    const { setSyncStatus, setError, updateLastSyncTime } = get();

    try {
      setSyncStatus(true);
      setError(null);

      const result = await syncAPI.smartSync(library);

      updateLastSyncTime();
      console.log(`✅ Smart sync completed: ${result.changes.length} changes, ${result.uploadedCount} uploaded`);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Smart sync failed';
      setError(errorMessage);
      console.error('❌ Smart sync failed:', error);
      throw error;
    } finally {
      setSyncStatus(false);
    }
  },

  // Status management
  setOnlineStatus: (isOnline) => {
    set((state) => ({
      status: { ...state.status, isOnline },
    }));
  },

  setSyncStatus: (isSyncing) => {
    set((state) => ({
      status: { ...state.status, isSyncing },
    }));
  },

  setError: (error) => {
    set((state) => ({
      status: { ...state.status, error },
    }));
  },

  updateLastSyncTime: () => {
    const now = new Date().toISOString();
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}last-sync`, now);
    set((state) => ({
      status: { ...state.status, lastSyncTime: now },
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

if (import.meta.env.DEV) mountStoreDevtool('SyncStore', useSyncStore);
