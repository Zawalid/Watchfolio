import { create } from 'zustand';
import { triggerSync, isReplicationActive, startReplication, stopReplication } from '@/lib/rxdb';
import { useAuthStore } from './useAuthStore';

export type SyncStatus = 'offline' | 'connecting' | 'online' | 'syncing' | 'error';

interface SyncState {
  syncStatus: SyncStatus;
  lastSyncTime: string | null;
  setSyncStatus: (status: SyncStatus) => void;
  startSync: () => Promise<void>;
  stopSync: () => Promise<void>;
  manualSync: () => Promise<void>;
  toggleAutoSync: (enabled: boolean) => Promise<void>;
}

export const useSyncStore = create<SyncState>()((set, get) => ({
  syncStatus: 'offline',
  lastSyncTime: null,

  setSyncStatus: (status) => {
    const oldStatus = get().syncStatus;
    if (oldStatus === 'syncing' && (status === 'online' || status === 'offline')) {
      set({ lastSyncTime: new Date().toISOString() });
    }
    set({ syncStatus: status });
  },

  startSync: async () => {
    const { user } = useAuthStore.getState();
    if (user && user.profile.preferences.autoSync) {
      try {
        await startReplication(user.$id, user.profile.library?.$id || null);
      } catch (error) {
        log("ERR", 'Failed to start sync:', error);
        get().setSyncStatus('error');
      }
    }
  },

  stopSync: async () => {
    await stopReplication();
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
      log("ERR", 'Manual sync failed:', error);
      if (isReplicationActive()) {
        await stopReplication();
      }
      throw error;
    }
  },

  toggleAutoSync: async (enabled: boolean) => {
    const { user, updateUserPreferences } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    await updateUserPreferences({ autoSync: enabled });

    if (enabled) {
      await startReplication(user.$id, user.profile.library?.$id || null);
    } else {
      await stopReplication();
    }
  },
}));
