import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn, slugify } from '@/utils';
import { getCollection } from '@/lib/api/TMDB/movies';
import { queryKeys } from '@/lib/react-query';
import { Rating } from '@/components/ui/Rating';
import { getReleaseYear } from '@/utils/media';

interface CollectionCardProps {
  collection: { id: number; name: string; category: string };
  tabIndex?: number;
}

const getCategoryColor = (cat: string) => {
  const categoryColors: Record<string, string> = {
    'epic-saga': 'border-Primary-500/30 bg-Primary-500/20 text-Primary-300',
    superhero: 'border-Secondary-500/30 bg-Secondary-500/20 text-Secondary-300',
    action: 'border-Error-500/30 bg-Error-500/20 text-Error-300',
    classic: 'border-Warning-500/30 bg-Warning-500/20 text-Warning-300',
    fantasy: 'border-Success-500/30 bg-Success-500/20 text-Success-300',
    'sci-fi': 'border-Tertiary-500/30 bg-Tertiary-500/20 text-Tertiary-300',
    horror: 'border-Error-600/30 bg-Error-600/20 text-Error-300',
    adventure: 'border-Primary-400/30 bg-Primary-400/20 text-Primary-300',
  };
  return categoryColors[cat.toLowerCase()] || 'border-Grey-500/30 bg-Grey-500/20 text-Grey-300';
};

export default function CollectionCard({ collection, tabIndex = 0 }: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { data: details } = useQuery({
    queryKey: queryKeys.collection(collection.id),
    queryFn: () => getCollection(collection.id),
    staleTime: 1000 * 60 * 30,
  });

  const isInteractive = isHovered || isFocused;
  const formattedName = collection.name.replace(' Collection', '').trim();

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={tabIndex}
      role='article'
      aria-label={`${formattedName} Collection`}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] shadow-lg backdrop-blur-sm transition-all duration-500 ease-out',
        isInteractive && 'border-white/25 shadow-2xl shadow-black/40',
        isFocused &&
          'border-Tertiary-400/70 shadow-Tertiary-500/25 ring-Tertiary-400/50 shadow-2xl ring-2 ring-offset-2 ring-offset-gray-900'
      )}
    >
      <Link className='absolute inset-0 z-10' to={`/collections/${collection.id}-${slugify(formattedName)}`} />

      {/* Subtle glow effect for focus */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='from-Tertiary-500/15 via-Primary-400/10 to-Tertiary-500/15 absolute -inset-1 rounded-2xl bg-gradient-to-r blur-lg'
          />
        )}
      </AnimatePresence>

      {/* Category Badge */}
      <div className='absolute top-3 left-3 z-20'>
        <div
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-lg backdrop-blur-md ${getCategoryColor(collection.category)}`}
        >
          <Film className='size-3' />
          <span className='capitalize'>{collection.category}</span>
        </div>
      </div>

      {/* Movie Count Badge */}
      {details?.parts && (
        <div className='absolute top-3 right-3 z-20'>
          <div className='flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 shadow-lg backdrop-blur-md'>
            <Film className='size-3' />
            <span>{details.parts.length}</span>
            <span>Movies</span>
          </div>
        </div>
      )}

      {/* Poster content - Landscape aspect ratio */}
      <div className='relative block aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'>
        <motion.div
          animate={{
            scale: isInteractive ? 1.08 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='size-full'
        >
          <LazyImage
            src={
              details?.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${details.backdrop_path}`
                : details?.poster_path
                  ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                  : '/images/placeholder.png'
            }
            alt={formattedName}
            className='size-full object-cover'
          />
        </motion.div>

        {/* Enhanced gradients for better text visibility */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInteractive ? 0.3 : 0.4 }}
          transition={{ duration: 0.3 }}
          className='absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent'
        />

        {/* Content overlay */}
        <div className='absolute inset-x-0 bottom-0 space-y-2.5 p-4'>
          <motion.div
            animate={{
              y: isInteractive ? -4 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h3 className='line-clamp-2 text-xl font-bold text-white drop-shadow-lg transition-colors duration-300'>
              {formattedName}
            </h3>
          </motion.div>

          <motion.div
            animate={{
              y: isInteractive ? -2 : 0,
              opacity: isInteractive ? 1 : 0.9,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='text-Grey-200'
          >
            {/* Overview snippet */}
            {details?.overview && (
              <p className='line-clamp-2 text-sm text-white/80'>{details.overview.slice(0, 120)}...</p>
            )}
          </motion.div>

          {/* Additional details on hover */}
          <AnimatePresence>
            {isInteractive && details && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3 }}
                className='flex items-center gap-4 text-sm text-white/70'
              >
                {/* Average rating */}
                {details.parts && details.parts.length > 0 && (
                  <Rating
                    rating={Math.max(...details.parts.map((p) => p.vote_average || 0))}
                    className='*:text-xs [&_svg]:size-3!'
                  />
                )}

                {/* Date range */}
                {details.parts && details.parts.length > 1 && (
                  <div className='border-Primary-400/30 bg-Primary-500/20 text-Primary-300 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md'>
                    <Calendar className='size-4' />
                    <span className='font-medium'>
                      {getReleaseYear(details.parts[0]) || 'Unknown'} -{' '}
                      {getReleaseYear(details.parts[details.parts.length - 1]) || 'Unknown Date'}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
