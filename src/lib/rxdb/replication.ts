import { RxReplicationState } from 'rxdb/plugins/replication';
import { Subscription } from 'rxjs';
import { queryClient } from '@/lib/react-query';
import client, { DATABASE_ID, TABLES } from '@/lib/appwrite';
import { AppwriteCheckpointType, replicateAppwrite } from '@/lib/appwrite/appwrite-replication';
import { getWatchfolioDB } from './database';
import { useSyncStore, SyncStatus } from '@/stores/useSyncStore';
import { LIBRARY_SYNC_DEBOUNCE_MS, LIBRARY_SYNC_SAFETY_FLUSH_INTERVAL_MS } from '@/config/app';

let replicationState: RxReplicationState<LibraryMedia, AppwriteCheckpointType> | null = null;
let receivedSubscription: Subscription | null = null;
let currentUserId: string | null = null;
let forcePushFlush: (() => Promise<void>) | null = null;
let cleanupPushHandler: (() => void) | null = null;
let flushReadyListener: ((event: Event) => void) | null = null;
let syncTimeout: NodeJS.Timeout | null = null;
let beforeUnloadHandler: (() => void) | null = null;
let visibilityChangeHandler: (() => void) | null = null;
let safetyFlushInterval: NodeJS.Timeout | null = null;

const setSyncStatus = (status: SyncStatus) => useSyncStore.getState().setSyncStatus(status);

export const startReplication = async (userId: string, library: string | null) => {
  if (!userId?.trim()) {
    throw new Error('User ID is required');
  }

  if (currentUserId && currentUserId !== userId) {
    await stopReplication();
  }

  if (currentUserId === userId && replicationState) {
    log('Replication already active for user:', userId);
    return;
  }

  log('Starting replication for user:', userId);
  setSyncStatus('connecting');
  currentUserId = userId;

  // Remove old listener if exists
  if (flushReadyListener && typeof window !== 'undefined') {
    window.removeEventListener('sync-flush-ready', flushReadyListener);
  }

  // Listen for flush function from debounced push handler
  flushReadyListener = (event: Event) => {
    const detail = (event as CustomEvent<{ flush: () => Promise<void>; cleanup: () => void }>).detail;
    forcePushFlush = detail.flush;
    cleanupPushHandler = detail.cleanup;
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('sync-flush-ready', flushReadyListener);

    // Clean up old lifecycle handlers if they exist
    if (beforeUnloadHandler) {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
    if (visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
    }

    // Force flush on page unload to prevent data loss
    beforeUnloadHandler = () => {
      if (forcePushFlush) {
        forcePushFlush();
      }
    };

    // Force flush when tab becomes hidden (user switches tabs/apps)
    visibilityChangeHandler = () => {
      if (document.hidden && forcePushFlush) {
        forcePushFlush();
      }
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
    document.addEventListener('visibilitychange', visibilityChangeHandler);

    // Periodic safety flush - flushes pending changes every interval
    // This ensures data is synced even if user keeps the app open for extended periods
    if (safetyFlushInterval) {
      clearInterval(safetyFlushInterval);
    }

    safetyFlushInterval = setInterval(() => {
      const pendingCount = useSyncStore.getState().pendingChanges;
      if (forcePushFlush && pendingCount > 0) {
        log(`⏰ Safety flush triggered (${pendingCount} pending change${pendingCount > 1 ? 's' : ''})`);
        forcePushFlush();
      }
    }, LIBRARY_SYNC_SAFETY_FLUSH_INTERVAL_MS);
  }

  try {
    const db = await getWatchfolioDB();

    replicationState = replicateAppwrite({
      replicationIdentifier: `watchfolio-library-${userId}`,
      client,
      databaseId: DATABASE_ID,
      tableId: TABLES.LIBRARY_MEDIA,
      userId,
      deletedField: 'deleted',
      collection: db.libraryMedia,
      waitForLeadership: true,
      retryTime: 5000,
      autoStart: true,
      live: true,
      pull: {
        batchSize: 25,
        modifier: (doc) => ({
          ...doc,
          status: doc.status || 'none',
          isFavorite: Boolean(doc.isFavorite),
          addedAt: doc.addedAt || new Date().toISOString(),
          lastUpdatedAt: doc.lastUpdatedAt || new Date().toISOString(),
        }),
      },
      push: {
        batchSize: 25,
        debounceMs: LIBRARY_SYNC_DEBOUNCE_MS,
        modifier: (doc) => {
          const cleanDoc = {
            ...doc,
            library,
            userId,
            lastUpdatedAt: new Date().toISOString(),
          };
          // Appwrite doesn't accept undefined values, so we remove them
          Object.keys(cleanDoc).forEach((key) => {
            if (cleanDoc[key] === undefined) {
              delete cleanDoc[key];
            }
          });
          return cleanDoc;
        },
      },
    });

    // --- Automatic Query Invalidation Logic ---
    if (receivedSubscription) {
      receivedSubscription.unsubscribe();
    }
    receivedSubscription = replicationState.received$.pipe().subscribe((data) => {
      log('Data received from sync, invalidating queries...', data);
      // Invalidate queries to trigger UI updates
      queryClient.invalidateQueries({ queryKey: ['library'] });
      queryClient.invalidateQueries({ queryKey: ['libraryCount'] });
    });
    // -----------------------------------------

    replicationState.error$.subscribe((error) => {
      log('ERR', 'Replication error:', error);
      setSyncStatus('error');
    });

    // Track actual network sync activity, not just pending changes
    replicationState.received$.subscribe((received) => {
      log('Received from server:', received);
      setSyncStatus('syncing');

      // Reset to online after brief delay
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        if (useSyncStore.getState().pendingChanges === 0) {
          setSyncStatus('online');
        }
      }, 500);
    });

    replicationState.sent$.subscribe((sent) => {
      log('Sent to server:', sent);
      setSyncStatus('syncing');

      // Reset to online after brief delay
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        if (useSyncStore.getState().pendingChanges === 0) {
          setSyncStatus('online');
        }
      }, 500);
    });

    setSyncStatus('online');
    log('Replication started successfully');

    return replicationState;
  } catch (error) {
    log('ERR', 'Failed to start replication:', error);
    setSyncStatus('error');
    currentUserId = null;
    replicationState = null;
    throw error;
  }
};

export const stopReplication = async (): Promise<void> => {
  // Clean up subscriptions
  if (receivedSubscription) {
    receivedSubscription.unsubscribe();
    receivedSubscription = null;
  }

  // Clean up timers
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }

  // Clean up safety flush interval
  if (safetyFlushInterval) {
    clearInterval(safetyFlushInterval);
    safetyFlushInterval = null;
  }

  // Clean up event listeners
  if (flushReadyListener && typeof window !== 'undefined') {
    window.removeEventListener('sync-flush-ready', flushReadyListener);
    flushReadyListener = null;
  }

  // Clean up lifecycle event listeners
  if (typeof window !== 'undefined') {
    if (beforeUnloadHandler) {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      beforeUnloadHandler = null;
    }
    if (visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
      visibilityChangeHandler = null;
    }
  }

  // Clean up push handler (flush pending changes and clear timer)
  if (cleanupPushHandler) {
    cleanupPushHandler();
    cleanupPushHandler = null;
  }

  if (!replicationState) {
    log('No replication to stop');
    forcePushFlush = null;
    currentUserId = null;
    setSyncStatus('offline');
    return;
  }

  log('Stopping replication');
  try {
    await replicationState.cancel();
  } catch (error) {
    console.warn('Error stopping replication:', error);
  } finally {
    replicationState = null;
    currentUserId = null;
    forcePushFlush = null;
    setSyncStatus('offline');
    log('Replication stopped');
  }
};

export const triggerSync = async (): Promise<void> => {
  if (!replicationState) throw new Error('Replication not initialized');
  log('Triggering re-sync on active replication');
  await replicationState.reSync();
};

export const forcePushPendingChanges = async (): Promise<void> => {
  if (!forcePushFlush) {
    log('No pending changes to force push');
    return;
  }
  log('Force pushing pending changes...');
  await forcePushFlush();
  log('Force push completed');
};

export const isReplicationActive = (): boolean => Boolean(replicationState);
