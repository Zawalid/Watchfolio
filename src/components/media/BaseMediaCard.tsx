import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Film, Tv, Heart, Trash2, Edit3, User, Mic, Users, Clapperboard, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn } from '@/utils';
import { formatDate } from '@/utils';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@heroui/react';
import { Tooltip } from '@heroui/react';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { getShortcut } from '@/utils/keyboardShortcuts';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useMediaStatusModal } from '@/contexts/MediaStatusModalContext';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { generateMediaLink, getTmdbImage, isMedia } from '@/utils/media';
import { Rating } from '@/components/ui/Rating';
import { useAuthStore } from '@/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { getDetails } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';

interface BaseMediaCardProps {
  id: number;
  title: string;
  mediaType: MediaType;
  posterPath?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
  genres?: string[] | null;
  item?: LibraryMedia;
  media?: Media;
  tabIndex?: number;
  isOwnProfile?: boolean;
  // Person role props
  celebrityRoles?: string[];
  primaryRole?: 'acting' | 'voice' | 'guest' | 'production';
}

export default function BaseMediaCard({
  id,
  title,
  mediaType,
  posterPath,
  releaseDate,
  rating,
  genres = [],
  item,
  media,
  tabIndex = 0,
  celebrityRoles,
  primaryRole,
}: BaseMediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { data: mediaDetails } = useQuery({
    queryKey: queryKeys.details(mediaType, id),
    queryFn: async () => await getDetails(mediaType, id),
    enabled: !!isHovered,
    staleTime: Infinity,
  });

  const inLibrary = !!item;
  const status = LIBRARY_MEDIA_STATUS.find((s) => s.value === item?.status);
  const isInteractive = isHovered || isFocused;
  const isPersonContext = !!celebrityRoles && celebrityRoles.length > 0;

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
      whileFocus={{
        scale: 1.03,
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link className='absolute inset-0 z-10' to={generateMediaLink(item || media)} />

      {/* Subtle glow effect for focus */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/15 via-blue-400/10 to-blue-500/15 blur-lg'
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Quick Actions - Show for ALL items on hover, including person context */}
        {isInteractive && (
          <QuickActions
            key='quick-actions'
            mediaType={mediaType}
            media={mediaDetails || media}
            item={item}
            isFocused={isFocused}
          />
        )}
        {/* User Rating Badge */}
        {isInteractive && item?.userRating && (
          <motion.div
            key='user-rating'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute top-3.5 left-3 z-20'
          >
            <div className='border-Primary-400/50 bg-Primary-500/20 text-Primary-200 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-lg backdrop-blur-md'>
              <Heart className='size-3 fill-current' />
              <span>{item.userRating}/10</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Type & Library Status Badges - Show when NOT person context and NOT interactive */}
      <AnimatePresence>
        {!isPersonContext && !isInteractive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute top-3 left-3 z-20 flex flex-col items-start gap-2'
          >
            {/* Media type badge */}
            <div className='flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 shadow-lg backdrop-blur-md'>
              {mediaType === 'movie' ? <Film className='size-3' /> : <Tv className='size-3' />}
              <span className='capitalize'>{mediaType}</span>
            </div>

            {/* Library status badge */}
            {inLibrary && status && (
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

      {/* Person Role Badges - Only show when person context and NOT interactive */}
      <AnimatePresence>
        {isPersonContext && <PersonRoleBadges roles={celebrityRoles!} primaryRole={primaryRole} maxVisible={2} />}
      </AnimatePresence>

      {/* Library Status Badge on Hover for Person Context */}
      <AnimatePresence>
        {isPersonContext && isInteractive && status && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute top-3 left-3 z-20'
          >
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-lg backdrop-blur-md',
                status.className
              )}
            >
              <status.icon className='size-3' />
              <span>{status.label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating badge - Top right (hidden on hover when library actions show) */}
      <AnimatePresence>
        {!isInteractive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className='absolute top-3 right-3 z-20'
          >
            <Rating rating={rating} className='*:text-xs [&_svg]:size-3!' />
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
            src={getTmdbImage({ poster_path: posterPath } as Media, 'w500')}
            alt={title}
            className='size-full object-cover'
          />
        </motion.div>

        {/* Gradients */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent' />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInteractive ? 0 : 1 }}
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
        <div className='absolute inset-x-0 bottom-0 space-y-2 p-4'>
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
            className='text-Grey-200 flex items-center gap-2.5 text-sm'
          >
            {/* Release date - using formatDate util */}
            {releaseDate && (
              <div className='flex items-center gap-1'>
                <Calendar className='size-3.5' />
                <span className='font-medium'>{formatDate(releaseDate)}</span>
              </div>
            )}
          </motion.div>

          {/* Genres - only show on hover/focus */}
          <AnimatePresence>
            {isInteractive && genres && genres.length > 0 && (
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

const PersonRoleBadges = ({
  roles,
  primaryRole,
  maxVisible = 2,
}: {
  roles: string[];
  primaryRole?: string;
  maxVisible?: number;
}) => {
  const displayRoles = roles.slice(0, maxVisible);
  const remainingRoles = roles.slice(maxVisible);
  const hasMore = remainingRoles.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3, staggerChildren: 0.1 }}
      className='absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5'
    >
      {displayRoles.map((role, index) => (
        <RoleBadge key={role} role={role} primaryRole={primaryRole} delay={index * 0.1} />
      ))}

      {hasMore && <OverflowBadge remainingRoles={remainingRoles} delay={displayRoles.length * 0.1} />}
    </motion.div>
  );
};

const RoleBadge = ({ role, primaryRole, delay = 0 }: { role: string; primaryRole?: string; delay?: number }) => {
  const getIcon = () => {
    if (primaryRole === 'voice' || role.toLowerCase().includes('voice')) {
      return <Mic className='h-3 w-3' />;
    }
    if (primaryRole === 'guest' || role.includes('Self') || role.includes('Host')) {
      return <Users className='h-3 w-3' />;
    }
    if (role.includes('Director') || role.includes('Producer') || role.includes('Writer')) {
      return <Clapperboard className='h-3 w-3' />;
    }
    return <User className='h-3 w-3' />;
  };

  const getColor = () => {
    if (primaryRole === 'voice' || role.toLowerCase().includes('voice')) {
      return 'bg-Tertiary-500/20 text-Tertiary-300 border-Tertiary-500/30';
    }
    if (primaryRole === 'guest') {
      return 'bg-Secondary-500/20 text-Secondary-300 border-Secondary-500/30';
    }
    if (role.includes('Director')) {
      return 'bg-Error-500/20 text-Error-300 border-Error-500/30';
    }
    if (role.includes('Producer')) {
      return 'bg-Warning-500/20 text-Warning-300 border-Warning-500/30';
    }
    if (role.includes('Writer')) {
      return 'bg-Success-500/20 text-Success-300 border-Success-500/30';
    }
    return 'bg-Primary-500/20 text-Primary-300 border-Primary-500/30';
  };

  const formatRole = (role: string) => {
    return role.replace('as ', '').replace('Executive ', 'Exec ').replace('Associate ', 'Assoc ').replace('Co-', 'Co');
  };

  const fullRole = formatRole(role);
  const isLongRole = fullRole.length > 12;

  return (
    <Tooltip content={isLongRole ? role : undefined} className='tooltip-secondary!' isDisabled={!isLongRole}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className={cn(
          'flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-lg backdrop-blur-md',
          getColor()
        )}
      >
        {getIcon()}
        <span className={cn('line-clamp-1', isLongRole ? 'max-w-16' : 'max-w-20')}>{fullRole}</span>
      </motion.div>
    </Tooltip>
  );
};

const OverflowBadge = ({ remainingRoles, delay = 0 }: { remainingRoles: string[]; delay?: number }) => {
  return (
    <Tooltip
      content={
        <div className='space-y-1'>
          <p className='text-xs font-medium text-white'>Additional roles:</p>
          {remainingRoles.map((role) => (
            <p key={role} className='text-Grey-300 text-xs'>
              {role}
            </p>
          ))}
        </div>
      }
      className='tooltip-secondary!'
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className='border-Grey-500/30 bg-Grey-500/20 text-Grey-300 flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-lg backdrop-blur-md'
      >
        <span>+{remainingRoles.length}</span>
      </motion.div>
    </Tooltip>
  );
};

const QuickActions = ({
  mediaType,
  item,
  media,
  isFocused,
}: {
  mediaType: MediaType;
  item?: LibraryMedia;
  media?: Media;
  isFocused: boolean;
}) => {
  const { toggleFavorite, removeItem, addOrUpdateItem } = useLibraryStore();
  const { openModal } = useMediaStatusModal();
  const { confirm } = useConfirmationModal();
  const defaultMediaStatus = useAuthStore((state) => state.userPreferences.defaultMediaStatus);

  const inLibrary = item && (item.status !== 'none' || item.userRating);

  const handleToggleFavorite = () => {
    toggleFavorite(item?.id || '', media ? { ...media, media_type: mediaType } : undefined);
  };

  /* 
  I need to fix the id (mayber add the $id)
  i need to remove the tmdbid
   */

  const handleEditStatus = () => {
    const target = item || media;
    if (!target) return;

    if (defaultMediaStatus !== 'none' && !inLibrary) {
      addOrUpdateItem(
        { id: item?.id || '', media_type: target.media_type, status: defaultMediaStatus },
        isMedia(target) ? target : undefined
      );
    } else {
      openModal({ ...target, media_type: mediaType });
    }
  };

  const handleRemove = async () => {
    if (item) {
      const confirmed = await confirm({
        title: 'Remove from Library',
        message: `Are you sure you want to remove "${item.title || 'this item'}" from your library?`,
        confirmText: 'Remove',
        cancelText: 'Cancel',
        confirmVariant: 'danger',
        confirmationKey: 'remove-from-library',
      });

      if (confirmed) {
        removeItem(item.id);
      }
    }
  };

  // Hotkeys
  useHotkeys(getShortcut(inLibrary ? 'editStatus' : 'addToLibrary')?.hotkey || '', handleEditStatus, {
    enabled: isFocused,
  });
  useHotkeys(getShortcut('toggleFavorite')?.hotkey || '', handleToggleFavorite, { enabled: isFocused });
  useHotkeys(getShortcut('removeFromLibrary')?.hotkey || '', handleRemove, { enabled: isFocused });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ duration: 0.3, staggerChildren: 0.05 }}
      className='absolute top-3 right-3 z-30 flex gap-1.5'
    >
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Tooltip content={<ShortcutTooltip shortcutName='toggleFavorite' />} className='tooltip-secondary!'>
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

      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
        <Tooltip
          content={<ShortcutTooltip shortcutName={inLibrary ? 'editStatus' : 'addToLibrary'} />}
          className='tooltip-secondary!'
        >
          <Button
            isIconOnly
            size='sm'
            tabIndex={-1}
            className='h-8 w-8 border border-white/30 bg-white/15 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-blue-400/60 hover:bg-blue-500/30 hover:text-blue-200 active:scale-95'
            onPress={handleEditStatus}
            aria-label={inLibrary ? 'Edit library status' : 'Add to library'}
          >
            {inLibrary ? <Edit3 className='size-3.5' /> : <Plus className='size-3.5' />}
          </Button>
        </Tooltip>
      </motion.div>

      {inLibrary && (
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Tooltip content={<ShortcutTooltip shortcutName='removeFromLibrary' />} className='tooltip-secondary!'>
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
  );
};
