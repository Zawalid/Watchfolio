import { useState } from 'react';
import { Button } from '@heroui/button';
import { ModalHeader, ModalBody } from '@heroui/modal';
import Modal from '@/components/ui/Modal';
import { Star, Play, Clock, Trophy, X, Bookmark } from 'lucide-react';
import { RATING_LABELS } from '@/utils/constants';
import { useLibraryStore } from '@/stores/useLibraryStore';

const STATUS_OPTIONS = [
  {
    value: 'watching',
    label: 'Currently Watching',
    description: 'Track your progress',
    icon: <Play className='size-5 text-blue-400' />,
  },
  {
    value: 'will-watch',
    label: 'Plan to Watch',
    description: 'Add to your watchlist',
    icon: <Bookmark className='size-5 text-purple-400' />,
  },
  {
    value: 'watched',
    label: 'Completed',
    description: 'Mark as finished',
    icon: <Trophy className='size-5 text-green-400' />,
  },
  {
    value: 'on-hold',
    label: 'On Hold',
    description: 'Taking a break',
    icon: <Clock className='size-5 text-yellow-400' />,
  },
  {
    value: 'dropped',
    label: 'Dropped',
    description: 'Not for you',
    icon: <X className='size-5 text-red-400' />,
  },
] as const;

type UserMediaStatus = (typeof STATUS_OPTIONS)[number]['value'] | 'none';

interface Disclosure {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

interface LibraryModalProps {
  disclosure: Disclosure;
  media: Media;
}

export default function LibraryModal({ disclosure, media }: LibraryModalProps) {
  const [hoverRating, setHoverRating] = useState<number | undefined>(undefined);

  const libraryItem = useLibraryStore((state) => state.getItem(media.media_type, media.id));
  const { addOrUpdateItem, removeItem } = useLibraryStore();

  const handleStatusChange = (status: UserMediaStatus) => {
    if (status === 'none') removeItem(media.media_type, media.id);
    else addOrUpdateItem({ id: media.id, mediaType: media.media_type, status }, media);
  };

  const handleRatingChange = (rating: number | undefined) => addOrUpdateItem({ id: media.id, mediaType: media.media_type, userRating: rating }, media);
  const getRatingLabel = (rating: number) => RATING_LABELS[rating as keyof typeof RATING_LABELS] || 'Good';

  return (
    <Modal disclosure={disclosure}>
      <ModalHeader className='flex justify-center'>
        <h4 className='text-sm text-gray-400'>Manage your library</h4>
      </ModalHeader>

      <ModalBody className='space-y-8 px-8 py-6'>
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
  selectedStatus: UserMediaStatus;
  setSelectedStatus: (status: UserMediaStatus) => void;
}) {
  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-white'>Watching Status</h3>
        {selectedStatus !== 'none' && (
          <div className='flex justify-end pt-2'>
            <Button
              variant='ghost'
              size='sm'
              className='rounded-full border border-red-500/20 px-4 py-2 text-xs text-red-400 backdrop-blur-sm transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300'
              onPress={() => setSelectedStatus('none')}
            >
              Remove from Library
            </Button>
          </div>
        )}
      </div>
      <div className='grid grid-cols-1 gap-3'>
        {STATUS_OPTIONS.map((option) => {
          const isSelected = selectedStatus === option.value;

          return (
            <Button
              key={option.value}
              className={`group relative h-auto w-full justify-start overflow-hidden px-6 py-3 text-left transition-all duration-300 ${isSelected
                ? 'scale-[1.02] transform border border-blue-400/50 bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-purple-600/90 text-white shadow-2xl shadow-blue-500/25'
                : 'border border-gray-700/50 bg-gray-800/40 text-gray-300 hover:border-gray-600/70 hover:bg-gray-700/60 hover:text-white hover:shadow-lg hover:shadow-gray-700/20'
                }`}
              onPress={() => setSelectedStatus(option.value)}
            >
              {/* Animated background glow for selected state */}
              {isSelected && (
                <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20' />
              )}

              {/* Shimmer effect for selected state */}
              {isSelected && (
                <div
                  className='absolute inset-0 -skew-x-12 animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent'
                  style={{
                    animation: 'shimmer 2s ease-in-out infinite',
                    transform: 'translateX(-100%)',
                  }}
                />
              )}

              {/* Content */}
              <div className='relative z-10 flex items-center gap-4'>
                <div
                  className={`rounded-full p-2 transition-all duration-300 ${isSelected
                    ? 'bg-white/20 shadow-lg ring-2 ring-white/30 backdrop-blur-sm [&>svg]:text-white'
                    : 'bg-gray-700/50 group-hover:bg-gray-600/60'
                    }`}
                >
                  {option.icon}
                </div>
                <div>
                  <div
                    className={`font-semibold transition-all duration-300 ${isSelected ? 'text-white drop-shadow-sm' : 'text-gray-200'
                      }`}
                  >
                    {option.label}
                  </div>
                  <div
                    className={`mt-1 text-sm transition-all duration-300 ${isSelected ? 'text-blue-100/80' : 'text-gray-400'
                      }`}
                  >
                    {option.description}
                  </div>
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className='absolute top-1/2 right-4 -translate-y-1/2'>
                  <div className='h-3 w-3 animate-pulse rounded-full bg-white shadow-lg' />
                </div>
              )}

              {/* Hover glow effect for non-selected */}
              {!isSelected && (
                <div className='absolute inset-0 bg-gradient-to-r from-gray-600/10 via-gray-500/10 to-gray-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
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
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-white'>Your Rating</h3>
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
                  className={`size-5 transition-colors ${(hoverRating !== undefined ? rateValue <= hoverRating : currentRating && rateValue <= currentRating)
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
