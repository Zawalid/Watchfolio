import { RxReplicationState } from 'rxdb/plugins/replication';
import client, { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { AppwriteCheckpointType, replicateAppwrite } from '@/lib/appwrite/appwrite-replication';
import { getWatchfolioDB } from './database';
import { useLibraryStore } from '@/stores/useLibraryStore';

let replicationState: RxReplicationState<LibraryMedia, AppwriteCheckpointType> | null = null;
let currentUserId: string | null = null;

const setSyncStatus = (status: SyncStatus) => useLibraryStore.getState().setSyncStatus(status);

export const startReplication = async (userId: string, library: LibraryMedia['library']) => {
  if (!userId?.trim()) {
    throw new Error('User ID is required');
  }

  if (currentUserId && currentUserId !== userId) {
    await stopReplication();
  }

  if (currentUserId === userId && replicationState) {
    console.log('Replication already active for user:', userId);
    return;
  }

  console.log('Starting replication for user:', userId);
  setSyncStatus('connecting');
  currentUserId = userId;

  try {
    const db = await getWatchfolioDB();

    replicationState = replicateAppwrite({
      replicationIdentifier: `watchfolio-library-${userId}`,
      client,
      databaseId: DATABASE_ID,
      collectionId: COLLECTIONS.LIBRARY_MEDIA,
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
            library: library?.$id || null,
            userId,
            lastUpdatedAt: new Date().toISOString(),
          };
          Object.keys(cleanDoc).forEach((key) => {
            if (cleanDoc[key] === undefined) {
              delete cleanDoc[key];
            }
          });
          return cleanDoc;
        },
      },
    });

    replicationState.error$.subscribe((error) => {
      console.error('Replication error:', error);
      setSyncStatus('error');
    });

    replicationState.active$.subscribe((active) => {
      setSyncStatus(active ? 'syncing' : 'online');
      console.log('Replication', active ? 'active' : 'inactive');
    });

    replicationState.received$.subscribe((received) => {
      console.log('Received from server:', received);
      if (received) useLibraryStore.getState().addOrUpdateItemLocally(received);
    });

    replicationState.sent$.subscribe((sent) => {
      console.log('Sent to server:', sent);
    });

    setSyncStatus('online');
    console.log('Replication started successfully');

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
  if (!replicationState) {
    console.log('No replication to stop');
    return;
  }

  console.log('Stopping replication');
  try {
    await replicationState.cancel();
  } catch (error) {
    console.warn('Error stopping replication:', error);
  } finally {
    replicationState = null;
    currentUserId = null;
    setSyncStatus('offline');
    console.log('Replication stopped');
  }
};

export const triggerSync = async (): Promise<void> => {
  if (!replicationState) throw new Error('Replication not initialized');
  console.log('Triggering re-sync on active replication');
  await replicationState.reSync();
};

export const isReplicationActive = (): boolean => Boolean(replicationState);
