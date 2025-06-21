import { useParams, useLoaderData } from 'react-router';
import { parseAsInteger, useQueryState } from 'nuqs';
import MediaCardsList from '@/components/Media/MediaCardsList';
import { getTvShows } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';

export default function Tv() {
  const { category } = useParams<{ category: Categories }>();
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const initialData = useLoaderData();

  return (
    <MediaCardsList
      queryOptions={{
        queryKey: queryKeys.category('tv', category!, page),
        queryFn: async () => await getTvShows(category!, page),
        enabled: !!category,
        placeholderData: (previousData) => previousData || initialData,
      }}
      errorMessage='Something went wrong while fetching TV Shows. Please try again later.'
    />
  );
}
