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

export const searchPerson = async (query: string, page?: number): Promise<TMDBResponse<Person>> => {
  return await fetchFromTMDB(`/search/person`, { query, page: String(page || 1) });
};

export const getDetails = async (type: MediaType, id: number, append: boolean = true): Promise<Media | null> => {
  if (!type || !id) throw new Error('Type and Id are required');

  const details = await fetchFromTMDB<Media>(
    type === 'tv'
      ? `/tv/${id}${append ? '?append_to_response=credits,seasons,videos,images' : ''}`
      : `/movie/${id}${append ? '?append_to_response=credits,videos,images' : ''}`
  );

  return details;
};

export const getRecommendations = async (type: MediaType, id: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/${type}/${id}/recommendations`);
};

export const getSimilar = async (type: MediaType, id: number): Promise<TMDBResponse> => {
  return await fetchFromTMDB(`/${type}/${id}/similar`);
};

// Get suggestions from multi-search (movies, TV shows, people)
export const getSuggestions = async (query: string, limit: number) => {
  try {
    const response = await search(query, 1);
    const suggestions = response.results
      .map((item: Media | Person) => {
        const name = 'title' in item ? item.title : item.name;
        if (!name) return null;

        // Extract year from release date or first air date
        let year: string | null = null;
        let mediaType: ContentType;

        if ('title' in item) {
          mediaType = 'movie';
          if (item.release_date) year = new Date(item.release_date).getFullYear().toString();
        } else if ('name' in item && 'first_air_date' in item) {
          mediaType = 'tv';
          if (item.first_air_date) year = new Date(item.first_air_date).getFullYear().toString();
        } else mediaType = 'person';

        // Calculate relevance score based on popularity and name match
        const nameLower = name.toLowerCase();
        const queryLower = query.toLowerCase();
        let relevanceScore = 0;

        if (nameLower === queryLower) relevanceScore += 1000;
        else if (nameLower.startsWith(queryLower)) relevanceScore += 500;
        else if (nameLower.includes(queryLower)) relevanceScore += 200;

        relevanceScore += item.popularity || 0;

        if (mediaType !== 'person' && 'vote_average' in item) relevanceScore += (item.vote_average || 0) * 10;

        return {
          id: item.id,
          name,
          year,
          mediaType,
          poster_path: 'poster_path' in item ? item.poster_path : null,
          profile_path: 'profile_path' in item ? item.profile_path : null,
          popularity: item.popularity || 0,
          rating: 'vote_average' in item ? item.vote_average : null,
          relevanceScore,
        };
      })
      .filter((item): item is Suggestion => {
        return item !== null && item.name.toLowerCase().includes(query.toLowerCase());
      });

    // Sort by relevance score (highest first)
    const sortedSuggestions = suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Remove duplicates based on name and year combination, keeping the highest scoring one
    const uniqueSuggestions = sortedSuggestions.filter(
      (item, index, self) => index === self.findIndex((s) => s.name === item.name && s.year === item.year)
    );

    return uniqueSuggestions.slice(0, limit);
  } catch (error) {
    log("ERR", 'Error fetching enhanced suggestions:', error);
    return [];
  }
};

export const getImages = async (id: number, type: MediaType): Promise<Images> => {
  return await fetchFromTMDB(`/${type}/${id}/images`);
};
