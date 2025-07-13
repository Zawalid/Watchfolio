import { parseAsString, useQueryState } from 'nuqs';
import MediaCardsList from '@/components/media/MediaCardsList';
import { discoverMovies, discoverTvShows, getMovies, getTvShows } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { useDiscoverParams } from '@/hooks/useDiscoverParams';

interface MediaPageProps {
  type: MediaType;
  categories: Categories[];
}

export default function MediaPage({ type, categories }: MediaPageProps) {
  const [category] = useQueryState('category', parseAsString);
  const { discoverParams, page } = useDiscoverParams(type);

  const isValidCategory = category && categories.includes(category as Categories);

  // If there's a valid category, use the category endpoint
  if (isValidCategory) {
    const getFn = type === 'movie' ? getMovies : getTvShows;
    return (
      <MediaCardsList
        queryOptions={{
          queryKey: queryKeys.category(type, category as Categories, page),
          queryFn: async () => await getFn(category as Categories, page),
        }}
      />
    );
  }

  // Use discover for general browsing or when filters are applied
  const discoverFn = type === 'movie' ? discoverMovies : discoverTvShows;
  return (
    <MediaCardsList
      queryOptions={{
        queryKey: queryKeys.discover(type, discoverParams),
        queryFn: async () => await discoverFn(discoverParams),
      }}
    />
  );
}
