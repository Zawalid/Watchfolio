import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useInView } from 'react-intersection-observer';
import { useQueryState } from 'nuqs';
import { MediaCardSkeleton } from '@/components/media/MediaCardsListSkeleton';
import { Search, X } from 'lucide-react';
import EmptyState from './EmptyState';
import { Status } from '@/components/ui/Status';
import MediaCardsListSkeleton from '../media/MediaCardsListSkeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { useDiscoverParams } from '@/hooks/useDiscoverParams';
import { useListNavigator } from '@/hooks/useListNavigator';
import {
  useInfiniteLibraryItems,
  useInfinitePublicLibraryItems,
  useLibraryTotalCount,
} from '@/hooks/library/useLibraryQueries';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { GENRES, NETWORKS } from '@/utils/constants/TMDB';
import { generateMediaLink } from '@/utils/media';
import { Profile } from '@/lib/appwrite/types';
import MediaCard from '../media/MediaCard';
import LibraryCard from './LibraryCard';
import { libraryMediaToMedia } from '@/utils/library';
import { useAuthStore } from '@/stores/useAuthStore';

interface LibraryViewProps {
  profile?: Profile;
  stats?: LibraryStats;
  status: LibraryFilterStatus;
  isSearching?: boolean;
}

export default function LibraryView({ profile, stats, status, isSearching = false }: LibraryViewProps) {
  const { checkIsOwnProfile } = useAuthStore();

  const isOwnProfile = !profile || checkIsOwnProfile(profile?.username);
  const libraryId = profile?.library;

  const { sortBy, sortDir, selectedTypes, selectedGenres, selectedNetworks } = useDiscoverParams(undefined, 'recent');
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const debouncedQuery = useDebounce(query, 150);
  const { ref: inViewRef, inView } = useInView({ rootMargin: '400px' });
  const localLibraryCount = useLibraryTotalCount();

  const filters = useMemo(() => {
    return {
      status,
      query: debouncedQuery,
      sortBy,
      sortDir: sortDir as 'asc' | 'desc',
      mediaType: selectedTypes && selectedTypes.length === 1 ? (selectedTypes[0] as MediaType) : undefined,
      genres: GENRES.filter((g) => selectedGenres?.includes(g.slug)).map((g) => g.id) || undefined,
      networks: NETWORKS.filter((n) => selectedNetworks?.includes(n.slug)).map((n) => n.id) || undefined,
    };
  }, [status, debouncedQuery, sortBy, sortDir, selectedTypes, selectedGenres, selectedNetworks]);

  const localQuery = useInfiniteLibraryItems(filters, { enabled: isOwnProfile });
  const publicQuery = useInfinitePublicLibraryItems(libraryId!, filters, { enabled: !isOwnProfile && !!libraryId });

  const { data, fetchNextPage, hasNextPage, isLoading, isError } = isOwnProfile ? localQuery : publicQuery;

  const isDebouncing = query !== debouncedQuery;

  useEffect(() => {
    if (inView && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isLoading]);

  const items = useMemo(() => data?.pages.flatMap((page) => page as LibraryMedia[]) ?? [], [data]);
  const totalCount = isOwnProfile ? localLibraryCount[status] : stats?.[status];

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

  if (isLoading && !query) return <MediaCardsListSkeleton />;
  if (isError) return <Status.Error message='There was an error loading the media list. Please try again.' />;
  if (items.length === 0 && !isLoading && !isDebouncing) {
    if (!isOwnProfile)
      return <Status.Empty title='This Library is Empty' message='This user has not added any items yet.' />;
    return <EmptyState status={status} isOwnProfile={isOwnProfile} />;
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h2 className='text-Primary-50 text-xl font-semibold'>
            {query ? 'Search Results' : LIBRARY_MEDIA_STATUS.find((s) => s.value === status)?.label || 'Library'}
          </h2>
          {totalCount !== undefined && (
            <div className='bg-Primary-500/20 text-Primary-300 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium'>
              <span>{totalCount}</span>
              <span className='text-Primary-400/60'>{totalCount === 1 ? 'item' : 'items'}</span>
            </div>
          )}
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
      <div
        ref={containerRef}
        className={`grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 transition-opacity duration-200 ${
          isSearching ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {items.map((item, index) => {
          if (isOwnProfile)
            return (
              <LibraryCard
                key={`${item.id}-${item.media_type}`}
                item={item}
                tabIndex={currentIndex === index ? 0 : -1}
                isOwnProfile={isOwnProfile}
              />
            );
          return (
            <MediaCard
              key={`${item.tmdbId}-${item.media_type}`}
              media={libraryMediaToMedia(item) as Media}
              tabIndex={currentIndex === index ? 0 : -1}
            />
          );
        })}
        {hasNextPage && Array.from({ length: 10 }).map((_, index) => <MediaCardSkeleton key={index} />)}
      </div>
      <div ref={inViewRef} className='h-10' />
    </>
  );
}
