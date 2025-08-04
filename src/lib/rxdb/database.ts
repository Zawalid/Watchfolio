import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import { libraryItemSchema } from './schemas';
import type { WatchfolioDatabase, DatabaseStatus } from './types';

// ===== PLUGIN SETUP =====

// Add dev mode plugin for better error messages
if (import.meta.env.DEV) {
    addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

// ===== DATABASE STATE =====

let dbPromise: Promise<WatchfolioDatabase> | null = null;
export let dbStatus: DatabaseStatus = 'initializing';

// ===== DATABASE INITIALIZATION =====

export const getWatchfolioDB = async (): Promise<WatchfolioDatabase> => {
    if (dbPromise) return dbPromise;

    dbStatus = 'creating';
    dbPromise = (async () => {
        try {
            // Create the database with performance optimizations
            const db = await createRxDatabase({
                name: 'watchfolio',
                storage: wrappedValidateAjvStorage({
                    storage: getRxStorageDexie()
                }),
                multiInstance: false, // Faster - no multi-instance overhead
                ignoreDuplicate: true,
                cleanupPolicy: {
                    minimumCollectionAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                    runEach: 1000 * 60 * 60 * 24, // 24 hours - less frequent cleanup
                },
                // Add performance options
                allowSlowCount: false,
            });

            // Add collections with optimized settings
            await db.addCollections({
                libraryItems: {
                    schema: libraryItemSchema,
                    // Add performance optimizations
                    migrationStrategies: {},
                    autoMigrate: false, // Disable auto-migration for speed
                }
            });

            return db as unknown as WatchfolioDatabase;
        } catch (error) {
            console.error('❌ Database creation error:', error);
            throw error;
        }
    })();

    return dbPromise;
};

// ===== DATABASE UTILITIES =====

export const waitForDB = async (timeout = 10000): Promise<void> => {
    const start = Date.now();
    while (dbStatus !== 'ready' && Date.now() - start < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (dbStatus !== 'ready') {
        throw new Error('Database initialization timeout');
    }
};

export const destroyDB = async (): Promise<void> => {
    try {
        if (dbPromise) {
            const db = await dbPromise;
            await db.destroy();
            dbPromise = null;
        }

        dbStatus = 'initializing';
        console.log('🗑️ Watchfolio database destroyed');
    } catch (error) {
        console.error('❌ Database destroy error:', error);
        throw error;
    }
};

export const getDBStatus = (): DatabaseStatus => dbStatus;
