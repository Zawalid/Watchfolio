import type { RxDocument, RxCollection, RxJsonSchema } from 'rxdb';

export interface RxDBLibraryMedia {
    id: string;
    status: WatchStatus;
    isFavorite: boolean;
    userRating?: number;
    notes?: string;

    addedAt?: string;
    lastUpdatedAt: string;

    library: {
        $id: string,
        averageRating?: number;
        $updatedAt?: string;
    };
    media: {
        $id: string;
        id: number;
        mediaType: MediaType;
        title: string;
        overview?: string;
        posterPath?: string;
        releaseDate?: string;
        genres?: string[];
        rating?: number;
        totalMinutesRuntime?: number;
        networks?: number[];
        $updatedAt?: string;
    };
}

export type LibraryItemDocument = RxDocument<RxDBLibraryMedia>;
export type LibraryItemCollection = RxCollection<RxDBLibraryMedia>;


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


