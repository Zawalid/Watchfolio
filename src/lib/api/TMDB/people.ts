import { fetchFromTMDB } from './config';

export const getPopularPeople = async (page: number = 1): Promise<TMDBResponse<Person>> => {
  return await fetchFromTMDB('/person/popular', { page: String(page) });
};

export const getTrendingPeople = async (
  page: number = 1,
  timeWindow: 'day' | 'week' = 'week'
): Promise<TMDBResponse<Person>> => {
  return await fetchFromTMDB(`/trending/person/${timeWindow}`, { page: String(page) });
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
