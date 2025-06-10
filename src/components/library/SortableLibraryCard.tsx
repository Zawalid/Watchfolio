import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LibraryCard from './LibraryCard';

// Import types from the correct files
type UserMediaData = {
  id: number;
  mediaType: 'movie' | 'tv';
  title?: string;
  posterPath?: string | null;
  releaseDate?: string;
  genres?: string[];
  status: 'watched' | 'watching' | 'willWatch' | 'onHold' | 'dropped' | 'none';
  isFavorite: boolean;
  userRating?: number;
  watchDates?: string[];
  lastWatchedEpisode?: {
    seasonNumber: number;
    episodeNumber: number;
    watchedAt?: string;
  };
  addedToLibraryAt: string;
  lastUpdatedAt: string;
  notes?: string;
};

interface SortableLibraryCardProps {
  item: UserMediaData;
  viewMode: 'grid' | 'list';
  isDragOverlay?: boolean;
  tabIndex?: number;
}

export default function SortableLibraryCard({
  item,
  viewMode,
  isDragOverlay = false,
  tabIndex = 0,
}: SortableLibraryCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${item.mediaType}-${item.id}`,
    data: {
      type: 'LibraryCard',
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  if (isDragOverlay) {
    return (
      <div style={{ opacity: 0.8, transform: 'rotate(5deg)' }}>
        <LibraryCard item={item} viewMode={viewMode} tabIndex={tabIndex} />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='touch-none'>
      <LibraryCard item={item} viewMode={viewMode} tabIndex={tabIndex} />
    </div>
  );
}
