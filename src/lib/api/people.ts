import { fetchFromTMDB } from './config';

// TMDB Person endpoints
export const searchPerson = async (query: string): Promise<TMDBResponse> => {
    return await fetchFromTMDB(`/search/person`, { query });
};

export const getPersonDetails = async (id: number | string): Promise<TMDBResponse> => {
    return await fetchFromTMDB(`/person/${id}`);
};

export const getPersonTvCredits = async (id: number | string): Promise<TMDBResponse> => {
    return await fetchFromTMDB(`/person/${id}/tv_credits`);
};
