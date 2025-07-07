import { fetchFromTMDB } from './config';
import { getUpcomingMovies } from './movies';
import { discoverTvShows } from './discover';

/**
 * Get upcoming TV shows using the discover API
 * Filters for shows that haven't aired yet
 */
export const getUpcomingTvShows = async (page?: number): Promise<TMDBResponse<TvShow>> => {
  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 1 year from now
  
  return await discoverTvShows({
    'first_air_date.gte': today,
    'first_air_date.lte': futureDate,
    sort_by: 'first_air_date.asc',
    page: page || 1,
    'vote_count.gte': 10, // Filter for shows with some popularity
  });
};

/**
 * Get combined upcoming content (movies and TV shows)
 * Returns a mixed array of upcoming movies and TV shows
 */
export const getUpcomingContent = async (page?: number): Promise<TMDBResponse<Media>> => {
  const [moviesData, tvShowsData] = await Promise.all([
    getUpcomingMovies(page),
    getUpcomingTvShows(page),
  ]);

  // Combine and sort by release date
  const allContent: Media[] = [
    ...moviesData.results,
    ...tvShowsData.results,
  ].sort((a, b) => {
    const dateA = new Date((a as Movie).release_date || (a as TvShow).first_air_date || '');
    const dateB = new Date((b as Movie).release_date || (b as TvShow).first_air_date || '');
    return dateA.getTime() - dateB.getTime();
  });

  return {
    page: page || 1,
    results: allContent,
    total_pages: Math.max(moviesData.total_pages, tvShowsData.total_pages),
    total_results: moviesData.total_results + tvShowsData.total_results,
  };
};
