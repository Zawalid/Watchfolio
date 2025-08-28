import { create } from 'zustand';
import { triggerSync, isReplicationActive, startReplication, stopReplication } from '@/lib/rxdb';
import { useAuthStore } from './useAuthStore';

export type SyncStatus = 'offline' | 'connecting' | 'online' | 'syncing' | 'error';

interface LibraryState {
  isLoading: boolean;
  error: string | null;
  syncStatus: SyncStatus;
  lastSyncTime: string | null;

  clearError: () => void;
  setSyncStatus: (status: SyncStatus) => void;
  manualSync: () => Promise<void>;
}

export const useLibraryStore = create<LibraryState>()((set, get) => ({
  isLoading: false,
  error: null,
  syncStatus: 'offline',
  lastSyncTime: null,

  clearError: () => {
    set({ error: null });
  },

  setSyncStatus: (status) => {
    const oldStatus = get().syncStatus;
    if (oldStatus === 'syncing' && (status === 'online' || status === 'offline')) {
      set({ lastSyncTime: new Date().toISOString() });
    }
    set({ syncStatus: status });
  },

  manualSync: async () => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    if (isReplicationActive()) {
      await triggerSync();
      return;
    }

    try {
      const tempReplication = await startReplication(user.$id, user.profile.library?.$id || null);
      if (tempReplication) {
        await tempReplication.awaitInitialReplication();
        await stopReplication();
      }
    } catch (error) {
      console.error('Manual sync failed:', error);
      if (isReplicationActive()) {
        await stopReplication();
      }
      throw error;
    }
  },
}));
