import { fetchFromTMDB } from './config';

export const searchPerson = async (query: string): Promise<TMDBResponse<Person>> => {
  return await fetchFromTMDB(`/search/person`, { query });
};

export const getPersonDetails = async (id: number | string): Promise<Person> => {
  return await fetchFromTMDB(`/person/${id}`);
};

export const getPersonMovieCredits = async (id: number | string): Promise<PersonCredits> => {
  return await fetchFromTMDB(`/person/${id}/movie_credits`);
};

export const getPersonTvCredits = async (id: number | string): Promise<PersonCredits> => {
  return await fetchFromTMDB(`/person/${id}/tv_credits`);
};

export const getPersonCombinedCredits = async (id: number | string): Promise<PersonCredits> => {
  return await fetchFromTMDB(`/person/${id}/combined_credits`);
};
