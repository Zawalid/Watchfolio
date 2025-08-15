type MediaType = 'movie' | 'tv';
type WatchStatus = 'watching' | 'willWatch' | 'completed' | 'onHold' | 'dropped' | 'none';
type LibraryFilterStatus = Exclude<WatchStatus, 'none'> | 'favorites' | 'all';

interface LibraryMedia {
  id: string;
  // Core user data
  status: WatchStatus
  isFavorite: boolean;
  userRating?: number;

  addedAt: string;
  lastUpdatedAt: string;


  // For RxDB
  libraryId?: string;    // User's library ID
  tmdbId: number;       // TMDB media ID
  deleted?: boolean

  // Embedded media data for offline browsing
  title?: string;
  media_type: MediaType;
  posterPath?: string | null;
  releaseDate?: string | null;
  genres?: string[];
  rating?: number;
  totalMinutesRuntime?: number;
  networks?: number[];

  // Future fields
  // watchDates?: string[]; // Array of ISO date strings
  // lastWatchedEpisode?: {
  //   seasonNumber: number;
  //   episodeNumber: number;
  //   watchedAt?: string;
  // };
  notes?: string;
}



type LibraryCollection = Record<string, LibraryMedia>

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

// Sync Types

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingOperations: number;
  error: string | null;
}



