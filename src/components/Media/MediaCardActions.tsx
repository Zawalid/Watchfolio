import { Button } from '@heroui/button';
import { Heart, Plus, Check } from 'lucide-react';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { getMediaType } from '@/utils/media';
import { useLibraryModal } from '@/context/useLibraryModal';

interface MediaCardActionsProps {
  media: Media;
}

export default function MediaCardActions({ media }: MediaCardActionsProps) {
  const mediaType = getMediaType(media);
  const { openModal } = useLibraryModal();

  const libraryItem = useLibraryStore((state) => state.getItem(mediaType, media.id));
  const { toggleFavorite } = useLibraryStore();

  const isFavorite = libraryItem?.isFavorite || false;
  const isInLibrary = libraryItem?.status !== undefined && libraryItem?.status !== 'none';

  return (
    <div className='absolute top-2 right-2 z-10 flex gap-2'>
      {/* Favorite Button */}
      <Button
        isIconOnly
        size='sm'
        className={`rounded-full border shadow-lg backdrop-blur-md transition-all hover:scale-110 ${
          isFavorite
            ? 'border-pink-400 bg-pink-500 text-white'
            : 'bg-blur border-white/20 text-white hover:bg-pink-500/80'
        }`}
        onPress={() => toggleFavorite(mediaType, media.id)}
      >
        <Heart className={`size-4 ${!isFavorite ? 'fill-current' : ''}`} />
      </Button>

      {/* Library Button */}
      <Button
        isIconOnly
        size='sm'
        className={`rounded-full border shadow-lg backdrop-blur-md transition-all hover:scale-110 ${
          isInLibrary
            ? 'border-Primary-400 bg-Primary-500 text-white'
            : 'hover:bg-Primary-500/80 bg-blur border-white/20 text-white'
        }`}
        // onPress={() => {
        //   if (isInLibrary) setItemStatus(mediaType, media.id, 'none');
        //   else setItemStatus(mediaType, media.id, 'will-watch');
        // }}
        onPress={() => openModal(media)}
      >
        {isInLibrary ? <Check className='size-4' /> : <Plus className='size-4' />}
      </Button>
    </div>
  );
}
