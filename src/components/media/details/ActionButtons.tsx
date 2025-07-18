import { motion } from 'framer-motion';
import { Play, Heart, Film, LibraryBig, Check } from 'lucide-react';
import { Button } from '@heroui/react';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useMediaStatusModal } from '@/hooks/useMediaStatusModal';

interface ActionButtonsProps {
  media: Media;
  onPlayTrailer: () => void;
}

export default function ActionButtons({ media, onPlayTrailer }: ActionButtonsProps) {
  const { openModal } = useMediaStatusModal();

  const libraryItem = useLibraryStore((state) => state.getItem(media.media_type, media.id));
  const { toggleFavorite } = useLibraryStore();

  const inLibrary = !!libraryItem;

  console.log(media.media_type, media.id, libraryItem);

  const isFavorite = libraryItem?.isFavorite || false;
  const currentStatus = libraryItem?.status || 'none';

  const handleToggleFavorite = () => {
    toggleFavorite({ media_type: media.media_type, id: media.id }, media);
  };

  return (
    <>
      <motion.div
        className='flex w-full flex-col gap-2.5'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          color='primary'
          className='w-full transition-all duration-200 hover:scale-[1.03]'
          startContent={<Play className='size-4' />}
          isDisabled
        >
          {currentStatus === 'watching' ? 'Continue Watching' : 'Watch Now'}
        </Button>

        <Button
          color='secondary'
          className='button-secondary! w-full'
          onPress={onPlayTrailer}
          startContent={<Film className='size-4' />}
          isDisabled
        >
          Watch Trailer
        </Button>

        <div className='grid grid-cols-2 gap-2'>
          <Button
            color='secondary'
            className={`button-secondary! transition-colors ${
              isFavorite ? 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20' : ''
            }`}
            onPress={handleToggleFavorite}
            startContent={<Heart className={`size-4 ${isFavorite ? 'fill-current text-pink-500' : ''}`} />}
          >
            Favorite
          </Button>

          <Button
            color='secondary'
            className={`button-secondary! transition-colors ${
              inLibrary ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : ''
            }`}
            onPress={() => openModal(media)}
            startContent={inLibrary ? <Check className='size-4' /> : <LibraryBig className='size-4' />}
          >
            {inLibrary ? 'In Library' : 'Add to Library'}
          </Button>
        </div>
      </motion.div>
    </>
  );
}
