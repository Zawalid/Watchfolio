import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import EmptyState from './EmptyState';
import LibraryCard from './LibraryCard';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts';

const CARD_WIDTH = 200;
const CARDS_GAP = 16;

interface LibraryCardsListProps {
  items: LibraryMedia[];
  allItems: LibraryMedia[];
  status: LibraryFilterStatus;
  query: string;
  onReorder?: (reorderedItems: LibraryMedia[]) => void;
}

export default function LibraryCardsList({ items, status, query }: LibraryCardsListProps) {
  const [displayedItems, setDisplayedItems] = useState(items);
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedItems(items);
  }, [items]);

  useKeyboardShortcuts(
    [
      {
        key: 'ArrowRight',
        callback: () => {
          if (focusIndex < displayedItems.length - 1) setFocusIndex(focusIndex + 1);
        },
      },
      {
        key: 'ArrowLeft',
        callback: () => {
          if (focusIndex > 0) setFocusIndex(focusIndex - 1);
        },
      },
      {
        key: 'ArrowDown',
        callback: () => {
          const itemsPerRow = getApproximateItemsPerRow();
          if (focusIndex + itemsPerRow < displayedItems.length) setFocusIndex(focusIndex + itemsPerRow);
          else setFocusIndex(displayedItems.length - 1);
        },
      },
      {
        key: 'ArrowUp',
        callback: () => {
          const itemsPerRow = getApproximateItemsPerRow();
          if (focusIndex - itemsPerRow >= 0) setFocusIndex(focusIndex - itemsPerRow);
          else setFocusIndex(0);
        },
      },
      {
        key: 'Home',
        callback: () => setFocusIndex(0),
      },
      {
        key: 'End',
        callback: () => setFocusIndex(displayedItems.length - 1),
      },
    ],
    { enabled: displayedItems.length > 0 }
  );

  const getApproximateItemsPerRow = () => {
    if (!cardsRef.current) return 5;

    const containerWidth = cardsRef.current.clientWidth;
    return Math.max(1, Math.floor(containerWidth / (CARD_WIDTH + CARDS_GAP)));
  };

  useEffect(() => {
    if (focusIndex >= 0 && cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('[role="article"]');
      if (cards[focusIndex]) (cards[focusIndex] as HTMLElement).focus();
    }
  }, [focusIndex]);

  useEffect(() => {
    setFocusIndex(-1);
  }, [items]);

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

      <div ref={cardsRef} className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
        {displayedItems.map((item, index) => (
          <LibraryCard key={`${item.id}-${item.media_type}`} item={item} tabIndex={focusIndex === index ? 0 : -1} />
        ))}
      </div>
    </>
  );
}
