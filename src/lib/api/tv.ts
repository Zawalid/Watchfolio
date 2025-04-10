import { fetchFromTMDB } from './config';

// TMDB TV Show endpoints
export const getPopularTvShows = async (page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/tv/popular`, { page: String(page || 1) });
};

export const getTopRatedTvShows = async (page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/tv/top_rated`, { page: String(page || 1) });
};

export const getAiringTodayTvShows = async (page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/tv/airing_today`, { page: String(page || 1) });
};

export const getOnTheAirTvShows = async (page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/tv/on_the_air`, { page: String(page || 1) });
};

export const getTvShows = async (category: Categories, page?: number): Promise<TMDBResponse> => {
  switch (category) {
    case 'popular':
      return await getPopularTvShows(page);
    case 'top-rated':
      return await getTopRatedTvShows(page);
    case 'airing-today':
      return await getAiringTodayTvShows(page);
    case 'no-the-air':
      return await getOnTheAirTvShows(page);
    default:
      throw new Error('Invalid category');
  }
};

export const getSimilarTvShows = async (id: number | string, page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/tv/${id}/similar`, { page: String(page || 1) });
};

export const getTvShowRecommendations = async (id: number | string, page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/tv/${id}/recommendations`, { page: String(page || 1) });
};

export const getTvShowCredits = async (id: string | number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/tv/${id}/credits`);
};

export const getTvShowSeasonDetails = async (showId: number | string, seasonNumber: number): Promise<Season> => {
  return await fetchFromTMDB(`/tv/${showId}/season/${seasonNumber}?append_to_response=images,videos`);
};

export const getTvShowEpisodeDetails = async (
  showId: number | string,
  seasonNumber: number,
  episodeNumber: number
): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`);
};
