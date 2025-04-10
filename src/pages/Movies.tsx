import CardsList from '@/components/CardsList';
import { getMovies } from '@/lib/api';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useLoaderData, useParams } from 'react-router';

export default function Movies() {
  const { category } = useParams<{ category: Categories }>();
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));

  console.log(page)

  return (
    <CardsList
      queryOptions={{
        queryKey: ['movies', category],
        queryFn: async () => await getMovies(category!, page),
        enabled: !!category,
        initialData: useLoaderData(),
      }}
      errorMessage='Something went wrong while fetching movies. Please try again later.'
    />
  );
}
