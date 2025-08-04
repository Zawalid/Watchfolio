import type { RxDocument, RxCollection, RxJsonSchema } from 'rxdb';


export type LibraryItemDocument = RxDocument<LibraryMedia>;
export type LibraryItemCollection = RxCollection<LibraryMedia>;


export interface WatchfolioDatabase {
    libraryItems: LibraryItemCollection;
    addCollections: (collections: Record<string, RxJsonSchema<unknown>>) => Promise<void>;
    destroy: () => Promise<void>;
}


export type DatabaseStatus = 'initializing' | 'creating' | 'ready' | 'error';
export type SyncStatus = 'offline' | 'connecting' | 'online' | 'syncing' | 'error';

export interface WatchfolioSyncStatus {
    dbStatus: DatabaseStatus;
    syncStatus: SyncStatus;
    activeReplications: number;
}


export interface LibraryStats {
    totalItems: number;
    movieCount: number;
    tvCount: number;
    favoriteCount: number;
    statusCounts: Record<string, number>;
}


