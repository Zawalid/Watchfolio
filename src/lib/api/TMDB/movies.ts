import { fetchFromTMDB } from './config';

export const getPopularMovies = async (page?: number): Promise<TMDBResponse<Movie>> => {
  return await fetchFromTMDB(`/movie/popular`, { page: String(page || 1) });
};

export const getTopRatedMovies = async (page?: number): Promise<TMDBResponse<Movie>> => {
  return await fetchFromTMDB(`/movie/top_rated`, { page: String(page || 1) });
};

export const getNowPlayingMovies = async (page?: number): Promise<TMDBResponse<Movie>> => {
  return await fetchFromTMDB(`/movie/now_playing`, { page: String(page || 1) });
};

export const getUpcomingMovies = async (page?: number): Promise<TMDBResponse<Movie>> => {
  return await fetchFromTMDB(`/movie/upcoming`, { page: String(page || 1) });
};

export const getMovies = async (category: Categories, page?: number): Promise<TMDBResponse<Movie>> => {
  switch (category) {
    case 'popular':
      return await getPopularMovies(page);
    case 'top-rated':
      return await getTopRatedMovies(page);
    case 'now-playing':
      return await getNowPlayingMovies(page);
    case 'upcoming':
      return await getUpcomingMovies(page);
    default:
      throw new Error('Invalid category');
  }
};
