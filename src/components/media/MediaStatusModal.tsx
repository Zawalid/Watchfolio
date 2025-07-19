import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Library, Star } from 'lucide-react';
import { Button } from '@heroui/react';
import { ModalBody } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { RATING_LABELS, LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { cn } from '@/utils';
import { useListNavigator } from '@/hooks/useListNavigator';
import { ShortcutKey } from '@/components/ui/ShortcutKey';
import { getShortcut, type ShortcutName } from '@/utils/keyboardShortcuts';
import { useNavigation } from '@/contexts/NavigationContext';

interface MediaStatusModalProps {
  disclosure: Disclosure;
  media: Media | LibraryMedia;
}

const isMedia = (obj: Media | LibraryMedia): obj is Media => obj && ('vote_average' in obj || 'overview' in obj);

export default function MediaStatusModal({ disclosure, media }: MediaStatusModalProps) {
  const [hoverRating, setHoverRating] = useState<number | undefined>(undefined);
  const { registerNavigator, unregisterNavigator } = useNavigation();

  useEffect(() => {
    if (disclosure.isOpen) registerNavigator('media-status-modal');
    else unregisterNavigator('media-status-modal');
    return () => {
      unregisterNavigator('media-status-modal');
    };
  }, [disclosure.isOpen, registerNavigator, unregisterNavigator]);

  const libraryItem = useLibraryStore((state) => state.getItem(media.media_type, media.id));
  const { addOrUpdateItem, removeItem } = useLibraryStore();

  const handleStatusChange = (status: WatchStatus) => {
    if (status === 'none') removeItem(media.media_type, media.id);
    else addOrUpdateItem({ id: media.id, media_type: media.media_type, status }, isMedia(media) ? media : undefined);
  };

  const handleRatingChange = (rating: number | undefined) =>
    addOrUpdateItem(
      { id: media.id, media_type: media.media_type, userRating: rating },
      isMedia(media) ? media : undefined
    );
  const getRatingLabel = (rating: number) => RATING_LABELS[rating as keyof typeof RATING_LABELS] || 'Good';

  return (
    <Modal disclosure={disclosure} size='lg'>
      <ModalBody className='space-y-8 p-8'>
        <StatusSection
          selectedStatus={libraryItem?.status || 'none'}
          setSelectedStatus={handleStatusChange}
          onClose={disclosure.onClose}
          setCurrentRating={handleRatingChange}
        />
        <RatingSection
          currentRating={libraryItem?.userRating}
          hoverRating={hoverRating}
          setCurrentRating={handleRatingChange}
          setHoverRating={setHoverRating}
          getRatingLabel={getRatingLabel}
        />
      </ModalBody>
    </Modal>
  );
}

function StatusSection({
  selectedStatus,
  setSelectedStatus,
  onClose,
  setCurrentRating,
}: {
  selectedStatus: WatchStatus;
  setSelectedStatus: (status: WatchStatus) => void;
  onClose: () => void;
  setCurrentRating: (rating: number | undefined) => void;
}) {
  const statusOptions = LIBRARY_MEDIA_STATUS.filter((o) => o.value !== 'favorites');

  const removeItem = () => {
    setSelectedStatus('none');
    onClose();
  };

  const { containerRef } = useListNavigator({
    itemCount: statusOptions.length,
    onSelect: (index) => {
      if (statusOptions[index]) setSelectedStatus(statusOptions[index].value as WatchStatus);
    },
    orientation: 'vertical',
    initialIndex: statusOptions.findIndex((o) => o.value === selectedStatus),
  });

  useHotkeys(getShortcut('removeFromMediaStatusModal')?.hotkey || '', removeItem);

  useHotkeys(
    getShortcut('rateMedia')?.hotkey || '',
    (e) => {
      const rating = parseInt(e.key);
      if (!isNaN(rating) && rating > 0) setCurrentRating(rating);
    },
    [setSelectedStatus, onClose]
  );
  useHotkeys(getShortcut('rateMedia10')?.hotkey || '', () => setCurrentRating(10));
  useHotkeys(getShortcut('clearRating')?.hotkey || '', () => setCurrentRating(undefined));

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Library className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Media Status</h2>
        </div>
        {selectedStatus !== 'none' && (
          <div className='flex justify-end pt-2'>
            <Button
              variant='ghost'
              size='sm'
              className='rounded-full border border-red-500/20 px-4 py-2 text-xs text-red-400 backdrop-blur-sm transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300'
              onPress={removeItem}
            >
              {getShortcut('removeFromMediaStatusModal')?.description}
              <ShortcutKey shortcutName='removeFromMediaStatusModal' className='kbd-sm!' />
            </Button>
          </div>
        )}
      </div>
      <div className='grid grid-cols-1 gap-3' ref={containerRef}>
        {statusOptions.map((option) => (
          <StatusButton
            key={option.value}
            status={option}
            isSelected={selectedStatus === option.value}
            onClick={() => {
              setSelectedStatus(option.value as WatchStatus);
              onClose();
            }}
          />
        ))}
      </div>
    </div>
  );
}

function StatusButton({
  status,
  isSelected,
  onClick,
}: {
  status: (typeof LIBRARY_MEDIA_STATUS)[number];
  isSelected: boolean;
  onClick: () => void;
}) {
  useHotkeys(getShortcut(status.shortcut as ShortcutName)?.hotkey || '', onClick);

  const IconComponent = status.icon;
  const textColorClass = status.className.split(' ')[0];

  return (
    <Button
      className={cn(
        'group relative h-auto w-full justify-start gap-4 px-6 py-3 text-left transition-all duration-300',
        'focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none',
        isSelected
          ? 'border border-gray-600 bg-gray-700 text-white'
          : 'border border-gray-700/50 bg-gray-800/40 text-gray-300 hover:border-gray-600/70 hover:bg-gray-700/60 hover:text-white hover:shadow-lg hover:shadow-gray-700/20'
      )}
      onPress={onClick}
      role='button'
    >
      <div
        className={`rounded-full p-2 transition-all duration-300 ${
          isSelected ? 'bg-gray-600' : 'bg-gray-700/50 group-hover:bg-gray-600/60'
        }`}
      >
        <IconComponent className={`size-5 ${textColorClass}`} />
      </div>
      <div className='flex-1'>
        <div className={`font-semibold transition-all duration-300 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
          {status.label}
        </div>
        <div className={`mt-1 text-sm transition-all duration-300 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
          {status.descriptions.modal}
        </div>
      </div>
      {isSelected ? (
        <div className='ml-auto rounded-full bg-gray-600 px-3 py-1 text-xs font-medium text-white'>Added</div>
      ) : (
        <ShortcutKey shortcutName={status.shortcut as ShortcutName} />
      )}
    </Button>
  );
}

function RatingSection({
  currentRating,
  hoverRating,
  setCurrentRating,
  setHoverRating,
  getRatingLabel,
}: {
  currentRating: number | undefined;
  hoverRating: number | undefined;
  setCurrentRating: (rating: number | undefined) => void;
  setHoverRating: (rating: number | undefined) => void;
  getRatingLabel: (rating: number) => string;
}) {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Star className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Your Rating</h2>
        </div>
        {currentRating !== undefined && (
          <Button size='sm' className='button-secondary!' onPress={() => setCurrentRating(undefined)}>
            {getShortcut('clearRating')?.description}
            <ShortcutKey shortcutName='clearRating' className='kbd-sm!' />
          </Button>
        )}
      </div>
      <div className='flex flex-col items-center gap-4'>
        <div className='flex flex-wrap justify-center gap-1'>
          {[...Array(10)].map((_, i) => {
            const rateValue = i + 1;
            return (
              <Button
                key={rateValue}
                variant='ghost'
                size='sm'
                className='p-1 transition-transform hover:scale-110'
                onPress={() => setCurrentRating(currentRating === rateValue ? undefined : rateValue)}
                onMouseEnter={() => setHoverRating(rateValue)}
                onMouseLeave={() => setHoverRating(undefined)}
                isIconOnly
              >
                <Star
                  className={`size-5 transition-colors ${
                    (hoverRating !== undefined ? rateValue <= hoverRating : currentRating && rateValue <= currentRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              </Button>
            );
          })}
        </div>

        <div className='text-center'>
          {(currentRating !== undefined || hoverRating !== undefined) && (
            <div className='text-sm font-medium text-yellow-400'>
              {hoverRating ?? currentRating}/10 - {getRatingLabel(hoverRating ?? currentRating ?? 0)}
            </div>
          )}
          {currentRating === undefined && hoverRating === undefined && (
            <div className='text-sm text-gray-500'>Click stars to rate, or press a number key </div>
          )}
        </div>
      </div>
    </div>
  );
}
