import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, X } from 'lucide-react';
import EmptyState from './EmptyState';
import LibraryCard from './LibraryCard';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useListNavigator } from '@/hooks/useListNavigator';
import { slugify } from '@/utils';

interface LibraryCardsListProps {
  items: LibraryMedia[];
  allItems: LibraryMedia[];
  status: LibraryFilterStatus;
  query: string;
  onReorder?: (reorderedItems: LibraryMedia[]) => void;
}

const getLink = (item: LibraryMedia) => {
  const title = item.title || 'Untitled';
  return `/${item.media_type === 'tv' ? 'tv' : 'movies'}/details/${item.id}-${slugify(title)}`;
};

export default function LibraryCardsList({ items, status, query }: LibraryCardsListProps) {
  const [displayedItems, setDisplayedItems] = useState(items);
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
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
      if (index >= 0 && displayedItems[index]) navigate(getLink(displayedItems[index]));
    },
    orientation: 'grid',
    enabled: displayedItems.length > 0,
    loop: true,
    autoFocus: true,
  });

  if (items.length === 0) return <EmptyState status={status} hasQuery={!!query} query={query} />;

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h2 className='text-Primary-50 text-xl font-semibold'>
            {query
              ? 'Search Results'
              : status === 'all'
                ? 'Your Library'
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
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('query');
                window.history.replaceState(null, '', url.toString());
                window.location.reload();
              }}
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
          <LibraryCard key={`${item.id}-${item.media_type}`} item={item} tabIndex={focusIndex === index ? 0 : -1} />
        ))}
      </div>
    </>
  );
}
