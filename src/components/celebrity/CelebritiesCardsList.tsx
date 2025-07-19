import {  useEffect } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useNavigate } from 'react-router';
import PersonCard from '@/components/celebrity/details/CelebrityCard';
import { Pagination } from '@/components/ui/Pagination';
import CelebritiesCardsListSkeleton from '@/components/celebrity/CelebritiesCardsListSkeleton';
import { useListNavigator } from '@/hooks/useListNavigator';
import { slugify } from '@/utils';
import { Status } from '@/components/ui/Status';
import { Users2Icon } from 'lucide-react';

type CelebritiesCardsListProps = {
  queryOptions: UseQueryOptions<TMDBResponse<Person>>;
};

export default function CelebritiesCardsList({ queryOptions }: CelebritiesCardsListProps) {
  const [query] = useQueryState('query', { defaultValue: '' });
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    ...queryOptions,
    queryKey: [...new Set([...queryOptions.queryKey, query, page])],
  });

  const { containerRef, currentIndex, setCurrentIndex } = useListNavigator({
    itemCount: data?.results?.length || 0,
    onSelect: (index) => {
      if (index >= 0 && data?.results?.[index]) {
        const person = data.results[index];
        navigate(`/celebrities/${person.id}-${slugify(person.name)}`);
      }
    },
  });

  useEffect(() => {
    setCurrentIndex(-1);
  }, [data?.results, query, page, setCurrentIndex]);

  if (isLoading) return <CelebritiesCardsListSkeleton length={20} />;
  if (isError)
    return (
      <Status.Error
        message='There was an error loading the celebrity list. Please try again.'
        onRetry={() => refetch()}
      />
    );
  if (!data?.results?.length)
    return (
      <Status.NoResults message="We couldn't find any celebrities matching your search. Try different keywords or explore trending celebrities." />
    );
  if (data?.total_results === 0)
    return (
      <Status.Empty
        Icon={Users2Icon}
        title='No Celebrities'
        message='It seems there are no celebrities at the moment. Please come back and check later.'
      />
    );

  return (
    <>
      <div ref={containerRef} className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-5'>
        {data?.results?.map((person, index) => (
          <PersonCard key={person.id} person={person} tabIndex={currentIndex === index ? 0 : -1} />
        ))}
      </div>
      <Pagination
        total={Math.min(data?.total_pages || 0, 500)} // TMDB API only allows up to 500 pages
        page={page || data?.page}
        siblings={2}
      />
    </>
  );
}
