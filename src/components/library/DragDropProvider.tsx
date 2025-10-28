import { ReactNode, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from '@dnd-kit/core';
import { Button, addToast } from '@heroui/react';
import { Undo2 } from 'lucide-react';
import { useAddOrUpdateLibraryItem } from '@/hooks/library/useLibraryMutations';
import BaseMediaCard from '@/components/media/BaseMediaCard';
import { getGenres } from '@/utils/media';

interface TabItem {
  label: string;
  value: string;
  icon?: ReactNode;
  link?: string;
}

interface DragDropProviderProps {
  children: ReactNode;
  tabs: TabItem[];
  isOwnProfile: boolean;
}

export function DragDropProvider({ children, tabs, isOwnProfile }: DragDropProviderProps) {
  const { mutate: updateLibraryItem } = useAddOrUpdateLibraryItem();
  const [draggedItem, setDraggedItem] = useState<LibraryMedia | null>(null);

  // Configure drag and drop sensors for better accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Minimal distance for instant response
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Minimal delay for faster touch response
        tolerance: 5, // Allow 5px of movement during delay
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Handle drag start - track dragged item
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggableData = active.data.current;

    if (draggableData?.item) {
      setDraggedItem(draggableData.item as LibraryMedia);
    }
  };

  // Handle drag end - update item status
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Clear dragged item
    setDraggedItem(null);

    // No drop target
    if (!over) return;

    // Extract data from drag event
    const droppableData = over.data.current;
    const draggableData = active.data.current;

    // Check if dropped on a status tab
    if (droppableData?.type !== 'status-tab' || !draggableData?.item) return;

    const targetStatus = droppableData.status as WatchStatus;
    const item = draggableData.item as LibraryMedia;

    // Don't update if dropping on current status
    if (item.status === targetStatus) {
      // Get readable status name from tabs
      const statusLabel = tabs.find((tab) => tab.value === targetStatus)?.label.split(' (')[0] || targetStatus;
      addToast({
        title: 'Already in this status',
        description: `"${item.title}" is already in ${statusLabel}`,
        color: 'default',
      });
      return;
    }

    // Store the previous status for undo functionality
    const previousStatus = item.status;
    const previousStatusLabel =
      tabs.find((tab) => tab.value === previousStatus)?.label.split(' (')[0] || previousStatus;
    const newStatusLabel = tabs.find((tab) => tab.value === targetStatus)?.label.split(' (')[0] || targetStatus;

    // Update the item status
    updateLibraryItem(
      {
        item: {
          id: item.id,
          status: targetStatus,
        },
      },
      {
        onSuccess: () => {
          addToast({
            title: 'Status updated',
            description: (
              <div className='w-full flex items-center justify-between gap-3'>
                <span>
                  "{item.title}" moved to {newStatusLabel}
                </span>
                <Button
                  size='sm'
                  className='button-secondary! text-xs! h-7'
                  startContent={<Undo2 className='size-3.5 shrink-0' />}
                  onPress={() => {
                    // Revert to previous status
                    updateLibraryItem({
                      item: {
                        id: item.id,
                        status: previousStatus,
                      },
                    });
                    addToast({
                      title: 'Undone',
                      description: `"${item.title}" moved back to ${previousStatusLabel}`,
                      color: 'default',
                    });
                  }}
                >
                  Undo
                </Button>
              </div>
            ),
            color: 'success',
          });
        },
        onError: () => {
          addToast({
            title: 'Failed to update status',
            description: 'An error occurred. Please try again.',
            color: 'danger',
          });
        },
      }
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      {children}

      {/* Drag Overlay - shows what's being dragged */}
      <DragOverlay dropAnimation={null}>
        {draggedItem ? (
          <div className='scale-90 rotate-3 cursor-grabbing opacity-90'>
            <BaseMediaCard
              id={draggedItem.tmdbId}
              title={draggedItem.title || 'Untitled'}
              mediaType={draggedItem.media_type}
              posterPath={draggedItem.posterPath}
              releaseDate={draggedItem.releaseDate}
              rating={draggedItem.rating}
              genres={getGenres(draggedItem.genres || [])}
              item={draggedItem}
              isOwnProfile={isOwnProfile}
              disableHover={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
