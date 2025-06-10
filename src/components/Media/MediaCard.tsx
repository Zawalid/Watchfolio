import { Link } from 'react-router';
import { getMediaType, getRating, getReleaseYear } from '@/utils/media';
import { slugify, cn } from '@/utils';
import { GENRES } from '@/lib/api/TMDB/values';
import { LazyImage } from '@/components/ui/LazyImage';
import MediaCardActions from './MediaCardActions';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Film, Star, Tv } from 'lucide-react';

const getLink = (type: string, id: number, title: string) => {
  return `/${type === 'tv' ? 'tv' : 'movies'}/details/${id}-${slugify(title)}`;
};

const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function MediaCard({ media }: { media: Media }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { id, poster_path, vote_average, genre_ids } = media;
  const type = getMediaType(media);
  const title = (type === 'movie' ? (media as Movie).title : (media as TvShow).name) || 'Untitled';
  const releaseYear = getReleaseYear(media);
  const rating = getRating(vote_average || 0);

  // Get top 2 genres for display
  const displayGenres =
    genre_ids
      ?.slice(0, 2)
      .map((id) => GENRES[id])
      .filter(Boolean) || [];

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <motion.div
      variants={cardVariants}
      initial='initial'
      animate='animate'
      whileHover='hover'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.08] shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20'
    >
      <MediaCardActions media={media} />

      <Link
        to={getLink(type, id, title)}
        className='relative block aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'
      >
        <LazyImage
          src={poster_path ? `http://image.tmdb.org/t/p/w500${poster_path}` : '/images/placeholder.png'}
          alt={title}
          className={cn(
            'size-full object-cover transition-all duration-500 ease-out',
            isHovered ? 'scale-110' : 'scale-100',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />

        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />

        <div className='absolute top-3 left-3 flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm'>
          {type === 'movie' ? <Film className='size-3' /> : <Tv className='size-3' />}
          <span className='capitalize'>{type}</span>
        </div>

        <div className='absolute inset-x-0 bottom-0 space-y-2 p-4'>
          <h3 className='line-clamp-2 text-lg leading-tight font-semibold text-white drop-shadow-lg'>{title}</h3>

          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2 text-white/80'>
              {rating && (
                <>
                  <div className='flex items-center gap-1'>
                    <Star className='size-4 fill-yellow-400 text-yellow-400' />
                    <span>{rating}</span>
                  </div>
                </>
              )}

              {releaseYear && (
                <>
                  <span className='text-white/40'>•</span>
                  <div className='flex items-center gap-1'>
                    <Calendar className='size-3' />
                    <span>{releaseYear}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isHovered && displayGenres.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className='flex flex-wrap gap-1.5'
              >
                {displayGenres.map((genre, index) => (
                  <motion.span
                    key={genre}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className='rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm'
                  >
                    {genre}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className='pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent'
            style={{ transform: 'skewX(-20deg)' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
