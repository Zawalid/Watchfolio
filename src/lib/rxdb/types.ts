import type { RxDocument, RxCollection } from 'rxdb';

// ===== CORE INTERFACES =====

export interface WatchfolioLibraryItem {
    id: string;
    // Core user data
    status: 'watching' | 'willWatch' | 'onHold' | 'dropped' | 'none' | 'completed';
    isFavorite: boolean;
    userRating?: number;
    notes?: string;
    addedAt: string;

    // References (denormalized for RxDB)
    libraryId: string;    // User's library ID
    tmdbId: number;       // TMDB media ID

    // Embedded media data for offline browsing
    title: string;
    mediaType: 'movie' | 'tv';
    posterPath?: string;
    releaseDate?: string;
    genres?: string[];
    rating?: number;
    totalMinutesRuntime?: number;
    networks?: number[];
}

export interface WatchfolioUserPreferences {
    id: string;
    userId: string;
    signOutConfirmation: 'enabled' | 'disabled';
    theme: 'light' | 'dark' | 'system';
    language: string;
    clearLibraryConfirmation: 'enabled' | 'disabled';
    removeFromLibraryConfirmation: 'enabled' | 'disabled';
    enableAnimations: 'enabled' | 'disabled';
    defaultMediaStatus: 'watching' | 'willWatch' | 'onHold' | 'dropped' | 'none' | 'completed';
    autoSync: boolean;
}

// ===== RXDB DOCUMENT TYPES =====

export type LibraryItemDocument = RxDocument<WatchfolioLibraryItem>;
export type UserPreferencesDocument = RxDocument<WatchfolioUserPreferences>;

export type LibraryItemCollection = RxCollection<WatchfolioLibraryItem>;
export type UserPreferencesCollection = RxCollection<WatchfolioUserPreferences>;

// ===== DATABASE TYPES =====

export interface WatchfolioDatabase {
    libraryItems: LibraryItemCollection;
    userPreferences: UserPreferencesCollection;
    addCollections: (collections: any) => Promise<void>;
    destroy: () => Promise<void>;
}


export type DatabaseStatus = 'initializing' | 'creating' | 'ready' | 'error';
export type SyncStatus = 'offline' | 'connecting' | 'online' | 'syncing' | 'error';

export interface WatchfolioSyncStatus {
    dbStatus: DatabaseStatus;
    syncStatus: SyncStatus;
    activeReplications: number;
}

// ===== SERVICE TYPES =====

export interface LibraryStats {
    totalItems: number;
    movieCount: number;
    tvCount: number;
    favoriteCount: number;
    statusCounts: Record<string, number>;
}

// ===== MEDIA INTEGRATION TYPES =====

export interface TMDBMediaInput {
    id: number;
    media_type: 'movie' | 'tv';
    title?: string;
    poster_path?: string;
    release_date?: string;
    first_air_date?: string;
    genres?: Array<{ name: string }>;
    genre_ids?: number[];
    vote_average?: number;
    runtime?: number;
    episode_run_time?: number[];
    networks?: Array<{ id: number }>;
}

export interface LibraryItemUpdate {
    status?: WatchfolioLibraryItem['status'];
    isFavorite?: boolean;
    userRating?: number;
    notes?: string;
}
