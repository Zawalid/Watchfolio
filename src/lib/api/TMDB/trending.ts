import { fetchFromTMDB } from './config';

export const getTrendingAll = async (timeWindow: 'day' | 'week' = 'week', page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/trending/all/${timeWindow}`, { page: String(page || 1) });
};

export const getTrendingMovies = async (
  timeWindow: 'day' | 'week' = 'week',
  page?: number
): Promise<TMDBResponse<Movie>> => {
  return await fetchFromTMDB(`/trending/movie/${timeWindow}`, { page: String(page || 1) });
};

export const getTrendingTvShows = async (
  timeWindow: 'day' | 'week' = 'week',
  page?: number
): Promise<TMDBResponse<TvShow>> => {
  return await fetchFromTMDB(`/trending/tv/${timeWindow}`, { page: String(page || 1) });
};

