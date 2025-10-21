import { createRxDatabase, addRxPlugin, RxCollection } from 'rxdb/plugins/core';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { LibraryItemschema } from './schemas';
import { GENRES } from '@/utils/constants/TMDB';

// Add plugins
if (import.meta.env.DEV) addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

interface WatchfolioDatabase {
  libraryMedia: RxCollection<LibraryMedia>;
  remove: () => Promise<void>;
}

let dbInstance: WatchfolioDatabase | null = null;
let dbPromise: Promise<WatchfolioDatabase> | null = null;

type DBStatus = 'not-initialized' | 'initializing' | 'ready';

export const getDBStatus = (): DBStatus => {
  if (dbInstance) return 'ready';
  if (dbPromise) return 'initializing';
  return 'not-initialized';
};

export const getWatchfolioDB = async (): Promise<WatchfolioDatabase> => {
  if (dbInstance) return dbInstance;
  if (dbPromise) return dbPromise;

  log('Creating Watchfolio database...');

  // Use validation only in dev mode to avoid CSP issues in production
  const storage = import.meta.env.DEV
    ? wrappedValidateAjvStorage({ storage: getRxStorageDexie() })
    : getRxStorageDexie();

  dbPromise = createRxDatabase({
    name: 'watchfolio',
    storage,
    multiInstance: false,
  }).then(async (db) => {
    await db
      .addCollections({
        libraryMedia: {
          schema: LibraryItemschema,
          migrationStrategies: {
            1: (oldDoc) => {
              return oldDoc;
            },
            2: (oldDoc) => {
              const newDoc = { ...oldDoc };
              newDoc.library = oldDoc.library?.$id || null;
              return newDoc;
            },
            3: (oldDoc) => {
              const newDoc = { ...oldDoc };
              newDoc.genres =
                oldDoc.genres?.map((genre: string) => GENRES.find((g) => g.label === genre)?.id || null) || [];
              return newDoc;
            },
            4: (oldDoc) => {
              return oldDoc;
            },
          },
          autoMigrate: true,
        },
      })
      .catch((err) => {
        log('ERR', '🔴 DATABASE CREATION FAILED:', err);
        dbPromise = null;
        throw err;
      });

    dbInstance = db as unknown as WatchfolioDatabase;
    return dbInstance;
  });

  log('Watchfolio database created successfully');
  return dbPromise;
};

export const destroyDB = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.remove();
    dbInstance = null;
  }
  dbPromise = null;
  log('Watchfolio database destroyed');
};

export const recreateDB = async (): Promise<void> => {
  await destroyDB();
  await getWatchfolioDB();
};
