import { JSX } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Card from './Card';
import { Error, NoResults } from './Status';
import Pagination from '@/components/ui/Pagination';
import CardsListSkeleton from './CardsSkeleton';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type CardsListProps = {
  queryOptions: UseQueryOptions<TMDBResponse>;
  emptyComponent?: JSX.Element;
  errorMessage?: string;
};

export default function CardsList({ queryOptions, emptyComponent, errorMessage }: CardsListProps) {
  const [query] = useQueryState('query', { defaultValue: '' });
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));

  const { data, isPending, isError } = useQuery({
    ...queryOptions,
    queryKey: [...queryOptions.queryKey, query, page],
  });

  const [parent] = useAutoAnimate({ duration: 500 });

  if (isError) return <Error message={errorMessage} />;
  if (isPending) return <CardsListSkeleton />;
  if (query && !data?.results?.length) return <NoResults />;
  if (!data?.results?.length && emptyComponent) return emptyComponent;

  return (
    <>
      <div
        className='grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-start gap-5 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'
        ref={parent}
      >
        {data?.results?.map((media) => <Card key={media.id} media={media} />)}
      </div>
      <Pagination
        total={Math.min(data?.total_pages || 0, 500)} //? Because te TMDB API only allows up to 500 pages
        page={page || data?.page}
        siblings={2}
      />
    </>
  );
}
