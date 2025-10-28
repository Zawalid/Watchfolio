import BaseMediaCard from '@/components/media/BaseMediaCard';
import { getGenres } from '@/utils/media';
import { GripVertical } from 'lucide-react';
import { Button } from '@heroui/react';

import { useDraggable } from '@dnd-kit/core';

interface LibraryCardProps {
  item: LibraryMedia;
  tabIndex?: number;
  isFocused?: boolean;
  isOwnProfile?: boolean;
}

export default function LibraryCard({ item, tabIndex, isOwnProfile }: LibraryCardProps) {
  const title = item.title || 'Untitled';

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${item.tmdbId}-${item.media_type}`, // Unique ID for each card
    data: {
      item, // Pass the item data for later use
    },
    disabled: !isOwnProfile, // Only allow dragging on own profile
  });

  // Keep card in place, just reduce opacity when dragging
  const style = {
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className='group relative'>
      {/* Drag Handle - Only visible on own profile */}
      {isOwnProfile && (
        <Button
          isIconOnly
          size='sm'
          tabIndex={-1}
          className='hover:border-Primary-400/60 hover:bg-Primary-500/30 hover:text-Primary-200 pointer-events-auto absolute top-1/2 left-1/2 z-50 h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab border border-white/30 bg-white/15 text-white opacity-0 backdrop-blur-xl transition-all group-hover:opacity-100 active:cursor-grabbing'
          aria-label={`Drag ${title} to change status`}
          as='div'
        >
          <div
            {...listeners}
            {...attributes}
            className='flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing'
          >
            <GripVertical className='pointer-events-none size-3.5' />
          </div>
        </Button>
      )}

      <BaseMediaCard
        id={item.tmdbId}
        title={title}
        mediaType={item.media_type}
        posterPath={item.posterPath}
        releaseDate={item.releaseDate}
        rating={item.rating}
        genres={getGenres(item.genres || [])}
        item={item}
        tabIndex={tabIndex}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
}
