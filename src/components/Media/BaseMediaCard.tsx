import { useState } from 'react';
import { Link } from 'react-router';
import { Star, Calendar, Film, Tv, Heart, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn } from '@/utils';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { getShortcut } from '@/utils/keyboardShortcuts';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useMediaStatusModal } from '@/hooks/useMediaStatusModal';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { generateMediaLink } from '@/utils/media';

interface BaseMediaCardProps {
  id: number;
  title: string;
  mediaType: 'movie' | 'tv';
  posterPath?: string | null;
  releaseYear?: number | null;
  rating?: number;
  genres?: string[];
  item?: LibraryMedia;
  media?: Media;
  tabIndex?: number;
}

// TODO : Better design for user-rating / rating

export default function BaseMediaCard({
  id,
  title,
  mediaType,
  posterPath,
  releaseYear,
  rating,
  genres = [],
  item,
  media,
  tabIndex = 0,
}: BaseMediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { toggleFavorite, removeItem } = useLibraryStore();
  const { openModal } = useMediaStatusModal();
  const { confirm } = useConfirmationModal();

  const handleToggleFavorite = () => toggleFavorite({ media_type: mediaType, id: id });
  const handleEditStatus = () => {
    const target = item || media;
    if (!target) return;
    openModal(target);
  };

  const handleRemove = async () => {
    if (item) {
      const confirmed = await confirm({
        title: 'Remove from Library',
        message: `Are you sure you want to remove "${item.title || 'this item'}" from your library?`,
        confirmText: 'Remove',
        cancelText: 'Cancel',
        confirmVariant: 'danger',
        confirmationKey: 'remove_media',
      });

      if (confirmed) {
        removeItem(item.media_type, item.id);
      }
    }
  };

  // Hotkeys
  useHotkeys(getShortcut('toggleFavorite').hotkey, handleToggleFavorite, { enabled: isFocused });
  useHotkeys(getShortcut('editStatus').hotkey, handleEditStatus, { enabled: isFocused });
  useHotkeys(getShortcut('removeFromLibrary').hotkey, handleRemove, { enabled: isFocused });

  const isInteractive = isHovered || isFocused;
  const status = LIBRARY_MEDIA_STATUS.find((s) => s.value === item?.status);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={tabIndex}
      role='article'
      aria-label={`${title} - ${mediaType}`}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] shadow-lg backdrop-blur-sm transition-all duration-500 ease-out hover:border-white/25 hover:shadow-2xl hover:shadow-black/40 focus:outline-none',
        isFocused &&
          'border-blue-400/70 shadow-2xl ring-2 shadow-blue-500/25 ring-blue-400/50 ring-offset-2 ring-offset-gray-900'
      )}
      whileHover={{
        scale: 1.02,
        y: -6,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      whileFocus={{
        scale: 1.03,
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link className='absolute inset-0 z-10' to={generateMediaLink(mediaType, id, title)} />

      {/* Subtle glow effect for focus */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/15 via-blue-400/10 to-blue-500/15 blur-lg'
          />
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <AnimatePresence>
        {isInteractive && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.3, staggerChildren: 0.05 }}
            className='absolute top-3 right-3 z-30 flex gap-1.5'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Tooltip content={<ShortcutTooltip shortcutName='toggleFavorite' />} className='tooltip-secondary'>
                <Button
                  isIconOnly
                  size='sm'
                  tabIndex={-1}
                  className={cn(
                    'h-8 w-8 border backdrop-blur-xl transition-all duration-300',
                    'hover:scale-110 active:scale-95',
                    item?.isFavorite
                      ? 'border-pink-400/60 bg-pink-500/30 text-pink-200 shadow-lg shadow-pink-500/25'
                      : 'border-white/30 bg-white/15 text-white hover:border-pink-400/60 hover:bg-pink-500/30 hover:text-pink-200'
                  )}
                  onPress={handleToggleFavorite}
                  aria-label={item?.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={cn('size-3.5 transition-all duration-300', item?.isFavorite && 'fill-current')} />
                </Button>
              </Tooltip>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Tooltip content={<ShortcutTooltip shortcutName='editStatus' />} className='tooltip-secondary'>
                <Button
                  isIconOnly
                  size='sm'
                  tabIndex={-1}
                  className='h-8 w-8 border border-white/30 bg-white/15 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-blue-400/60 hover:bg-blue-500/30 hover:text-blue-200 active:scale-95'
                  onPress={handleEditStatus}
                  aria-label='Edit library status'
                >
                  <Edit3 className='size-3.5' />
                </Button>
              </Tooltip>
            </motion.div>

            {status && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Tooltip content={<ShortcutTooltip shortcutName='removeFromLibrary' />} className='tooltip-secondary'>
                  <Button
                    isIconOnly
                    size='sm'
                    tabIndex={-1}
                    className='h-8 w-8 border border-white/30 bg-white/15 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-red-400/60 hover:bg-red-500/30 hover:text-red-200 active:scale-95'
                    onPress={handleRemove}
                    aria-label='Remove from library'
                  >
                    <Trash2 className='size-3.5' />
                  </Button>
                </Tooltip>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top left badges */}
      <AnimatePresence>
        {!isInteractive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute top-3 left-3 z-20 flex flex-col items-start gap-2'
          >
            <div className='flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 shadow-lg backdrop-blur-md'>
              {mediaType === 'movie' ? <Film className='size-3' /> : <Tv className='size-3' />}
              <span className='capitalize'>{mediaType}</span>
            </div>

            {status && (
              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-lg backdrop-blur-md',
                  status.className
                )}
              >
                <status.icon className='size-3' />
                <span>{status.label}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poster content */}
      <div className='relative block aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'>
        <motion.div
          animate={{
            scale: isInteractive ? 1.08 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='size-full'
        >
          <LazyImage
            src={posterPath ? `http://image.tmdb.org/t/p/w500${posterPath}` : '/images/placeholder.png'}
            alt={title}
            className='size-full object-cover'
          />
        </motion.div>

        {/* Gradients */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent' />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInteractive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className='absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent'
        />

        {/* Focus indicator overlay */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='absolute inset-0 bg-gradient-to-br from-blue-500/8 via-transparent to-blue-500/5'
            />
          )}
        </AnimatePresence>

        {/* Content overlay */}
        <div className='absolute inset-x-0 bottom-0 space-y-3 p-4'>
          <motion.div
            animate={{
              y: isInteractive ? -4 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h3 className='line-clamp-2 text-lg leading-tight font-bold text-white drop-shadow-lg'>{title}</h3>
          </motion.div>

          <motion.div
            animate={{
              y: isInteractive ? -2 : 0,
              opacity: isInteractive ? 1 : 0.9,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='flex items-center justify-between text-sm'
          >
            <div className='flex items-center gap-2.5 text-white/90'>
              {rating && (
                <div className='flex items-center gap-1'>
                  <Star className='size-3.5 fill-yellow-400 text-yellow-400 drop-shadow-md' />
                  <span className='font-semibold'>{rating}/10</span>
                </div>
              )}

              {releaseYear && (
                <>
                  {rating && <span className='text-white/50'>•</span>}
                  <div className='flex items-center gap-1'>
                    <Calendar className='size-3.5' />
                    <span className='font-medium'>{releaseYear}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Genres - only show on hover/focus */}
          <AnimatePresence>
            {isInteractive && genres.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3, staggerChildren: 0.05 }}
                className='flex flex-wrap gap-1.5'
              >
                {genres.slice(0, 3).map((genre: string, index: number) => (
                  <motion.span
                    key={genre}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className='rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-xs font-medium text-white/95 backdrop-blur-md'
                  >
                    {genre}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
