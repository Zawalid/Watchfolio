import client, { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { replicateAppwrite, RxAppwriteReplicationState } from '@/lib/appwrite/appwrite-replication';
import { getWatchfolioDB } from './database';

type SyncStatus = 'offline' | 'connecting' | 'online' | 'syncing' | 'error';

// Global state
export let syncStatus: SyncStatus = 'offline';
let replicationState: RxAppwriteReplicationState<LibraryMedia> | null = null;
let currentUserId: string | null = null;

export const startReplication = async (userId: string, library: LibraryMedia['library']): Promise<void> => {
    if (!userId?.trim()) {
        throw new Error('User ID is required');
    }

    // Stop existing replication if different user
    if (currentUserId && currentUserId !== userId) {
        await stopReplication();
    }

    // Return early if already running for same user
    if (currentUserId === userId && replicationState) {
        console.log('Replication already active for user:', userId);
        return;
    }

    console.log('Starting replication for user:', userId);
    syncStatus = 'connecting';
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
                        lastUpdatedAt: new Date().toISOString(),
                    };

                    // Remove undefined values
                    Object.keys(cleanDoc).forEach(key => {
                        if (cleanDoc[key] === undefined) {
                            delete cleanDoc[key];
                        }
                    });

                    return cleanDoc;
                },
            },
        });

        // Set up event handlers
        replicationState.error$.subscribe(error => {
            console.error('Replication error:', error);
            syncStatus = 'error';
        });

        replicationState.active$.subscribe(active => {
            syncStatus = active ? 'syncing' : 'online';
            console.log('Replication', active ? 'active' : 'inactive');
        });

        // Log replication events
        replicationState.received$.subscribe(received => {
            console.log('Received from server:', received);
        });

        replicationState.sent$.subscribe(sent => {
            console.log('Sent to server:', sent);
        });

        syncStatus = 'online';
        console.log('Replication started successfully');
    } catch (error) {
        console.error('Failed to start replication:', error);
        syncStatus = 'error';
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
        syncStatus = 'offline';
        console.log('Replication stopped');
    }
};

export const triggerSync = async (): Promise<void> => {
    if (!replicationState) {
        throw new Error('Replication not initialized');
    }

    console.log('Triggering manual sync');
    const previousStatus = syncStatus;
    syncStatus = 'syncing';

    try {
        await replicationState.reSync();
        syncStatus = previousStatus === 'offline' ? 'online' : previousStatus;
        console.log('Manual sync completed');
    } catch (error) {
        console.error('Manual sync failed:', error);
        syncStatus = 'error';
        throw error;
    }
};

// Utility functions
export const getSyncStatus = (): SyncStatus => syncStatus;
export const isReplicationActive = (): boolean => Boolean(replicationState);
export const getCurrentUserId = (): string | null => currentUserId;