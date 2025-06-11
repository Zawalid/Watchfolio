'use client';

import { Button } from '@heroui/button';
import { Heart, Plus } from 'lucide-react';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { getMediaType } from '@/utils/media';
import { useLibraryModal } from '@/context/useLibraryModal';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/utils';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

interface MediaCardActionsProps {
  media: Media;
}

export default function MediaCardActions({ media }: MediaCardActionsProps) {
  const [favoriteClicked, setFavoriteClicked] = useState(false);

  const mediaType = getMediaType(media);
  const { openModal } = useLibraryModal();

  const libraryItem = useLibraryStore((state) => state.getItem(mediaType, media.id));
  const { toggleFavorite } = useLibraryStore();

  const isFavorite = libraryItem?.isFavorite || false;
  const itemStatus = libraryItem?.status;
  const isInLibrary = itemStatus && itemStatus !== 'none';

  const currentStatus = LIBRARY_MEDIA_STATUS.find((s) => s.value === itemStatus) || null;

  const handleToggleFavorite = () => {
    setFavoriteClicked(true);
    setTimeout(() => setFavoriteClicked(false), 300);
    toggleFavorite({ mediaType, id: media.id }, media);
  };

  const handleLibraryAction = () => {
    openModal({ ...media, media_type: mediaType });
  };

  return (
    <div className='absolute top-3 right-3 z-20 flex gap-2'>
      <Button
        isIconOnly
        size='sm'
        className={cn(
          'h-8 w-8 border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110',
          isFavorite
            ? 'border-red-400/50 bg-red-500/30 text-red-300 hover:bg-red-500/40'
            : 'border-white/30 bg-white/20 text-white hover:border-red-400/50 hover:bg-red-500/30 hover:text-red-300'
        )}
        onPress={handleToggleFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <motion.div animate={{ scale: favoriteClicked ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
          <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
        </motion.div>
      </Button>

      <Button
        isIconOnly
        size='sm'
        className={cn(
          'h-8 w-8 border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110',
          isInLibrary && currentStatus
            ? currentStatus.className + ' hover:opacity-80'
            : 'border-white/30 bg-white/20 text-white hover:border-blue-400/50 hover:bg-blue-500/30 hover:text-blue-300'
        )}
        onPress={handleLibraryAction}
        aria-label={isInLibrary ? 'Edit library status' : 'Add to library'}
      >
        {isInLibrary && currentStatus ? <currentStatus.icon className='size-4' /> : <Plus className='size-4' />}
      </Button>
    </div>
  );
}
