import { parseAsString, useQueryState } from 'nuqs';
import MediaAndCelebritiesCardsList from '@/components/Media&CelebritiesCardsList';
import { discoverMovies, discoverTvShows, getMovies, getTvShows } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { useDiscoverParams } from '@/hooks/useDiscoverParams';
import { usePageTitle } from '@/hooks/usePageTitle';
import { slugify } from '@/utils';

interface MediaPageProps {
  type: MediaType;
  categories: Categories[];
}

export default function MediaPage({ type, categories }: MediaPageProps) {
  const [category] = useQueryState('category', parseAsString);
  const { discoverParams } = useDiscoverParams(type);

  usePageTitle(`${category ? slugify(category, { reverse: true }) : ''} ${type === 'movie' ? 'Movies' : 'TV Shows'}`);

  const isValidCategory = category && categories.includes(category as Categories);

  if (isValidCategory) {
    const getFn = type === 'movie' ? getMovies : getTvShows;
    return (
      <MediaAndCelebritiesCardsList
        queryKey={queryKeys.category(type, category as Categories)}
        queryFn={async ({ pageParam }) => await getFn(category as Categories, pageParam)}
        useInfiniteQuery={true}
      />
    );
  }

  const discoverFn = type === 'movie' ? discoverMovies : discoverTvShows;
  return (
    <MediaAndCelebritiesCardsList
      queryKey={queryKeys.discover(type, discoverParams)}
      queryFn={async ({ pageParam }) => await discoverFn({ ...discoverParams, page: pageParam })}
      useInfiniteQuery={true}
    />
  );
}
