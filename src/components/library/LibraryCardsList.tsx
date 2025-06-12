import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableLibraryCard from './SortableLibraryCard';
import EmptyState from './EmptyState';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

interface LibraryCardsListProps {
  items: LibraryMedia[];
  allItems: LibraryMedia[];
  status: LibraryFilterStatus;
  query: string;
  onReorder?: (reorderedItems: LibraryMedia[]) => void;
}

export default function LibraryCardsList({ items, status, query, onReorder }: LibraryCardsListProps) {
  const [parent] = useAutoAnimate({ duration: 300 });
  const [sortableItems, setSortableItems] = useState(items);

  // Update sortable items when items prop changes
  useEffect(() => {
    setSortableItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortableItems.findIndex((item) => `${item.media_type}-${item.id}` === active.id);
      const newIndex = sortableItems.findIndex((item) => `${item.media_type}-${item.id}` === over.id);

      const reorderedItems = arrayMove(sortableItems, oldIndex, newIndex);
      setSortableItems(reorderedItems);
      onReorder?.(reorderedItems);
    }
  };

  if (items.length === 0) return <EmptyState status={status} hasQuery={!!query} query={query} />;

  return (
    <>
      {/* Results header */}
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
            <span>{sortableItems.length}</span>
            <span className='text-Primary-400/60'>{sortableItems.length === 1 ? 'item' : 'items'}</span>
          </div>
        </div>

        {/* Search indicator */}
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

      {/* Items grid with Drag & Drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortableItems.map((item) => `${item.media_type}-${item.id}`)}
          strategy={rectSortingStrategy}
        >
          <div ref={parent} className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
            {sortableItems.map((item) => (
              <div key={`${item.id}-${item.media_type}`}>
                <SortableLibraryCard item={item} />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
