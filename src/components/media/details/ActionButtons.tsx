import { motion } from 'framer-motion';
import { Play, Heart, Film, LibraryBig } from 'lucide-react';
import { Button, useDisclosure } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useMediaStatusModal } from '@/hooks/useMediaStatusModal';
import { generateMediaId } from '@/utils/library';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

interface ActionButtonsProps {
  media: Media;
}

export default function ActionButtons({ media }: ActionButtonsProps) {
  const { openModal } = useMediaStatusModal();
  const trailerDisclosure = useDisclosure();

  const item = useLibraryStore((state) => state.getItem(generateMediaId(media)));
  const { toggleFavorite } = useLibraryStore();

  const inLibrary = item && item.status !== 'none';

  const isFavorite = item?.isFavorite || false;
  const status = LIBRARY_MEDIA_STATUS.find((s) => s.value === item?.status);
  const StatusIcon = status?.icon;

  const trailer = media.videos?.results?.find((video: Video) => video.site === 'YouTube' && video.type === 'Trailer');

  const handleToggleFavorite = () => {
    toggleFavorite(item?.id || '', media ? { ...media, media_type: media.media_type } : undefined);
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
          {status?.value === 'watching' ? 'Continue Watching' : 'Watch Now'}
        </Button>

        <Button
          className='button-secondary! w-full'
          onPress={trailerDisclosure.onOpen}
          startContent={<Film className='size-4' />}
          isDisabled={!trailer}
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
            onPress={() => openModal(item || media)}
            startContent={
              inLibrary && StatusIcon ? <StatusIcon className='size-4' /> : <LibraryBig className='size-4' />
            }
          >
            {inLibrary ? status?.label : 'Add to Library'}
          </Button>
        </div>
      </motion.div>

      {trailer && (
        <Modal
          disclosure={trailerDisclosure}
          className='max-w-[85vw]'
          classNames={{ closeButton: 'bg-white text-black hover:bg-white/90 hover:text-black/90' }}
        >
          <div className='relative aspect-video size-full overflow-hidden rounded-xl'>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={trailer.name}
              className='size-full'
              allowFullScreen
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            />
          </div>
        </Modal>
      )}
    </>
  );
}
