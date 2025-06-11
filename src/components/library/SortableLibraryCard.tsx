import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LibraryCard from './LibraryCard';

// Import types from the correct files
type LibraryMediaData = {
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
  item: LibraryMediaData;
}

export default function SortableLibraryCard({ item }: SortableLibraryCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${item.mediaType}-${item.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LibraryCard item={item} />
    </div>
  );
}
