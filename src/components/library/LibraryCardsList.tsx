import { useEffect, useMemo } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useNavigate } from 'react-router';
import { Search, X } from 'lucide-react';
import EmptyState from './EmptyState';
import LibraryCard from './LibraryCard';
import { ITEMS_PER_PAGE, LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useListNavigator } from '@/hooks/useListNavigator';
import { generateMediaLink } from '@/utils/media';
import { Pagination } from '../ui/Pagination';

interface LibraryCardsListProps {
  items: LibraryMedia[];
  status: LibraryFilterStatus;
  isOwnProfile: boolean;
}

export default function LibraryCardsList({ items, status, isOwnProfile }: LibraryCardsListProps) {
  const [query, setQuery] = useQueryState('query');
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const navigate = useNavigate();

  const totalPages = Math.ceil((items?.length || 0) / ITEMS_PER_PAGE);
  const displayedItems = useMemo(() => items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE), [items, page]);

  const { containerRef, currentIndex, setCurrentIndex } = useListNavigator({
    itemCount: displayedItems.length,
    onSelect: (index) => {
      const item = displayedItems[index];
      if (item) navigate(generateMediaLink(item.media_type, item.id, item.title || 'Untitled'));
    },
    enabled: displayedItems.length > 0,
  });

  useEffect(() => {
    setPage(1);
    setCurrentIndex(-1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status]);

  if (!items?.length) return <EmptyState status={status} isOwnProfile={isOwnProfile} />;

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h2 className='text-Primary-50 text-xl font-semibold'>
            {query
              ? 'Search Results'
              : status === 'all'
                ? 'All'
                : LIBRARY_MEDIA_STATUS.find((s) => s.value === status)?.label || 'Library'}
          </h2>
          <div className='bg-Primary-500/20 text-Primary-300 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium'>
            <span>{items.length}</span>
            <span className='text-Primary-400/60'>{items.length === 1 ? 'item' : 'items'}</span>
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
        {displayedItems.map((item, index) => (
          <LibraryCard
            key={`${item.id}-${item.media_type}`}
            item={item}
            tabIndex={currentIndex === index ? 0 : -1}
            isOwnProfile={isOwnProfile}
          />
        ))}
      </div>

      {totalPages > 1 && <Pagination className='mt-auto' total={totalPages} page={page} siblings={2} />}
    </>
  );
}
