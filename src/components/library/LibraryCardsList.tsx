import { useState, useEffect, useRef } from 'react';
import { useQueryState } from 'nuqs';
import { useNavigate } from 'react-router';
import { Search, X } from 'lucide-react';
import EmptyState from './EmptyState';
import LibraryCard from './LibraryCard';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useListNavigator } from '@/hooks/useListNavigator';
import { generateMediaLink } from '@/utils/media';

interface LibraryCardsListProps {
  items: LibraryMedia[];
  allItems: LibraryMedia[];
  status: LibraryFilterStatus;
  isOwnProfile : boolean;
  onReorder?: (reorderedItems: LibraryMedia[]) => void;
}

export default function LibraryCardsList({ items, status, isOwnProfile }: LibraryCardsListProps) {
  const [displayedItems, setDisplayedItems] = useState(items);
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useQueryState('query');

  const navigate = useNavigate();

  useEffect(() => {
    setDisplayedItems(items);
    setFocusIndex(-1);
  }, [items, query, status]);

  useListNavigator({
    containerRef: cardsContainerRef,
    itemSelector: '[role="article"]',
    itemCount: displayedItems.length,
    currentIndex: focusIndex,
    onNavigate: setFocusIndex,
    onSelect: (index) => {
      const item = displayedItems[index];
      if (index >= 0 && displayedItems[index])
        navigate(generateMediaLink(item.media_type, item.id, item.title || 'Untitled'));
    },
    orientation: 'grid',
    enabled: displayedItems.length > 0,
    loop: true,
    autoFocus: true,
  });

  if (items.length === 0) return <EmptyState status={status} isOwnProfile={isOwnProfile} />;

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h2 className='text-Primary-50 text-xl font-semibold'>
            {query
              ? 'Search Results'
              : status === 'all'
                ? 'All '
                : LIBRARY_MEDIA_STATUS.find((s) => s.value === status)?.label || 'Library'}
          </h2>
          <div className='bg-Primary-500/20 text-Primary-300 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium'>
            <span>{displayedItems.length}</span>
            <span className='text-Primary-400/60'>{displayedItems.length === 1 ? 'item' : 'items'}</span>
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

      <div ref={cardsContainerRef} className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
        {displayedItems.map((item, index) => (
          <LibraryCard
            key={`${item.id}-${item.media_type}`}
            item={item}
            tabIndex={focusIndex === index ? 0 : -1}
            isOwnProfile={isOwnProfile}
          />
        ))}
      </div>
    </>
  );
}
