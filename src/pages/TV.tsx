import CardsList from '@/components/CardsList';
import { getTvShows } from '@/lib/api';
import { useLoaderData, useParams } from 'react-router';

export default function Tv() {
  const { category } = useParams<{ category: Categories }>();

  return (
    <CardsList
      queryOptions={{
        queryKey: ['tv', category],
        queryFn: async () => await getTvShows(category!, 1),
        enabled: !!category,
        initialData: useLoaderData(),
      }}
      errorMessage='Something went wrong while fetching TV Shows. Please try again later.'
    />
  );
}
