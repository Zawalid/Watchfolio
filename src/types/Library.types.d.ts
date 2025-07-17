type LibraryFilterStatus = Exclude<WatchStatus, 'none'> | 'favorites' | 'all';

interface LibraryMedia {
  id: number; // TMDB ID
  media_type: MediaType;
  // Optional: Store minimal TMDB data for offline/list display if needed
  title?: string;
  posterPath?: string | null;
  releaseDate?: string;
  genres?: string[];
  rating?: number;

  status: WatchStatus; // Default to 'none' if just favorited/rated without explicit status
  isFavorite: boolean;
  userRating?: number; // User's personal rating (1-10)
  watchDates?: string[]; // Array of ISO date strings
  lastWatchedEpisode?: {
    seasonNumber: number;
    episodeNumber: number;
    watchedAt?: string;
  };
  addedToLibraryAt: string; // ISO date string when first interacted with (status set, favorited, rated)
  lastUpdatedAt: string; // ISO date string of last update
  notes?: string;
  totalMinutesRuntime?: number;
}

type LibraryCollection = Record<string, LibraryMedia>;

// Export options
interface ExportOptions {
  format: 'json' | 'csv';
  includeMetadata?: boolean;
}

// Sync Types

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingOperations: number;
  error: string | null;
}

interface SyncComparison {
  isInSync: boolean;
  cloudItemCount: number;
  localItemCount: number;
  needsUpload: number;
  needsDownload: number;
  conflicts: number;
}

type SyncOperation = {
  type: 'create' | 'update' | 'delete';
  key: string; // media key like "movie-123"
  data?: LibraryMedia;
  timestamp: string;
};

interface LibraryStats {
  all: number;
  watching: number;
  completed: number;
  willWatch: number;
  onHold: number;
  dropped: number;
  favorites: number;
  movies: number;
  tvShows: number;
  totalHoursWatched: number;
  averageRating: number;
  topGenres: Array<{ name: string; count: number }>;
}
