import { type LoaderFunctionArgs } from 'react-router';
import { getDetails, getMovies, getTvShows } from '@/lib/api/TMDB';
import { prefetchQuery, queryKeys } from '@/lib/react-query';

const createDetailsLoader =
  (type: 'movie' | 'tv') =>
  async ({ params }: LoaderFunctionArgs) => {
    const slug = params.slug as string;
    const queryKey = queryKeys.details(type, slug);

    const data = await prefetchQuery(() => getDetails(type, slug), queryKey);
    return data.data;
  };

const createCategoryLoader =
  (
    type: 'movie' | 'tv',
    fetchFn: (category: Categories, page: number) => Promise<TMDBResponse> | Promise<TMDBResponse[]>
  ) =>
  async ({ params, request }: LoaderFunctionArgs) => {
    const category = params.category as Categories;
    const page = Number(new URL(request.url).searchParams.get('page') || 1);
    const queryKey = queryKeys.category(type, category, page);

    const data = await prefetchQuery<TMDBResponse | TMDBResponse[]>(() => fetchFn(category, page), queryKey);
    return data.data;
  };

export const moviesLoader = createCategoryLoader('movie', getMovies);
export const movieDetailsLoader = createDetailsLoader('movie');
export const tvShowsLoader = createCategoryLoader('tv', getTvShows);
export const tvDetailsLoader = createDetailsLoader('tv');
