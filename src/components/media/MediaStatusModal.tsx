import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Library, Star } from 'lucide-react';
import { Button, ModalBody } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { RATING_LABELS, LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { cn } from '@/utils';
import { useListNavigator } from '@/hooks/useListNavigator';
import { ShortcutKey } from '@/components/ui/ShortcutKey';
import { getShortcut, type ShortcutName } from '@/utils/keyboardShortcuts';
import { useNavigation } from '@/contexts/NavigationContext';
import { isMedia } from '@/utils/media';
import { generateMediaId } from '@/utils/library';
import { useLibraryItem } from '@/hooks/library/useLibraryQueries';
import { useAddOrUpdateLibraryItem } from '@/hooks/library/useLibraryMutations';

interface MediaStatusModalProps {
  disclosure: Disclosure;
  media: Media | LibraryMedia;
}

export default function MediaStatusModal({ disclosure, media }: MediaStatusModalProps) {
  const [hoverRating, setHoverRating] = useState<number | undefined>(undefined);
  const { registerNavigation, unregisterNavigation } = useNavigation();

  useEffect(() => {
    if (disclosure.isOpen) registerNavigation('media-status-modal');
    else unregisterNavigation('media-status-modal');
    return () => unregisterNavigation('media-status-modal');
  }, [disclosure.isOpen, registerNavigation, unregisterNavigation]);

  const id = generateMediaId(media);
  const { data: libraryItem } = useLibraryItem(id);
  const { mutate: addOrUpdateItem } = useAddOrUpdateLibraryItem();

  const handleStatusOrRatingChange = (status?: WatchStatus, userRating?: number | undefined) => {
    addOrUpdateItem({
      item: {
        id: libraryItem?.id || id,
        ...(status && { status }),
        ...(userRating && { userRating }),
      },
      media: isMedia(media) ? media : undefined,
    });
  };

  const getRatingLabel = (rating: number) => RATING_LABELS[rating as keyof typeof RATING_LABELS] || 'Good';

  return (
    <Modal disclosure={disclosure} size='lg' classNames={{ base: 'full-mobile-modal' }}>
      <ModalBody className='space-y-8 p-8'>
        <StatusSection
          selectedStatus={libraryItem?.status || 'none'}
          setSelectedStatus={handleStatusOrRatingChange}
          onClose={disclosure.onClose}
        />
        <RatingSection
          currentRating={libraryItem?.userRating}
          hoverRating={hoverRating}
          setCurrentRating={(rating) => handleStatusOrRatingChange(undefined, rating)}
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
}: {
  selectedStatus: WatchStatus;
  setSelectedStatus: (status: WatchStatus) => void;
  onClose: () => void;
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
  useHotkeys(getShortcut('clearStatus')?.hotkey || '', removeItem);

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Library className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Viewing Status</h2>
        </div>
        {selectedStatus !== 'none' && (
          <Button size='sm' className='button-secondary!' onPress={removeItem}>
            {getShortcut('clearStatus')?.description}
            <ShortcutKey shortcutName='clearStatus' className='kbd-sm!' />
          </Button>
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
  return (
    <Button
      className={cn(
        'group relative h-auto w-full justify-start gap-4 px-6 py-3 text-left transition-all',
        isSelected
          ? 'border border-gray-600 bg-gray-700 text-white'
          : 'border border-gray-700/50 bg-gray-800/40 text-gray-300 hover:border-gray-600/70 hover:bg-gray-700/60 hover:text-white'
      )}
      onPress={onClick}
      role='button'
    >
      <div className={`rounded-full p-2 ${isSelected ? 'bg-gray-600' : 'bg-gray-700/50 group-hover:bg-gray-600/60'}`}>
        <IconComponent className={`size-5 ${status.className.split(' ')[0]}`} />
      </div>
      <div className='flex-1'>
        <div className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-200'}`}>{status.label}</div>
        <div className={`mt-1 text-sm ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
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
  useHotkeys(
    getShortcut('rateMedia')?.hotkey || '',
    (e) => {
      const rating = parseInt(e.key);
      if (!isNaN(rating) && rating > 0) setCurrentRating(rating);
    },
    [setCurrentRating]
  );
  useHotkeys(getShortcut('rateMedia10')?.hotkey || '', () => setCurrentRating(10));
  useHotkeys(getShortcut('clearRating')?.hotkey || '', () => setCurrentRating(undefined));

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Star className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Your Rating</h2>
        </div>
        {currentRating && (
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
                key={`rate-${rateValue}`}
                variant='ghost'
                size='sm'
                className='p-1 transition-transform hover:scale-110'
                onPress={() => setCurrentRating(currentRating === rateValue ? undefined : rateValue)}
                onMouseEnter={() => setHoverRating(rateValue)}
                onMouseLeave={() => setHoverRating(undefined)}
                isIconOnly
              >
                <Star
                  className={`size-5 transition-colors ${(hoverRating !== undefined ? rateValue <= hoverRating : currentRating && rateValue <= currentRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                />
              </Button>
            );
          })}
        </div>
        <div className='text-center'>
          {(hoverRating ?? currentRating) != null ? (
            <div className='text-sm font-medium text-yellow-400'>
              {hoverRating ?? currentRating}/10 - {getRatingLabel(hoverRating ?? currentRating ?? 0)}
            </div>
          ) : (
            <div className='text-sm text-gray-500'>Click stars to rate, or press a number key </div>
          )}
        </div>
      </div>
    </div>
  );
}
