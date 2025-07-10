import { fetchFromTMDB } from './config';

export const search = async (query: string, page?: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/search/multi`, { query, page: String(page || 1) });
};

export const searchMovie = async (query: string, page?: number): Promise<TMDBResponse<Movie>> => {
  return await fetchFromTMDB(`/search/movie`, { query, page: String(page || 1) });
};

export const searchTvShows = async (query: string, page?: number): Promise<TMDBResponse<TvShow>> => {
  return await fetchFromTMDB(`/search/tv`, { query, page: String(page || 1) });
};

export const getDetails = async (type: 'movie' | 'tv', slug: string): Promise<Media | null> => {
  if (!type || !slug) throw new Error('Type and Slug are required');
  const id = slug.split('-')[0];

  if (!id) return null;

  const details = await fetchFromTMDB<Media>(
    type === 'tv'
      ? `/tv/${id}?append_to_response=credits,seasons,videos`
      : `/movie/${id}?append_to_response=credits,videos`
  );

  return details;
};

export const getRecommendations = async (type: 'movie' | 'tv', id: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/${type}/${id}/recommendations`);
};

export const getSimilar = async (type: 'movie' | 'tv', id: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/${type}/${id}/similar`);
};

export const getSuggestions = async (query: string, limit: number) => {
  const response = await search(query, 1);
  const suggestions = response.results
    .map((item: { title?: string; name?: string }) => item.title || item.name)
    .filter((title: string | undefined): title is string => {
      return title !== undefined && title.toLowerCase().includes(query.toLowerCase());
    });

  return [...new Set(suggestions)].slice(0, limit);
};

export const getImages = async (id: number, type: 'movie' | 'tv'): Promise<Images> => {
  return await fetchFromTMDB(`/${type}/${id}/images`);
};
