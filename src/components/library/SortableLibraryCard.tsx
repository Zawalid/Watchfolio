import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LibraryCard from './LibraryCard';

interface SortableLibraryCardProps {
  item: LibraryMedia;
}

export default function SortableLibraryCard({ item }: SortableLibraryCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${item.media_type}-${item.id}`,
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
