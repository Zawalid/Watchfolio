import { useParams, useLoaderData } from 'react-router';
import { parseAsInteger, useQueryState } from 'nuqs';
import MediaCardsList from '@/components/Media/MediaCardsList';
import { getMovies } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';

export default function Movies() {
  const { category } = useParams<{ category: Categories }>();
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const initialData = useLoaderData();

  return (
    <MediaCardsList
      queryOptions={{
        queryKey: queryKeys.category('movie', category!, page),
        queryFn: async () => await getMovies(category!, page),
        enabled: !!category,
        placeholderData: (previousData) => previousData || initialData,
      }}
      errorMessage='Something went wrong while fetching movies. Please try again later.'
    />
  );
}
