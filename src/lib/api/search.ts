import { fetchFromTMDB } from './config';

export const search = async (query: string, page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/search/multi`, { query, page: String(page || 1) });
};

export const searchMovie = async (query: string, page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/search/movie`, { query, page: String(page || 1) });
};

export const searchTvShows = async (query: string, page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/search/tv`, { query, page: String(page || 1) });
};

export const getDetails = async (type: 'movie' | 'tv', slug: string): Promise<TvShowDetails | MovieDetails | null> => {
  if (!type || !slug) throw new Error('Type and Slug are required');
  const id = slug.split('-')[0];

  if (!id) return null;

  const details = await fetchFromTMDB<TvShowDetails | MovieDetails>(
    type === 'tv'
      ? `/tv/${id}?append_to_response=credits,seasons,videos`
      : `/movie/${id}?append_to_response=credits,videos`
  );

  return details;
};
