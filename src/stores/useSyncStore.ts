import { create } from 'zustand';
import { triggerSync, isReplicationActive, startReplication, stopReplication, forcePushPendingChanges } from '@/lib/rxdb';
import { useAuthStore } from './useAuthStore';

export type SyncStatus = 'offline' | 'connecting' | 'online' | 'syncing' | 'error';

interface SyncState {
  syncStatus: SyncStatus;
  lastSyncTime: string | null;
  pendingChanges: number;
  setSyncStatus: (status: SyncStatus) => void;
  setPendingChanges: (count: number) => void;
  startSync: () => Promise<void>;
  stopSync: () => Promise<void>;
  triggerSync: () => Promise<void>;
  forcePush: () => Promise<void>;
  toggleAutoSync: (enabled: boolean) => Promise<void>;
}

export const useSyncStore = create<SyncState>()((set, get) => ({
  syncStatus: 'offline',
  lastSyncTime: null,
  pendingChanges: 0,

  setSyncStatus: (status) => {
    const oldStatus = get().syncStatus;
    if (oldStatus === 'syncing' && (status === 'online' || status === 'offline')) {
      set({ lastSyncTime: new Date().toISOString() });
    }
    set({ syncStatus: status });
  },

  setPendingChanges: (count) => {
    set({ pendingChanges: count });
  },

  startSync: async () => {
    const { user } = useAuthStore.getState();
    if (user && user.profile.preferences.autoSync) {
      try {
        await startReplication(user.$id, user.profile.library || null);
      } catch (error) {
        log("ERR", 'Failed to start sync:', error);
        get().setSyncStatus('error');
      }
    }
  },

  stopSync: async () => {
    await stopReplication();
  },

  triggerSync: async () => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    // Set status to syncing to show loading state
    get().setSyncStatus('syncing');

    try {
      if (isReplicationActive()) {
        await forcePushPendingChanges();
        await triggerSync();
      } else {
        const tempReplication = await startReplication(user.$id, user.profile.library || null);
        if (tempReplication) {
          await tempReplication.awaitInitialReplication();
          await stopReplication();
        }
      }

      // Set status back to online after successful sync
      get().setSyncStatus('online');
    } catch (error) {
      log("ERR", 'Manual sync failed:', error);
      get().setSyncStatus('error');
      if (isReplicationActive()) {
        await stopReplication();
      }
      throw error;
    }
  },

  forcePush: async () => {
    if (!isReplicationActive()) {
      log('Replication not active, cannot force push');
      return;
    }
    await forcePushPendingChanges();
  },

  toggleAutoSync: async (enabled: boolean) => {
    const { user, updateUserPreferences } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    await updateUserPreferences({ autoSync: enabled });

    if (enabled) {
      await startReplication(user.$id, user.profile.library || null);
    } else {
      await stopReplication();
    }
  },
}));

// Set up pending changes listener (only once at module load)
if (typeof window !== 'undefined') {
  const handlePendingChanges = ((event: CustomEvent<number>) => {
    useSyncStore.getState().setPendingChanges(event.detail);
  }) as EventListener;

  window.addEventListener('sync-pending-changes', handlePendingChanges);

  // Clean up on window unload
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('sync-pending-changes', handlePendingChanges);
  });
}
