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
import { TMDB_MOVIE_CATEGORIES, TMDB_TV_CATEGORIES } from '@/utils/constants';

const createListLoader = (type: 'movie' | 'tv') => {
  return async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const categories = type === 'movie' ? TMDB_MOVIE_CATEGORIES : TMDB_TV_CATEGORIES;

    if (category && categories.includes(category as Categories)) {
      const queryKey = queryKeys.category(type, category as Categories);
      const fn = type === 'movie' ? getMovies : getTvShows;
      const data = await prefetchQuery<TMDBResponse<Movie | TvShow>>(() => fn(category as Categories), queryKey);
      return data.data;
    }

    const sortBy = url.searchParams.get('sort_by') || 'popularity';
    const sortDir = url.searchParams.get('sort_dir') || 'desc';

    const queryKey = queryKeys.discover(type, { sort_by: `${sortBy}.${sortDir}` as DiscoverParams['sort_by'] });

    const fn = type === 'movie' ? discoverMovies : discoverTvShows;
    const data = await prefetchQuery<TMDBResponse<Movie | TvShow>>(
      () => fn({ sort_by: `${sortBy}.${sortDir}` as DiscoverParams['sort_by'] }),
      queryKey
    );
    return data.data;
  };
};

const createDetailsLoader = (type: 'movie' | 'tv') => {
  return async ({ params }: LoaderFunctionArgs) => {
    const slug = params.slug as string;
    const queryKey = queryKeys.details(type, slug);

    const data = await prefetchQuery(() => getDetails(type, slug), queryKey);
    return data.data;
  };
};

export const moviesLoader = createListLoader('movie');
export const movieDetailsLoader = createDetailsLoader('movie');

export const tvShowsLoader = createListLoader('tv');
export const tvDetailsLoader = createDetailsLoader('tv');

// TODO: Add loaders for other routes