import { createRxDatabase, addRxPlugin, RxCollection, RxJsonSchema } from 'rxdb/plugins/core';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { libraryMediaSchema } from './schemas';

interface WatchfolioDatabase {
    libraryMedia: RxCollection<LibraryMedia>;
    addCollections: (collections: Record<string, RxJsonSchema<unknown>>) => Promise<void>;
    destroy: () => Promise<void>;
}

type DatabaseStatus = 'initializing' | 'creating' | 'ready' | 'error';


// ===== PLUGIN SETUP =====

if (import.meta.env.DEV) addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);


// ===== DATABASE STATE =====

let dbInstance: WatchfolioDatabase | null = null;
let dbPromise: Promise<WatchfolioDatabase> | null = null;
export let dbStatus: DatabaseStatus = 'initializing';

// ===== DATABASE INITIALIZATION =====

export const getWatchfolioDB = async (): Promise<WatchfolioDatabase> => {
    // Return existing instance if available
    if (dbInstance) {
        return dbInstance;
    }

    // Return existing promise if initialization is in progress
    if (dbPromise) {
        return dbPromise;
    }

    dbStatus = 'creating';
    console.log('🔄 Creating Watchfolio database...');

    dbPromise = (async () => {
        try {
            const db = await createRxDatabase({
                name: 'watchfolio',
                storage: wrappedValidateAjvStorage({
                    storage: getRxStorageDexie()
                }),
                multiInstance: false,
                ignoreDuplicate: true,
                cleanupPolicy: {
                    minimumCollectionAge: 1000 * 60 * 60 * 24 * 7,
                    runEach: 1000 * 60 * 60 * 24,
                },
                allowSlowCount: false,
            });

            await db.addCollections({
                libraryMedia: {
                    schema: libraryMediaSchema,
                    migrationStrategies: {},
                    autoMigrate: false,
                }
            });

            dbInstance = db as unknown as WatchfolioDatabase;
            dbStatus = 'ready';
            console.log('✅ Watchfolio database created successfully');

            return dbInstance;
        } catch (error) {
            console.error('❌ Database creation error:', error);
            dbPromise = null; // Reset promise on error
            dbStatus = 'error';
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
        if (dbInstance) {
            await dbInstance.destroy();
            dbInstance = null;
        }
        dbPromise = null;
        dbStatus = 'initializing';
        console.log('🗑️ Watchfolio database destroyed');
    } catch (error) {
        console.error('❌ Database destroy error:', error);
        throw error;
    }
};

export const getDBStatus = (): DatabaseStatus => dbStatus;