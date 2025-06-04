import { useAutoAnimate } from '@formkit/auto-animate/react';
import LibraryCard from './LibraryCard';
import EmptyState from './EmptyState';

interface LibraryCardsListProps {
  items: UserMediaData[];
  allItems: UserMediaData[];
  filter: UserMediaFilter;
  query: string;
  viewMode: 'grid' | 'list';
}

export default function LibraryCardsList({ items, filter, query, viewMode }: LibraryCardsListProps) {
  const [parent] = useAutoAnimate({ duration: 500 });

  // Show empty state if no items
  if (items.length === 0) {
    return <EmptyState filter={filter} hasQuery={!!query} query={query} />;
  }

  return (
    <div className='space-y-6'>
      {/* Results count */}
      <div className='flex items-center justify-between'>
        <p className='text-Grey-400 text-sm'>
          {items.length} {items.length === 1 ? 'item' : 'items'}
          {query && ` matching "${query}"`}
        </p>
        {query && (
          <button
            onClick={() => window.history.replaceState(null, '', window.location.pathname)}
            className='text-Primary-400 hover:text-Primary-300 text-sm transition-colors'
          >
            Clear search
          </button>
        )}
      </div>

      {/* Items grid/list */}
      <div
        ref={parent}
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'
            : 'space-y-4'
        }
      >
        {items.map((item) => (
          <LibraryCard key={`${item.id}-${item.mediaType}`} item={item} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
