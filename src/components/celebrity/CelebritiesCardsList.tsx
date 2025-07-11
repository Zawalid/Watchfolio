import { JSX, useState, useEffect, useRef } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useNavigate } from 'react-router';
import PersonCard from '@/components/celebrity/details/CelebrityCard';
import { Pagination } from '@/components/ui/Pagination';
import CelebritiesCardsListSkeleton from '@/components/celebrity/CelebritiesCardsListSkeleton';
import { Error, NoResults } from '@/components/Status';
import { useListNavigator } from '@/hooks/useListNavigator';
import { useNavigation } from '@/contexts/NavigationContext';
import { slugify } from '@/utils';

type CelebritiesCardsListProps = {
  queryOptions: UseQueryOptions<TMDBResponse<Person>>;
  emptyComponent?: JSX.Element;
  errorMessage?: string;
};

export default function CelebritiesCardsList({
  queryOptions,
  emptyComponent,
  errorMessage,
}: CelebritiesCardsListProps) {
  const [query] = useQueryState('query', { defaultValue: '' });
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isActive } = useNavigation();

  const { data, isLoading, isError, refetch } = useQuery({
    ...queryOptions,
    queryKey: [...new Set([...queryOptions.queryKey, query, page])],
  });

  useEffect(() => {
    setFocusIndex(-1);
  }, [data?.results, query, page]);

  // Only enable navigation when this navigator is active
  const navigationEnabled = isActive('celebrities-cards') && !isLoading && !isError && (data?.results?.length || 0) > 0;

  useListNavigator({
    containerRef: cardsContainerRef,
    itemSelector: '[role="article"]',
    itemCount: data?.results?.length || 0,
    currentIndex: focusIndex,
    onNavigate: setFocusIndex,
    onSelect: (index) => {
      if (index >= 0 && data?.results?.[index]) {
        const person = data.results[index];
        navigate(`/celebrities/${person.id}-${slugify(person.name)}`);
      }
    },
    orientation: 'grid',
    enabled: navigationEnabled,
  });

  if (isError) return <Error message={errorMessage} onRetry={() => refetch()} />;
  if (isLoading) return <CelebritiesCardsListSkeleton length={20} />;
  if (query && !data?.results?.length)
    return (
      <NoResults message="We couldn't find any celebrities matching your search. Try different keywords or explore trending celebrities." />
    );
  if (data?.total_results === 0 && emptyComponent) return emptyComponent;

  return (
    <>
      <div ref={cardsContainerRef} className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-5'>
        {data?.results?.map((person, index) => (
          <PersonCard key={person.id} person={person} tabIndex={focusIndex === index ? 0 : -1} />
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
