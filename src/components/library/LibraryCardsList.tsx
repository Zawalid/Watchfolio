import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useInView } from 'react-intersection-observer';
import { MediaCardSkeleton } from '@/components/media/MediaCardsListSkeleton';
import { useInfiniteLibraryItems, useLibraryTotalCount } from '@/hooks/library/useLibraryQueries';
import { useDiscoverParams } from '@/hooks/useDiscoverParams';
import { Search, X } from 'lucide-react';
import EmptyState from './EmptyState';
import LibraryCard from './LibraryCard';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useListNavigator } from '@/hooks/useListNavigator';
import { generateMediaLink } from '@/utils/media';
import { Status } from '@/components/ui/Status';
import MediaCardsListSkeleton from '../media/MediaCardsListSkeleton';
import { useQueryState } from 'nuqs';
import { NETWORKS } from '@/utils/constants/TMDB';

interface LibraryCardsListProps {
  status: LibraryFilterStatus;
  isOwnProfile: boolean;
}

export default function LibraryCardsList({ status, isOwnProfile }: LibraryCardsListProps) {
  const { sortBy, sortDir, selectedTypes, selectedGenres, selectedNetworks } = useDiscoverParams(undefined, 'recent');
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });

  const { ref, inView } = useInView({ rootMargin: '400px' });

  const { data, fetchNextPage, hasNextPage, isLoading, isError } = useInfiniteLibraryItems({
    status,
    query,
    sortBy,
    sortDir: sortDir as 'asc' | 'desc',
    mediaType: selectedTypes && selectedTypes.length === 1 ? (selectedTypes[0] as MediaType) : undefined,
    genres: selectedGenres || undefined,
    networks: NETWORKS.filter((n) => selectedNetworks?.includes(n.slug)).map((n) => n.id) || undefined,
  });
  const libraryCount = useLibraryTotalCount();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const items = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data]);

  const navigate = useNavigate();

  const { containerRef, currentIndex, setCurrentIndex } = useListNavigator({
    itemCount: items.length,
    onSelect: (index) => {
      const item = items[index];
      if (item) navigate(generateMediaLink(item));
    },
    enabled: !isLoading && items.length > 0,
  });

  useEffect(() => {
    setCurrentIndex(-1);
  }, [query, status, setCurrentIndex]);

  if (isLoading) return <MediaCardsListSkeleton />;
  if (isError) return <Status.Error message='There was an error loading the media list. Please try again.' />;
  if (items.length === 0) return <EmptyState status={status} isOwnProfile={isOwnProfile} />;

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h2 className='text-Primary-50 text-xl font-semibold'>
            {query ? 'Search Results' : LIBRARY_MEDIA_STATUS.find((s) => s.value === status)?.label || 'Library'}
          </h2>
          <div className='bg-Primary-500/20 text-Primary-300 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium'>
            <span>{libraryCount[status]}</span>
            <span className='text-Primary-400/60'>{libraryCount[status] === 1 ? 'item' : 'items'}</span>
          </div>
        </div>
        {query && (
          <div className='border-Primary-400/30 bg-Primary-500/10 text-Primary-300 flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm'>
            <Search className='size-4' />
            <span>"{query}"</span>
            <button
              onClick={() => setQuery(null)}
              className='text-Primary-400 hover:bg-Primary-400/20 hover:text-Primary-300 ml-1 rounded-full p-0.5 transition-colors'
              aria-label='Clear search'
            >
              <X className='size-3' />
            </button>
          </div>
        )}
      </div>
      <div ref={containerRef} className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
        {items.map((item, index) => (
          <LibraryCard
            key={`${item.id}-${item.media_type}`}
            item={item}
            tabIndex={currentIndex === index ? 0 : -1}
            isOwnProfile={isOwnProfile}
          />
        ))}
        {hasNextPage && Array.from({ length: 10 }).map((_, index) => <MediaCardSkeleton key={index} />)}
      </div>

      <div ref={ref} className='h-10' />
    </>
  );
}
