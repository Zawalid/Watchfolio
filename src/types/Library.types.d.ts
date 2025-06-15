type LibraryMediaStatus = 'watched' | 'watching' | 'willWatch' | 'onHold' | 'dropped' | 'none';

type LibraryFilterStatus = Exclude<LibraryMediaStatus, 'none'> | 'favorites' | 'all';

interface LibraryMedia {
  id: number; // TMDB ID
  media_type: 'movie' | 'tv';
  // Optional: Store minimal TMDB data for offline/list display if needed
  title?: string;
  posterPath?: string | null;
  releaseDate?: string;
  genres?: string[];
  rating?: number;

  status: LibraryMediaStatus; // Default to 'none' if just favorited/rated without explicit status
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
}

type LibraryCollection = Record<string, LibraryMedia>;

// Export options
interface ExportOptions {
  format: 'json' | 'csv';
  includeMetadata?: boolean;
}

