import { motion } from 'framer-motion';
import { Heart, Info, TrendingUp, Sparkles, LibraryBig, Check, Film, Tv } from 'lucide-react';
import { Button } from '@heroui/button';
import { Link } from 'react-router';
import { getMediaType, generateMediaLink, getRating, getReleaseYear } from '@/utils/media';
import { useMediaStatusModal } from '@/hooks/useMediaStatusModal';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { cn } from '@/utils';
import { Rating } from '@/components/details/Info';
import { useQuery } from '@tanstack/react-query';
import { getImages } from '@/lib/api/TMDB';

interface HeroItemProps {
  item: Media;
  isActive?: boolean;
}

export default function HeroItem({ item, isActive = false }: HeroItemProps) {
  const { data: images } = useQuery({
    queryKey: ['logo', item.id],
    queryFn: async () => await getImages(item.id, item.media_type),
  });
  const { openModal } = useMediaStatusModal();
  const libraryItem = useLibraryStore((state) => state.getItem(getMediaType(item), item.id));
  const { toggleFavorite } = useLibraryStore();

  const mediaType = getMediaType(item);
  const title = mediaType === 'movie' ? (item as Movie).title : (item as TvShow).name;
  const fullDate = getReleaseYear(item, 'full');
  const rating = getRating(item.vote_average);

  const isInLibrary = libraryItem && libraryItem.status !== 'none';
  const isFavorite = libraryItem?.isFavorite || false;

  const handleAddToLibrary = () => {
    openModal(item);
  };

  const handleToggleFavorite = () => {
    toggleFavorite({ media_type: mediaType, id: item.id }, item);
  };

  const logoPath = images?.logos
    ?.sort((a, b) => b.width - a.width)
    ?.filter((logo) => logo.iso_639_1 === 'en')?.[0]?.file_path;

  return (
    <motion.div
      className={cn('absolute inset-0 h-screen min-h-[600px] w-full overflow-hidden', isActive ? 'z-10' : 'z-0')}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Background Image */}
      <div className='absolute inset-0'>
        <img
          src={
            item.backdrop_path
              ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${item.backdrop_path}`
              : '/images/placeholder.png'
          }
          alt={title}
          className='h-full w-full object-cover object-center'
        />

        <div className='absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent' />
        <div className='to-Grey-900/80 absolute inset-0 bg-gradient-to-b from-transparent via-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10 flex h-full items-center px-6 lg:px-12'>
        <div className='max-w-3xl space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='flex items-center gap-3'
          >
            <div className='border-Primary-500/30 bg-Primary-500/10 text-Primary-300 flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur-sm'>
              <Sparkles className='h-4 w-4 fill-current' />
              <span>Featured</span>
            </div>
            <div className='border-Secondary-500/30 bg-Secondary-500/10 text-Secondary-300 flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur-sm'>
              <TrendingUp className='h-4 w-4' />
              <span>Trending</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='text-5xl font-black text-white drop-shadow-lg md:text-6xl lg:text-7xl'
          >
            {logoPath ? (
              <img src={`https://image.tmdb.org/t/p/original${logoPath}`} alt={title} className='h-28 w-auto' />
            ) : (
              title
            )}
          </motion.h1>

          {/* Meta information with glassy pill design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='flex items-center gap-3'
          >
            {fullDate && (
              <div className='flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm'>
                <span>{fullDate}</span>
              </div>
            )}

            {rating && <Rating rating={+rating} />}

            <div className='flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm'>
              {mediaType === 'movie' ? <Film className='h-4 w-4' /> : <Tv className='h-4 w-4' />}
              <span className='capitalize'>{mediaType}</span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='line-clamp-3 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-sm'
          >
            {item.overview}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className='flex items-center gap-4'
          >
            <Button
              onPress={handleAddToLibrary}
              className={cn(
                'button-primary! px-8 shadow-lg',
                isInLibrary &&
                  'from-Success-600 to-Success-700 hover:from-Success-700 hover:to-Success-800 shadow-Success-600/20'
              )}
              startContent={isInLibrary ? <Check className='h-5 w-5' /> : <LibraryBig className='h-5 w-5' />}
            >
              {isInLibrary ? 'In Library' : 'Add to Library'}
            </Button>

            <Button
              onPress={handleToggleFavorite}
              className={cn(
                'button-secondary! px-8 shadow-lg',
                'hover:border-white/50 hover:bg-white/20',
                isFavorite &&
                  'bg-Error-500/20 border-Error-500/50 text-Error-300 hover:bg-Error-500/30 hover:border-Error-500/70'
              )}
              startContent={<Heart className={cn('h-5 w-5', isFavorite && 'text-Error-400 fill-current')} />}
            >
              {isFavorite ? 'Favorited' : 'Favorite'}
            </Button>

            <Button
              as={Link}
              to={generateMediaLink(mediaType, item.id, title)}
              size='lg'
              variant='light'
              className='px-6 py-6 text-base font-semibold text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white'
              startContent={<Info className='h-5 w-5' />}
            >
              More Info
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
