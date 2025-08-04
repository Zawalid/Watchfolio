import { replicateAppwrite } from 'rxdb/plugins/replication-appwrite';
import type { RxAppwriteReplicationState } from 'rxdb/plugins/replication-appwrite';

import client, { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { getWatchfolioDB } from './database';
import type { SyncStatus } from './types';

// ===== REPLICATION STATE =====

export let syncStatus: SyncStatus = 'offline';
const replicationStates = new Map<string, RxAppwriteReplicationState<unknown>>();

// Track active states reactively
const currentActiveStates = new Map<string, boolean>();

// ===== REPLICATION SETUP =====

export const startReplication = async (userId: string): Promise<void> => {
    try {
        if (replicationStates.size > 0) {
            console.log('🔄 Replication already started');
            return;
        }

        if (!userId) {
            throw new Error('User ID is required to start replication');
        }

        const db = await getWatchfolioDB();
        syncStatus = 'connecting';

        console.log('🔄 Starting Watchfolio replication...');

        // Setup replication for library items
        const libraryItemsReplication = replicateAppwrite({
            replicationIdentifier: `watchfolio-library-items-${userId}`,
            client,
            databaseId: DATABASE_ID,
            collectionId: COLLECTIONS.LIBRARY_ITEMS,
            deletedField: 'deleted',
            collection: db.libraryItems,
            pull: { batchSize: 25 },
            push: { batchSize: 25 }
        });



        // Handle replication events for library items
        libraryItemsReplication.error$.subscribe((error) => {
            console.error('🚨 Library items replication error:', error);
            syncStatus = 'error';
        });

        libraryItemsReplication.active$.subscribe((active) => {
            console.log(`🔄 Library items replication ${active ? 'active' : 'inactive'}`);
            updateSyncStatus();
        });



        // Subscribe to active state
        subscribeToActiveState('libraryItems', libraryItemsReplication);


        // Store replication states
        replicationStates.set('libraryItems', libraryItemsReplication);


        syncStatus = 'online';
        console.log('✅ Watchfolio replication started for all collections');
    } catch (error) {
        console.error('❌ Replication setup error:', error);
        syncStatus = 'error';
        throw error;
    }
};

export const stopReplication = async (): Promise<void> => {
    try {
        console.log('🛑 Stopping Watchfolio replication...');

        for (const [name, replication] of replicationStates) {
            await replication.cancel();
            console.log(`🛑 Stopped ${name} replication`);
        }

        replicationStates.clear();
        syncStatus = 'offline';
        console.log('✅ All Watchfolio replications stopped');
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
        console.log('✅ Manual sync completed for all collections');
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

const subscribeToActiveState = (id: string, replication: RxAppwriteReplicationState<unknown>) => {
    replication.active$.subscribe((isActive: boolean) => {
        currentActiveStates.set(id, isActive);
        updateSyncStatus();
    });
};

export const getSyncStatus = (): SyncStatus => syncStatus;

export const getActiveReplications = (): number => replicationStates.size;

export const isReplicationActive = (): boolean => {
    return Array.from(currentActiveStates.values())
        .some(isActive => isActive);
};
