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

export const getFeaturedContent = async (): Promise<TMDBResponse> => {
  // Get trending content for the week, limit to first page for hero section
  // This provides a mix of movies and TV shows that are currently trending
  return await getTrendingAll('week', 1);
};

export const getHeroContent = async (): Promise<TMDBResponse> => {
  // Alternative endpoint for hero section with more curated content
  // Falls back to trending if needed
  try {
    const trending = await getTrendingAll('week', 1);
    // Filter for high-quality content with good ratings and backdrops
    if (trending.results) {
      trending.results = trending.results.filter(
        (item: Media) => item.backdrop_path && item.vote_average > 6.5 && item.overview && item.overview.length > 50
      );
    }
    return trending;
  } catch {
    // Fallback to standard trending
    return await getTrendingAll('week', 1);
  }
};
