import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@heroui/button';
import { Star, Heart, Calendar, Film, Tv, MoreHorizontal, Trash2, Edit3, GripVertical } from 'lucide-react';
import { USER_MEDIA_STATUS } from '@/utils/constants';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useLibraryModal } from '@/context/useLibraryModal';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn, slugify } from '@/utils';



interface LibraryCardProps {
  item: UserMediaData;
  viewMode: 'grid' | 'list';
  tabIndex?: number;
}

const getLink = (type: string, id: number, title: string) => {
  return `/${type === 'tv' ? 'tv' : 'movies'}/details/${id}-${slugify(title)}`;
};

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const listCardVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  hover: {
    x: 4,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function LibraryCard({ item, viewMode, tabIndex = 0 }: LibraryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { toggleFavorite, removeItem } = useLibraryStore();
  const { openModal } = useLibraryModal();

  const title = item.title || 'Untitled';
  const status = USER_MEDIA_STATUS.find((s) => s.value === item.status);
  const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
  const rating = item.userRating;

  const handleToggleFavorite = () => {
    toggleFavorite({ mediaType: item.mediaType, id: item.id });
  };

  const handleRemove = () => {
    removeItem(item.mediaType, item.id);
  };
  const handleEditStatus = () => {
    // Create a mock Media object for the modal
    const mockMedia: Media = {
      id: item.id,
      media_type: item.mediaType,
      title: item.title ?? 'Untitled',
      poster_path: item.posterPath ?? null,
      backdrop_path: null,
      overview: '',
      original_language: 'en',
      adult: false,
      popularity: 0,
      vote_average: 0,
      vote_count: 0,
      // Movie-specific fields
      original_title: item.title ?? 'Untitled',
      release_date: item.releaseDate ?? null,
      genre_ids: [],
      // TV-specific fields
      name: item.title ?? 'Untitled',
      original_name: item.title ?? 'Untitled',
      first_air_date: item.releaseDate ?? null,
      origin_country: [],
    } as Media;
    openModal(mockMedia);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        window.location.href = getLink(item.mediaType, item.id, title);
        break;
      case 'f':
      case 'F': {
        e.preventDefault();
        toggleFavorite({ mediaType: item.mediaType, id: item.id });
        break;
      }
      case 'e':
      case 'E': {
        e.preventDefault();
        const mockMedia: Media = {
          id: item.id,
          media_type: item.mediaType,
          title: item.title ?? 'Untitled',
          poster_path: item.posterPath ?? null,
          backdrop_path: null,
          overview: '',
          original_language: 'en',
          adult: false,
          popularity: 0,
          vote_average: 0,
          vote_count: 0,
          // Movie-specific fields
          original_title: item.title ?? 'Untitled',
          release_date: item.releaseDate ?? null,
          genre_ids: [],
          // TV-specific fields
          name: item.title ?? 'Untitled',
          original_name: item.title ?? 'Untitled',
          first_air_date: item.releaseDate ?? null,
          origin_country: [],
        } as Media;
        openModal(mockMedia);
        break;
      }
      case 'Delete':
      case 'Backspace': {
        e.preventDefault();
        removeItem(item.mediaType, item.id);
        break;
      }
      case 'Escape':
        setShowActions(false);
        (e.target as HTMLElement).blur?.();
        break;
    }
  };
  if (viewMode === 'list') {
    return (
      <motion.div
        variants={listCardVariants}
        initial='initial'
        animate='animate'
        whileHover='hover'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={handleKeyDown}
        tabIndex={tabIndex}
        role='article'
        aria-label={`${title} - ${item.mediaType}`}
        className='group focus:ring-Primary-500/50 focus:border-Primary-500/50 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-white/[0.08] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-lg focus:ring-2 focus:outline-none'
      >
        {' '}
        <div className='flex items-center gap-3 p-3 sm:gap-4 sm:p-4'>
          {/* Drag Handle */}
          <div className='hidden cursor-grab opacity-0 transition-opacity duration-200 group-hover:opacity-100 active:cursor-grabbing sm:block'>
            <GripVertical className='text-Grey-400 size-4' />
          </div>

          {/* Poster */}
          <Link
            to={getLink(item.mediaType, item.id, title)}
            className='relative block h-16 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 sm:h-20 sm:w-14'
          >
            <LazyImage
              src={item.posterPath ? `http://image.tmdb.org/t/p/w300${item.posterPath}` : '/images/placeholder.png'}
              alt={title}
              className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className='absolute inset-0 animate-pulse bg-gradient-to-br from-gray-700 to-gray-800' />
            )}
          </Link>

          {/* Content */}
          <div className='min-w-0 flex-1'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0 flex-1'>
                <Link to={getLink(item.mediaType, item.id, title)} className='group/title block'>
                  <h3 className='text-Primary-50 group-hover/title:text-Primary-200 line-clamp-1 text-lg font-semibold transition-colors'>
                    {title}
                  </h3>
                </Link>

                <div className='text-Grey-400 mt-1 flex items-center gap-3 text-sm'>
                  <div className='flex items-center gap-1'>
                    {item.mediaType === 'movie' ? <Film className='size-3' /> : <Tv className='size-3' />}
                    <span className='capitalize'>{item.mediaType}</span>
                  </div>

                  {releaseYear && (
                    <>
                      <span>•</span>
                      <div className='flex items-center gap-1'>
                        <Calendar className='size-3' />
                        <span>{releaseYear}</span>
                      </div>
                    </>
                  )}

                  {item.genres && item.genres.length > 0 && (
                    <>
                      <span>•</span>
                      <span className='line-clamp-1'>{item.genres.slice(0, 2).join(', ')}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status & Rating */}
              <div className='flex flex-shrink-0 items-center gap-3'>
                {status && (
                  <div
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                      status.className,
                      'border'
                    )}
                  >
                    <status.icon className='size-3' />
                    <span>{status.label}</span>
                  </div>
                )}

                {rating && (
                  <div className='flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400'>
                    <Star className='size-3 fill-current' />
                    <span>{rating}/10</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            <Button
              isIconOnly
              size='sm'
              variant='ghost'
              className={cn(
                'h-8 w-8 transition-all duration-200 hover:scale-110',
                item.isFavorite ? 'text-red-400 hover:text-red-300' : 'text-Grey-400 hover:text-red-400'
              )}
              onPress={handleToggleFavorite}
              aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={cn('size-4', item.isFavorite && 'fill-current')} />
            </Button>

            <Button
              isIconOnly
              size='sm'
              variant='ghost'
              className='text-Grey-400 hover:text-Primary-400 h-8 w-8 transition-all duration-200 hover:scale-110'
              onPress={handleEditStatus}
              aria-label='Edit status'
            >
              <Edit3 className='size-4' />
            </Button>

            <Button
              isIconOnly
              size='sm'
              variant='ghost'
              className='text-Grey-400 h-8 w-8 transition-all duration-200 hover:scale-110 hover:text-red-400'
              onPress={handleRemove}
              aria-label='Remove from library'
            >
              <Trash2 className='size-4' />
            </Button>
          </div>
        </div>
        {/* Hover glow effect */}
        <div className='from-Primary-500/20 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-20' />
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      variants={cardVariants}
      initial='initial'
      animate='animate'
      whileHover='hover'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role='article'
      aria-label={`${title} - ${item.mediaType}`}
      className='group focus:ring-Primary-500/50 focus:border-Primary-500/50 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.08] shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20 focus:ring-2 focus:outline-none'
    >
      {/* Quick Actions */}
      <div className='absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100'>
        <Button
          isIconOnly
          size='sm'
          className={cn(
            'h-8 w-8 border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110',
            item.isFavorite
              ? 'border-red-400/50 bg-red-500/30 text-red-300 hover:bg-red-500/40'
              : 'border-white/30 bg-white/20 text-white hover:border-red-400/50 hover:bg-red-500/30 hover:text-red-300'
          )}
          onPress={handleToggleFavorite}
          aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('size-4', item.isFavorite && 'fill-current')} />
        </Button>

        <Button
          isIconOnly
          size='sm'
          className='h-8 w-8 border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-blue-400/50 hover:bg-blue-500/30 hover:text-blue-300'
          onPress={() => setShowActions(!showActions)}
          aria-label='More actions'
        >
          <MoreHorizontal className='size-4' />
        </Button>
      </div>

      {/* Actions Menu */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute top-14 right-3 z-30 min-w-[160px] rounded-lg border border-white/20 bg-black/80 shadow-xl backdrop-blur-md'
          >
            <div className='space-y-1 p-2'>
              <Button
                size='sm'
                variant='ghost'
                className='w-full justify-start text-white hover:bg-white/10'
                startContent={<Edit3 className='size-4' />}
                onPress={handleEditStatus}
              >
                Edit Status
              </Button>
              <Button
                size='sm'
                variant='ghost'
                className='w-full justify-start text-red-400 hover:bg-red-500/10'
                startContent={<Trash2 className='size-4' />}
                onPress={handleRemove}
              >
                Remove
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poster Link */}
      <Link
        to={getLink(item.mediaType, item.id, title)}
        className='relative block aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'
      >
        <LazyImage
          src={item.posterPath ? `http://image.tmdb.org/t/p/w500${item.posterPath}` : '/images/placeholder.png'}
          alt={title}
          className={cn(
            'size-full object-cover transition-all duration-500 ease-out',
            isHovered ? 'scale-110' : 'scale-100',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Loading skeleton */}
        {!imageLoaded && <div className='absolute inset-0 animate-pulse bg-gradient-to-br from-gray-700 to-gray-800' />}

        {/* Gradients */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Media type badge */}
        <div className='absolute top-3 left-3 flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm'>
          {item.mediaType === 'movie' ? <Film className='size-3' /> : <Tv className='size-3' />}
          <span className='capitalize'>{item.mediaType}</span>
        </div>

        {/* Status badge */}
        {status && (
          <div
            className={cn(
              'absolute top-3 left-3 mt-8 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm',
              status.className
            )}
          >
            <status.icon className='size-3' />
            <span>{status.label}</span>
          </div>
        )}

        {/* Content overlay */}
        <div className='absolute inset-x-0 bottom-0 space-y-3 p-4'>
          <h3 className='line-clamp-2 text-lg leading-tight font-semibold text-white drop-shadow-lg'>{title}</h3>

          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2 text-white/80'>
              {rating && (
                <div className='flex items-center gap-1'>
                  <Star className='size-4 fill-yellow-400 text-yellow-400' />
                  <span>{rating}/10</span>
                </div>
              )}

              {releaseYear && (
                <>
                  {rating && <span className='text-white/40'>•</span>}
                  <div className='flex items-center gap-1'>
                    <Calendar className='size-3' />
                    <span>{releaseYear}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Genres */}
          <AnimatePresence>
            {isHovered && item.genres && item.genres.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className='flex flex-wrap gap-1.5'
              >
                {item.genres.slice(0, 3).map((genre: string, index: number) => (
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

      {/* Shimmer effect on hover */}
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
