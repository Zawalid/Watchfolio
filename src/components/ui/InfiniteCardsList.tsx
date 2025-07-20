import { useEffect } from 'react';
import { useInfiniteQuery, useQuery, InfiniteData, QueryFunctionContext } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useQueryState } from 'nuqs';
import { useListNavigator } from '@/hooks/useListNavigator';
import { cn } from '@/utils';
import { Status } from '@/components/ui/Status';
import { Pagination } from '@/components/ui/Pagination';

export type InfiniteCardsListProps<T> = {
  queryKey: readonly unknown[];
  queryFn:
    | ((ctx: QueryFunctionContext<readonly unknown[], number>) => Promise<TMDBResponse<T>>)
    | (() => Promise<TMDBResponse<T>>);
  CardComponent: React.ComponentType<{ item: T; tabIndex?: number }>;
  SkeletonComponent: React.ComponentType<{ length?: number; asSlider?: boolean }>;
  getItemKey: (item: T) => string | number;
  asSlider?: boolean;
  slideClassName?: string;
  sliderProps?: any;
  enabled?: boolean;
  useInfiniteQuery?: boolean;
  gridClassName?: string;
  containerRef?: React.Ref<HTMLDivElement>;
  // Status messages
  errorMessage?: string;
  noResultsMessage?: string;
  emptyMessage?: string;
  emptyIcon?: React.ComponentType<any>;
  emptyTitle?: string;
  paginationProps?: Record<string, any>;
};

function getNextPageParamDefault(lastPage: { page: number; total_pages: number; results: any[] }) {
  if (
    !lastPage ||
    typeof lastPage.page !== 'number' ||
    typeof lastPage.total_pages !== 'number' ||
    !Array.isArray(lastPage.results)
  )
    return undefined;
  const nextPage = lastPage.page + 1;
  return nextPage > lastPage.total_pages || nextPage > 500 ? undefined : nextPage;
}

export function InfiniteCardsList<T>({
  queryKey,
  queryFn,
  CardComponent,
  SkeletonComponent,
  getItemKey,
  asSlider = false,
  slideClassName,
  sliderProps,
  enabled = true,
  useInfiniteQuery: useInfinite = true,
  gridClassName = 'grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-5',
  containerRef,
  errorMessage = 'There was an error loading the list.',
  noResultsMessage = 'No results found.',
  emptyMessage = 'No items available.',
  emptyIcon,
  emptyTitle,
  paginationProps = {},
}: InfiniteCardsListProps<T>) {
  const [query] = useQueryState('query', { defaultValue: '' });

  // Normal query for paginated results
  const normalQuery = useQuery<TMDBResponse<T>, Error>({
    queryKey,
    queryFn: queryFn as () => Promise<TMDBResponse<T>>,
    enabled: !useInfinite && enabled,
  });

  // Infinite query for infinite scrolling
  const infiniteQuery = useInfiniteQuery<TMDBResponse<T>, Error, TMDBResponse<T>, readonly unknown[], number>({
    queryKey,
    queryFn: queryFn as (ctx: QueryFunctionContext<readonly unknown[], number>) => Promise<TMDBResponse<T>>,
    enabled: useInfinite && enabled,
    getNextPageParam: getNextPageParamDefault,
    initialPageParam: 1,
  });

  // Intersection observer for infinite scroll
  const { ref: sentinelRef, inView } = useInView({ rootMargin: '200px' });
  useEffect(() => {
    if (useInfinite && inView && infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
      infiniteQuery.fetchNextPage();
    }
  }, [useInfinite, inView, infiniteQuery.hasNextPage, infiniteQuery.isFetchingNextPage]);

  // Data extraction
  const isLoading = useInfinite ? infiniteQuery.isLoading : normalQuery.isLoading;
  const isError = useInfinite ? infiniteQuery.isError : normalQuery.isError;
  const refetch = useInfinite ? infiniteQuery.refetch : normalQuery.refetch;

  function isInfiniteData(data: unknown): data is InfiniteData<TMDBResponse<T>, number> {
    return !!data && typeof data === 'object' && 'pages' in data && Array.isArray((data as any).pages);
  }
  const infiniteData = useInfinite && isInfiniteData(infiniteQuery.data) ? infiniteQuery.data : undefined;

  const results: T[] =
    useInfinite && infiniteData && Array.isArray(infiniteData.pages)
      ? infiniteData.pages.flatMap((page) => page.results)
      : !useInfinite && normalQuery.data
        ? normalQuery.data.results
        : [];

  const totalResults =
    useInfinite && infiniteData && Array.isArray(infiniteData.pages)
      ? infiniteData.pages[0]?.total_results || 0
      : !useInfinite && normalQuery.data
        ? normalQuery.data.total_results
        : 0;

  const currentPage = !useInfinite && normalQuery.data ? normalQuery.data.page : 1;
  const totalPages = !useInfinite && normalQuery.data ? normalQuery.data.total_pages : 1;

  const {
    containerRef: navRef,
    currentIndex,
    setCurrentIndex,
  } = useListNavigator({
    itemCount: results.length,
    onSelect: () => {},
    enabled: !asSlider,
  });

  useEffect(() => {
    if (useInfinite && inView && infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
      infiniteQuery.fetchNextPage();
    }
  }, [useInfinite, inView, infiniteQuery.hasNextPage, infiniteQuery.isFetchingNextPage]);

  useEffect(() => {
    setCurrentIndex(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (isLoading) return <SkeletonComponent asSlider={asSlider} />;
  if (isError) return <Status.Error message={errorMessage} onRetry={() => refetch()} />;
  if (!results.length) return <Status.NoResults message={noResultsMessage} />;
  if (totalResults === 0) return <Status.Empty Icon={emptyIcon} title={emptyTitle} message={emptyMessage} />;

  if (asSlider && sliderProps) {
    const Slider = sliderProps.Slider;
    const Slide = sliderProps.Slide;
    return (
      <Slider {...sliderProps}>
        {results.map((item) => (
          <Slide key={getItemKey(item)} className={cn('w-[160px] sm:w-[200px]!', slideClassName)}>
            <CardComponent item={item} />
          </Slide>
        ))}
        {useInfinite && (
          <div
            className='col-span-full w-full'
            ref={sentinelRef}
            style={{ height: infiniteQuery.isFetchingNextPage ? 'auto' : 1 }}
          >
            {infiniteQuery.isFetchingNextPage && <SkeletonComponent length={10} asSlider={asSlider} />}
          </div>
        )}
      </Slider>
    );
  }

  return (
    <>
      <div ref={containerRef || navRef} className={gridClassName}>
        {results.map((item, idx) => (
          <CardComponent key={getItemKey(item)} item={item} tabIndex={currentIndex === idx ? 0 : -1} />
        ))}
        {useInfinite && (
          <div
            className='col-span-full w-full'
            ref={sentinelRef}
            style={{ height: infiniteQuery.isFetchingNextPage ? 'auto' : 1 }}
          >
            {infiniteQuery.isFetchingNextPage && <SkeletonComponent length={10} asSlider={asSlider} />}
          </div>
        )}
      </div>
      {!useInfinite && totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <Pagination page={currentPage} total={totalPages} {...paginationProps} />
        </div>
      )}
    </>
  );
}
