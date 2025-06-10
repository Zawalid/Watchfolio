import { useAutoAnimate } from '@formkit/auto-animate/react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import SortableLibraryCard from './SortableLibraryCard';
import EmptyState from './EmptyState';
import LibraryCardsSkeleton from '../skeletons/LibraryCardsSkeleton';

interface LibraryCardsListProps {
  items: UserMediaData[];
  allItems: UserMediaData[];
  filter: UserMediaFilter;
  query: string;
  viewMode: 'grid' | 'list';
  isLoading?: boolean;
  onReorder?: (reorderedItems: UserMediaData[]) => void;
}

export default function LibraryCardsList({
  items,
  filter,
  query,
  viewMode,
  isLoading = false,
  onReorder,
}: LibraryCardsListProps) {
  const [parent] = useAutoAnimate({
    duration: 300,
    easing: 'ease-out',
  });
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
      const oldIndex = sortableItems.findIndex((item) => `${item.mediaType}-${item.id}` === active.id);
      const newIndex = sortableItems.findIndex((item) => `${item.mediaType}-${item.id}` === over.id);

      const reorderedItems = arrayMove(sortableItems, oldIndex, newIndex);
      setSortableItems(reorderedItems);
      onReorder?.(reorderedItems);
    }
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className='space-y-8'>
        {/* Stats skeleton */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='animate-pulse rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6'
            >
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='bg-Grey-700 h-6 w-6 rounded-full' />
                </div>
                <div className='space-y-2'>
                  <div className='bg-Grey-700 h-8 w-16 rounded' />
                  <div className='bg-Grey-700 h-4 w-24 rounded' />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cards skeleton */}
        <LibraryCardsSkeleton viewMode={viewMode} />
      </div>
    );
  }

  // Show empty state if no items
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='space-y-8'
      >
        <EmptyState filter={filter} hasQuery={!!query} query={query} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className='space-y-8'>
      {/* Results header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className='flex items-center justify-between'
      >
        <div className='flex items-center gap-3'>
          <h2 className='text-Primary-50 text-xl font-semibold'>
            {query
              ? 'Search Results'
              : filter === 'all'
                ? 'Your Library'
                : filter === 'favorites'
                  ? 'Your Favorites'
                  : `${filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}`}
          </h2>
          <div className='bg-Primary-500/20 text-Primary-300 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium'>
            <span>{sortableItems.length}</span>
            <span className='text-Primary-400/60'>{sortableItems.length === 1 ? 'item' : 'items'}</span>
          </div>
        </div>

        {/* Search indicator */}
        {query && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className='border-Primary-400/30 bg-Primary-500/10 text-Primary-300 flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm'
          >
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
          </motion.div>
        )}
      </motion.div>{' '}
      {/* Items grid/list with Drag & Drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortableItems.map((item) => `${item.mediaType}-${item.id}`)}
          strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
        >
          <motion.div
            ref={parent}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] lg:gap-6 xl:grid-cols-5 2xl:grid-cols-6'
                : 'space-y-3 sm:space-y-4'
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <AnimatePresence mode='popLayout'>
              {sortableItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.mediaType}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.3,
                      delay: Math.min(index * 0.05, 0.5), // Max delay of 0.5s
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  }}
                  layout
                >
                  <SortableLibraryCard item={item} viewMode={viewMode} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>{' '}
        </SortableContext>
      </DndContext>
    </motion.div>
  );
}
