import { fetchFromTMDB } from './config';


export const getPopularMovies = async (page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/movie/popular`, { page: String(page || 1) });
};

export const getTopRatedMovies = async (page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/movie/top_rated`, { page: String(page || 1) });
};

export const getNowPlayingMovies = async (page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/movie/now_playing`, { page: String(page || 1) });
};

export const getUpcomingMovies = async (page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/movie/upcoming`, { page: String(page || 1) });
};