import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Film, Tv, Heart, Trash2, Edit3, User, Mic, Users, Clapperboard, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn, formatDate } from '@/utils';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button, Tooltip } from '@heroui/react';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { getShortcut } from '@/utils/keyboardShortcuts';
import { useMediaStatusModal } from '@/contexts/MediaStatusModalContext';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { generateMediaLink, getTmdbImage } from '@/utils/media';
import { Rating } from '@/components/ui/Rating';
import { useAuthStore } from '@/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { getDetails } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { useAddOrUpdateLibraryItem, useRemoveLibraryItem } from '@/hooks/library/useLibraryMutations';
import { generateMediaId } from '@/utils/library';

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
    queryFn: () => getDetails(mediaType, id),
    enabled: isHovered,
    staleTime: Infinity,
  });

  const status = LIBRARY_MEDIA_STATUS.find(
    (s) => s.value === item?.status || (item?.isFavorite && s.value === 'favorites')
  );
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
        'group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] shadow-lg transition-all duration-500 ease-out hover:border-white/25 hover:shadow-2xl focus:outline-none',
        isFocused && 'border-blue-400/70 shadow-2xl ring-2 ring-blue-400/50 ring-offset-2 ring-offset-gray-900'
      )}
      whileFocus={{ scale: 1.03, y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      whileTap={{ scale: 0.98 }}
    >
      <Link className='absolute inset-0 z-10' to={generateMediaLink(item || media)} />

      <AnimatePresence>
        {isInteractive && (
          <QuickActions
            key='quick-actions'
            mediaType={mediaType}
            media={mediaDetails || media}
            item={item}
            isFocused={isFocused}
          />
        )}
        {isInteractive && item?.userRating && (
          <motion.div
            key='user-rating'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute top-3.5 left-3 z-20'
          >
            <div className='border-Primary-400/50 bg-Primary-500/20 text-Primary-200 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-md'>
              <Heart className='size-3 fill-current' />
              <span>{item.userRating}/10</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isPersonContext && !isInteractive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute top-3 left-3 z-20 flex flex-col items-start gap-2'
          >
            <div className='flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md'>
              {mediaType === 'movie' ? <Film className='size-3' /> : <Tv className='size-3' />}
              <span className='capitalize'>{mediaType}</span>
            </div>
            {item && status && (
              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md',
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

      <AnimatePresence>
        {isPersonContext && <PersonRoleBadges roles={celebrityRoles!} primaryRole={primaryRole} maxVisible={2} />}
      </AnimatePresence>

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

      <div className='relative block aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'>
        <motion.div
          animate={{ scale: isInteractive ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='size-full'
        >
          <LazyImage
            src={getTmdbImage({ poster_path: posterPath } as Media, 'w500')}
            alt={title}
            className='size-full object-cover'
          />
        </motion.div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent' />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInteractive ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className='absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent'
        />
        <div className='absolute inset-x-0 bottom-0 space-y-2 p-4'>
          <motion.div animate={{ y: isInteractive ? -4 : 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            <h3 className='line-clamp-2 text-lg leading-tight font-bold text-white drop-shadow-lg'>{title}</h3>
          </motion.div>
          <motion.div
            animate={{ y: isInteractive ? -2 : 0, opacity: isInteractive ? 1 : 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='text-Grey-200 flex items-center gap-2.5 text-sm'
          >
            {releaseDate && (
              <div className='flex items-center gap-1'>
                <Calendar className='size-3.5' />
                <span>{formatDate(releaseDate)}</span>
              </div>
            )}
          </motion.div>
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
      {remainingRoles.length > 0 && <OverflowBadge remainingRoles={remainingRoles} delay={displayRoles.length * 0.1} />}
    </motion.div>
  );
};

const RoleBadge = ({ role, primaryRole, delay = 0 }: { role: string; primaryRole?: string; delay?: number }) => {
  const getIcon = () => {
    if (primaryRole === 'voice' || role.toLowerCase().includes('voice')) return <Mic className='h-3 w-3' />;
    if (primaryRole === 'guest' || role.includes('Self') || role.includes('Host')) return <Users className='h-3 w-3' />;
    if (role.includes('Director') || role.includes('Producer') || role.includes('Writer'))
      return <Clapperboard className='h-3 w-3' />;
    return <User className='h-3 w-3' />;
  };
  const getColor = () => {
    if (primaryRole === 'voice' || role.toLowerCase().includes('voice'))
      return 'bg-Tertiary-500/20 text-Tertiary-300 border-Tertiary-500/30';
    if (primaryRole === 'guest') return 'bg-Secondary-500/20 text-Secondary-300 border-Secondary-500/30';
    if (role.includes('Director')) return 'bg-Error-500/20 text-Error-300 border-Error-500/30';
    if (role.includes('Producer')) return 'bg-Warning-500/20 text-Warning-300 border-Warning-500/30';
    if (role.includes('Writer')) return 'bg-Success-500/20 text-Success-300 border-Success-500/30';
    return 'bg-Primary-500/20 text-Primary-300 border-Primary-500/30';
  };
  const formattedRole = role
    .replace('as ', '')
    .replace('Executive ', 'Exec ')
    .replace('Associate ', 'Assoc ')
    .replace('Co-', 'Co');
  return (
    <Tooltip
      content={formattedRole.length > 12 ? role : undefined}
      className='tooltip-secondary!'
      isDisabled={formattedRole.length <= 12}
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className={cn(
          'flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md',
          getColor()
        )}
      >
        {getIcon()}
        <span className='line-clamp-1 max-w-20'>{formattedRole}</span>
      </motion.div>
    </Tooltip>
  );
};

const OverflowBadge = ({ remainingRoles, delay = 0 }: { remainingRoles: string[]; delay?: number }) => (
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
      className='border-Grey-500/30 bg-Grey-500/20 text-Grey-300 flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md'
    >
      <span>+{remainingRoles.length}</span>
    </motion.div>
  </Tooltip>
);

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
  const { openModal } = useMediaStatusModal();
  const { confirm } = useConfirmationModal();
  const defaultMediaStatus = useAuthStore((state) => state.userPreferences.defaultMediaStatus);

  const id = generateMediaId(item || (media && { ...media, media_type: mediaType }));
  const { mutate: addOrUpdateItem } = useAddOrUpdateLibraryItem();
  const { mutate: removeItem } = useRemoveLibraryItem();

  const inLibrary = item && (item.status !== 'none' || item.userRating);

  const handleEditStatus = () => {
    const target = media || item;
    if (!target) return;

    if (defaultMediaStatus !== 'none' && !inLibrary) {
      addOrUpdateItem({
        item: { id, status: defaultMediaStatus },
        media: media ? { ...media, media_type: mediaType } : undefined,
      });
    } else {
      openModal({ ...target, media_type: mediaType });
    }
  };

  const handleToggleFavorite = () => {
    addOrUpdateItem({
      item: { id, isFavorite: !item?.isFavorite, media_type: mediaType },
      media: media ? { ...media, media_type: mediaType } : undefined,
    });
  };

  const handleRemove = async () => {
    if (item) {
      const confirmed = await confirm({
        title: 'Remove from Library',
        message: `Are you sure you want to remove "${item.title}" from your library?`,
        confirmText: 'Remove',
        confirmVariant: 'danger',
      });
      if (confirmed) removeItem(item);
    }
  };

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
              'h-8 w-8 border backdrop-blur-xl transition-all',
              item?.isFavorite
                ? 'border-pink-400/60 bg-pink-500/30 text-pink-200'
                : 'border-white/30 bg-white/15 text-white hover:border-pink-400/60 hover:bg-pink-500/30 hover:text-pink-200'
            )}
            onPress={handleToggleFavorite}
            aria-label={item?.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('size-3.5', item?.isFavorite && 'fill-current')} />
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
            className='h-8 w-8 border border-white/30 bg-white/15 text-white backdrop-blur-xl transition-all hover:border-blue-400/60 hover:bg-blue-500/30 hover:text-blue-200'
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
              className='h-8 w-8 border border-white/30 bg-white/15 text-white backdrop-blur-xl transition-all hover:border-red-400/60 hover:bg-red-500/30 hover:text-red-200'
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
