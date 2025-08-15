import client, { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { replicateAppwrite, RxAppwriteReplicationState } from '@/lib/appwrite/replication';
import { getWatchfolioDB } from './database';
import type { RxDBLibraryMedia, SyncStatus } from './types';
import { localToServer, serverToLocal } from './mappers';

// ===== REPLICATION STATE =====

export let syncStatus: SyncStatus = 'offline';
const replicationStates = new Map<string, RxAppwriteReplicationState<RxDBLibraryMedia>>();
const currentActiveStates = new Map<string, boolean>();

// Prevent concurrent initialization
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;
let currentUserId: string | null = null;

// ===== REPLICATION SETUP =====

export const startReplication = async (userId: string): Promise<void> => {
    // Quick return if same user and already active
    if (currentUserId === userId && replicationStates.size > 0 && !isInitializing) {
        console.log('✅ Replication already active for user:', userId);
        return;
    }

    // If different user, stop existing replication first
    if (currentUserId && currentUserId !== userId && replicationStates.size > 0) {
        console.log('🔄 Switching user, stopping existing replication');
        await stopReplication();
    }

    // If already initializing for this user, wait for it
    if (isInitializing && initializationPromise && currentUserId === userId) {
        console.log('⏳ Replication initialization in progress, waiting...');
        return initializationPromise;
    }

    if (!userId) {
        throw new Error('User ID is required to start replication');
    }

    // Set initialization state
    isInitializing = true;
    currentUserId = userId;
    
    initializationPromise = (async () => {
        try {
            console.log('🔄 Starting Watchfolio replication for user:', userId);
            
            const db = await getWatchfolioDB();
            syncStatus = 'connecting';

            const libraryItemsReplication = replicateAppwrite({
                replicationIdentifier: `watchfolio-library-items-${userId}`,
                client,
                databaseId: DATABASE_ID,
                collectionId: COLLECTIONS.LIBRARY_ITEMS,
                userId,
                deletedField: 'deleted',
                collection: db.libraryItems,
                waitForLeadership: true,
                retryTime: 5000,
                autoStart: true,
                pull: {
                    batchSize: 25,
                    modifier: (doc) => {
                        console.log('📥 Processing pull for:', doc.$id);
                        return serverToLocal(doc);
                    }
                },
                push: {
                    batchSize: 1,
                    modifier: async (doc) => {
                        console.log('📤 Processing push for:', doc.id);
                        return await localToServer(doc as RxDBLibraryMedia);
                    }
                },
            });

            // Handle replication events
            libraryItemsReplication.error$.subscribe((error) => {
                console.error('🚨 Library items replication error:', error);
                syncStatus = 'error';
            });

            libraryItemsReplication.active$.subscribe((active) => {
                console.log(`🔄 Library items replication ${active ? 'active' : 'inactive'}`);
                currentActiveStates.set('libraryItems', active);
                updateSyncStatus();
            });

            // Store replication state
            replicationStates.set('libraryItems', libraryItemsReplication as RxAppwriteReplicationState<RxDBLibraryMedia>);

            syncStatus = 'online';
            console.log('✅ Watchfolio replication started successfully');
        } catch (error) {
            console.error('❌ Replication setup error:', error);
            syncStatus = 'error';
            currentUserId = null;
            throw error;
        } finally {
            isInitializing = false;
            initializationPromise = null;
        }
    })();

    return initializationPromise;
};

export const stopReplication = async (): Promise<void> => {
    try {
        // Wait for any ongoing initialization
        if (isInitializing && initializationPromise) {
            console.log('⏳ Waiting for initialization to complete before stopping...');
            await initializationPromise;
        }

        if (replicationStates.size === 0) {
            console.log('✅ Replication already stopped');
            return;
        }

        console.log('🛑 Stopping Watchfolio replication...');

        for (const [name, replication] of replicationStates) {
            try {
                await replication.cancel();
                console.log(`🛑 Stopped ${name} replication`);
            } catch (error) {
                console.error(`❌ Error stopping ${name} replication:`, error);
            }
        }

        replicationStates.clear();
        currentActiveStates.clear();
        currentUserId = null;
        syncStatus = 'offline';
        
        console.log('✅ All replications stopped');
    } catch (error) {
        console.error('❌ Stop replication error:', error);
        throw error;
    }
};

export const triggerSync = async (): Promise<void> => {
    if (replicationStates.size === 0) {
        throw new Error('Replication not initialized');
    }

    try {
        console.log('🔄 Triggering manual sync...');
        syncStatus = 'syncing';

        const promises = Array.from(replicationStates.values()).map(replication =>
            replication.reSync()
        );

        await Promise.all(promises);
        syncStatus = 'online';
        console.log('✅ Manual sync completed');
    } catch (error) {
        console.error('❌ Manual sync error:', error);
        syncStatus = 'error';
        throw error;
    }
};

// ===== UTILITY FUNCTIONS =====

const updateSyncStatus = (): void => {
    const hasActiveReplication = Array.from(currentActiveStates.values())
        .some(isActive => isActive);

    if (syncStatus !== 'error') {
        syncStatus = hasActiveReplication ? 'syncing' : 'online';
    }
};

export const getSyncStatus = (): SyncStatus => syncStatus;
export const getActiveReplications = (): number => replicationStates.size;
export const isReplicationActive = (): boolean => {
    return Array.from(currentActiveStates.values()).some(isActive => isActive);
};
export const isReplicationInitializing = (): boolean => isInitializing;
export const getCurrentUserId = (): string | null => currentUserId;