type MediaType = 'movie' | 'tv';
type WatchStatus = 'watching' | 'willWatch' | 'completed' | 'onHold' | 'dropped' | 'none';
type LibraryFilterStatus = Exclude<WatchStatus, 'none'> | 'favorites' | 'all';

interface LibraryMedia {
  id: string;
  status: WatchStatus;
  isFavorite: boolean;
  userRating: number | null;
  notes: string | null;
  addedAt: string;
  lastUpdatedAt: string;

  // TMDB media fields
  tmdbId: number;
  media_type: MediaType;
  title: string;
  overview: string | null;
  posterPath: string | null;
  releaseDate: string | null;
  genres: number[];
  rating: number | null;
  totalMinutesRuntime: number | null;
  networks: number[];

  library: string | null;
  userId: string;

  // Future fields
  // watchDates?: string[]; // Array of ISO date strings
  // lastWatchedEpisode?: {
  //   seasonNumber: number;
  //   episodeNumber: number;
  //   watchedAt?: string;
  // };
}

type LibraryCollection = Record<string, LibraryMedia>;

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
  topGenres: Array<{ id: number; count: number }>;
}

type LibraryFilters = {
  status: LibraryFilterStatus;
  query?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  mediaType?: MediaType;
  genres?: number[];
  networks?: number[];
};
