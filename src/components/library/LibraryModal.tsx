import { useState } from 'react';
import { Button } from '@heroui/button';
import { ModalBody } from '@heroui/modal';
import Modal from '@/components/ui/Modal';
import { Library, Star } from 'lucide-react';
import { RATING_LABELS, LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { cn } from '@/utils';



interface LibraryModalProps {
  disclosure: Disclosure;
  media: Media | LibraryMedia;
}

const isMedia = (obj: Media | LibraryMedia): obj is Media => obj && ('vote_average' in obj || 'overview' in obj);

export default function LibraryModal({ disclosure, media }: LibraryModalProps) {
  const [hoverRating, setHoverRating] = useState<number | undefined>(undefined);

  const libraryItem = useLibraryStore((state) => state.getItem(media.media_type, media.id));
  const { addOrUpdateItem, removeItem } = useLibraryStore();

  const handleStatusChange = (status: LibraryMediaStatus) => {
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
    <Modal disclosure={disclosure}>
      <ModalBody className='space-y-8 p-8'>
        <StatusSection selectedStatus={libraryItem?.status || 'none'} setSelectedStatus={handleStatusChange} />
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
}: {
  selectedStatus: LibraryMediaStatus;
  setSelectedStatus: (status: LibraryMediaStatus) => void;
}) {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        {/* <h3 className='text-lg font-semibold text-white'>Status</h3> */}
        {/* Header */}
         <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Library className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>
            Library Status
          </h2>
        </div>
        {selectedStatus !== 'none' && (
          <div className='flex justify-end pt-2'>
            <Button
              variant='ghost'
              size='sm'
              className='rounded-full border border-red-500/20 px-4 py-2 text-xs text-red-400 backdrop-blur-sm transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300'
              onPress={() => setSelectedStatus('none')}
            >
              Remove from library
            </Button>
          </div>
        )}
      </div>
      <div className='grid grid-cols-1 gap-3'>
        {LIBRARY_MEDIA_STATUS.map((option) => {
          if (option.value === 'favorites') return null;

          const isSelected = selectedStatus === option.value;
          const IconComponent = option.icon;
          const textColorClass = option.className.split(' ')[0];

          return (
            <Button
              key={option.value}
              className={cn(
                'group relative h-auto w-full justify-start gap-4 px-6 py-3 text-left transition-all duration-300',
                isSelected
                  ? 'border border-gray-600 bg-gray-700 text-white'
                  : 'border border-gray-700/50 bg-gray-800/40 text-gray-300 hover:border-gray-600/70 hover:bg-gray-700/60 hover:text-white hover:shadow-lg hover:shadow-gray-700/20'
              )}
              onPress={() => setSelectedStatus(option.value)}
            >
              <div
                className={`rounded-full p-2 transition-all duration-300 ${
                  isSelected ? 'bg-gray-600' : 'bg-gray-700/50 group-hover:bg-gray-600/60'
                }`}
              >
                <IconComponent className={`size-5 ${textColorClass}`} />
              </div>
              <div className='flex-1'>
                <div
                  className={`font-semibold transition-all duration-300 ${isSelected ? 'text-white' : 'text-gray-200'}`}
                >
                  {option.label}
                </div>
                <div
                  className={`mt-1 text-sm transition-all duration-300 ${
                    isSelected ? 'text-gray-300' : 'text-gray-400'
                  }`}
                >
                  {option.descriptions.modal}
                </div>
              </div>
              {isSelected && (
                <div className='ml-auto rounded-full bg-gray-600 px-3 py-1 text-xs font-medium text-white'>Added</div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
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
        {/* <h3 className='text-lg font-semibold text-white'>Your Rating</h3> */}
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Star className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Your Rating</h2>
        </div>
        {currentRating !== undefined && (
          <Button
            variant='ghost'
            size='sm'
            className='mt-2 text-xs text-red-400 hover:bg-red-500/10'
            onPress={() => setCurrentRating(undefined)}
          >
            Clear Rating
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
            <div className='text-sm text-gray-500'>Click stars to rate</div>
          )}
        </div>
      </div>
    </div>
  );
}
