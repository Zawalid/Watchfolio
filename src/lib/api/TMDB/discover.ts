import { fetchFromTMDB } from './config';

export interface DiscoverParams {
  // Pagination
  page?: number;

  // Sorting
  sort_by?:
    | 'popularity.desc'
    | 'popularity.asc'
    | 'vote_average.desc'
    | 'vote_average.asc'
    | 'release_date.desc'
    | 'release_date.asc'
    | 'first_air_date.desc'
    | 'first_air_date.asc'
    | 'title.asc'
    | 'title.desc'
    | 'original_title.asc'
    | 'original_title.desc'
    | 'name.asc'
    | 'name.desc'
    | 'original_name.asc'
    | 'original_name.desc';

  // Filtering
  with_genres?: string; // comma-separated genre IDs
  without_genres?: string; // comma-separated genre IDs
  with_companies?: string; // comma-separated company IDs
  with_networks?: string; // comma-separated network IDs (TV only)
  with_original_language?: string; // ISO 639-1 language code
  with_watch_providers?: string; // comma-separated provider IDs
  watch_region?: string;

  // Date filtering
  'primary_release_date.gte'?: string; // YYYY-MM-DD (movies)
  'primary_release_date.lte'?: string; // YYYY-MM-DD (movies)
  'first_air_date.gte'?: string; // YYYY-MM-DD (TV)
  'first_air_date.lte'?: string; // YYYY-MM-DD (TV)
  'release_date.gte'?: string; // YYYY-MM-DD (movies)
  'release_date.lte'?: string; // YYYY-MM-DD (movies)

  // Rating filtering
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  'vote_count.gte'?: number;

  // Runtime filtering (movies only)
  'with_runtime.gte'?: number;
  'with_runtime.lte'?: number;

  // Status filtering (TV only)
  with_status?: 'returning' | 'planned' | 'in_production' | 'ended' | 'cancelled' | 'pilot';

  // Type filtering (TV only)
  with_type?: 'documentary' | 'news' | 'miniseries' | 'reality' | 'scripted' | 'talk_show' | 'video';

  // Keyword filtering
  with_keywords?: string; // comma-separated keyword IDs
  without_keywords?: string; // comma-separated keyword IDs
}

export const discoverMovies = async (params: DiscoverParams = {}): Promise<TMDBResponse<Movie>> => {
  const queryParams: Record<string, string> = {};

  // Convert all parameters to strings for the API call
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams[key] = String(value);
    }
  });

  return await fetchFromTMDB(`/discover/movie`, queryParams);
};

export const discoverTvShows = async (params: DiscoverParams = {}): Promise<TMDBResponse<TvShow>> => {
  const queryParams: Record<string, string> = {};

  // Convert all parameters to strings for the API call
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams[key] = String(value);
    }
  });

  return await fetchFromTMDB(`/discover/tv`, queryParams);
};

export const getTvShowsByNetwork = async (
  networkId: number,
  params: DiscoverParams = {}
): Promise<TMDBResponse<TvShow>> => {
  return await discoverTvShows({ with_networks: String(networkId), ...params });
};
