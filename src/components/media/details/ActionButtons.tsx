import { motion } from 'framer-motion';
import { Play, Heart, Film, LibraryBig } from 'lucide-react';
import { Button, useDisclosure } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useMediaStatusModal } from '@/hooks/useMediaStatusModal';
import { generateMediaId } from '@/utils/library';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { cn } from '@/utils';

interface ActionButtonsProps {
  media: Media;
}

export default function ActionButtons({ media }: ActionButtonsProps) {
  const trailerDisclosure = useDisclosure();
  const trailer = media.videos?.results?.find((video: Video) => video.site === 'YouTube' && video.type === 'Trailer');

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
          Watch Now
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
          <AddToLibraryButtons
            media={media}
            classNames={{
              addToLibrary: (is) =>
                `button-secondary! ${is ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : ''}`,
              favorite: (is) => `button-secondary! ${is ? 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20' : ''}`,
            }}
          />
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

export function AddToLibraryButtons({
  media,
  classNames,
}: {
  media: Media;
  classNames: { addToLibrary: (is: boolean) => string; favorite: (is: boolean) => string };
}) {
  const { openModal } = useMediaStatusModal();
  const { toggleFavorite } = useLibraryStore();
  const item = useLibraryStore((state) => state.getItem(generateMediaId(media)));
  const status = LIBRARY_MEDIA_STATUS.find((s) => s.value === item?.status);

  const inLibrary = (item && item.status !== 'none') || false;
  const isFavorite = item?.isFavorite || false;
  const StatusIcon = status?.icon;

  return (
    <>
      <Button
        onPress={() => openModal(item || media)}
        className={classNames.addToLibrary(inLibrary)}
        startContent={inLibrary && StatusIcon ? <StatusIcon className='h-5 w-5' /> : <LibraryBig className='h-5 w-5' />}
      >
        {inLibrary ? status?.label : 'Add to Library'}
      </Button>

      <Button
        onPress={() => {
          toggleFavorite(item?.id || '', media ? { ...media, media_type: media.media_type } : undefined);
        }}
        className={classNames.favorite(isFavorite)}
        startContent={<Heart className={cn('h-5 w-5', isFavorite && 'fill-current text-pink-500')} />}
      >
        {isFavorite ? 'Favorited' : 'Favorite'}
      </Button>
    </>
  );
}
