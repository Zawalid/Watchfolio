import CardsList from '@/components/CardsList';
import { getTvShows } from '@/lib/api';
import { queryKeys } from '@/lib/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useParams, useLoaderData } from 'react-router';

export default function Tv() {
  const { category } = useParams<{ category: Categories }>();
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const initialData = useLoaderData();

  return (
    <CardsList
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
