import { RxReplicationState } from 'rxdb/plugins/replication';
import { Subscription } from 'rxjs';
import { queryClient } from '@/lib/react-query';
import client, { DATABASE_ID, TABLES } from '@/lib/appwrite';
import { AppwriteCheckpointType, replicateAppwrite } from '@/lib/appwrite/appwrite-replication';
import { getWatchfolioDB } from './database';
import { useSyncStore, SyncStatus } from '@/stores/useSyncStore';

let replicationState: RxReplicationState<LibraryMedia, AppwriteCheckpointType> | null = null;
let receivedSubscription: Subscription | null = null; // To hold the subscription
let currentUserId: string | null = null;



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
      console.error('Replication error:', error);
      setSyncStatus('error');
    });

    replicationState.active$.subscribe((active) => {
      setSyncStatus(active ? 'syncing' : 'online');
      log('Replication', active ? 'active' : 'inactive');
    });

    replicationState.received$.subscribe((received) => {
      log('Received from server:', received);
    });

    replicationState.sent$.subscribe((sent) => {
      log('Sent to server:', sent);
    });

    setSyncStatus('online');
    log('Replication started successfully');

    return replicationState;
  } catch (error) {
    console.error('Failed to start replication:', error);
    setSyncStatus('error');
    currentUserId = null;
    replicationState = null;
    throw error;
  }
};

export const stopReplication = async (): Promise<void> => {
  if (receivedSubscription) {
    receivedSubscription.unsubscribe();
    receivedSubscription = null;
  }

  if (!replicationState) {
    log('No replication to stop');
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
    setSyncStatus('offline');
    log('Replication stopped');
  }
};

export const triggerSync = async (): Promise<void> => {
  if (!replicationState) throw new Error('Replication not initialized');
  log('Triggering re-sync on active replication');
  await replicationState.reSync();
};

export const isReplicationActive = (): boolean => Boolean(replicationState);
