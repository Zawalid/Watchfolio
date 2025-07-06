import { type LoaderFunctionArgs } from 'react-router';
import {
  getDetails,
  getTvShows,
  getMovies,
  discoverMovies,
  discoverTvShows,
  type DiscoverParams,
} from '@/lib/api/TMDB';
import { prefetchQuery, queryKeys } from '@/lib/react-query';

const createDetailsLoader =
  (type: 'movie' | 'tv') =>
  async ({ params }: LoaderFunctionArgs) => {
    const slug = params.slug as string;
    const queryKey = queryKeys.details(type, slug);

    const data = await prefetchQuery(() => getDetails(type, slug), queryKey);
    return data.data;
  };
// Updated movies loader for both category and discover API
export const moviesLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') || 1);
  const category = url.searchParams.get('category');

  // If category is selected, use category endpoints
  if (category && ['popular', 'top-rated', 'now-playing', 'upcoming'].includes(category)) {
    const queryKey = queryKeys.category('movie', category as Categories, page);
    const data = await prefetchQuery(() => getMovies(category as Categories, page), queryKey);
    return data.data;
  }

  // Otherwise use discover API
  const sortBy = url.searchParams.get('sort_by') || 'popularity';
  const sortDir = url.searchParams.get('sort_dir') || 'desc';

  const queryKey = queryKeys.discover('movie', 'discover', {
    page,
    sort_by: `${sortBy}.${sortDir}` as DiscoverParams['sort_by'],
    'vote_count.gte': 50,
  });

  const data = await prefetchQuery(
    () =>
      discoverMovies({
        page,
        sort_by: `${sortBy}.${sortDir}` as DiscoverParams['sort_by'],
        'vote_count.gte': 50,
      }),
    queryKey
  );
  return data.data;
};
export const MovieLoader = createDetailsLoader('movie');
export const tvShowsLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') || 1);
  const category = url.searchParams.get('category');

  // If category is selected, use category endpoints
  if (category && ['popular', 'top-rated', 'airing-today', 'on-tv'].includes(category)) {
    const queryKey = queryKeys.category('tv', category as Categories, page);
    const data = await prefetchQuery(() => getTvShows(category as Categories, page), queryKey);
    return data.data;
  }

  // Otherwise use discover API
  const sortBy = url.searchParams.get('sort_by') || 'popularity';
  const sortDir = url.searchParams.get('sort_dir') || 'desc';

  const queryKey = queryKeys.discover('tv', 'discover', {
    page,
    sort_by: `${sortBy}.${sortDir}` as DiscoverParams['sort_by'],
    'vote_count.gte': 50,
  });

  const data = await prefetchQuery(
    () =>
      discoverTvShows({
        page,
        sort_by: `${sortBy}.${sortDir}` as DiscoverParams['sort_by'],
        'vote_count.gte': 50,
      }),
    queryKey
  );
  return data.data;
};
export const tvDetailsLoader = createDetailsLoader('tv');
