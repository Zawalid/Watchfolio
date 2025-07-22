import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, X } from 'lucide-react';
import EmptyState from './EmptyState';
import LibraryCard from './LibraryCard';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useListNavigator } from '@/hooks/useListNavigator';
import { generateMediaLink } from '@/utils/media';
import { useFiltersParams } from '@/hooks/useFiltersParams';

interface LibraryCardsListProps {
  items: LibraryMedia[];
  allItems?: LibraryMedia[];
  status: LibraryFilterStatus;
  isOwnProfile: boolean;
  children?: React.ReactNode;
}

export default function LibraryCardsList({ items, status, isOwnProfile, allItems, children }: LibraryCardsListProps) {
  const { query, setQuery, hasFilters } = useFiltersParams();
  const navigate = useNavigate();

  const { containerRef, currentIndex, setCurrentIndex } = useListNavigator({
    itemCount: items.length,
    onSelect: (index) => {
      const item = items[index];
      if (item) navigate(generateMediaLink(item.media_type, item.id, item.title || 'Untitled'));
    },
    enabled: items.length > 0,
  });

  useEffect(() => {
    setCurrentIndex(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status]);

  const totalCount = (hasFilters || !!query) ? items.length : (allItems?.length ?? items.length);

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
            <span>{totalCount}</span>
            <span className='text-Primary-400/60'>{totalCount === 1 ? 'item' : 'items'}</span>
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
        {children}
      </div>
    </>
  );
}
