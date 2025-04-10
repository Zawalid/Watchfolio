import { getQueryString } from '@/utils';

export const tmdbOptions = {
  url: 'https://api.themoviedb.org/3',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
  },
};

export const fetchFromTMDB = async <T>(endpoint: string, queryParams: Record<string, string> = {}): Promise<T> => {
  const queryString = getQueryString(queryParams);
  const res = await fetch(`${tmdbOptions.url}${endpoint}${queryString}`, {
    headers: tmdbOptions.headers,
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
};
