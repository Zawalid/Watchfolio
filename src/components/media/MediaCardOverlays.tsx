import { motion, AnimatePresence } from 'framer-motion';
import { Film, Tv, Heart, User, Mic, Users, Clapperboard } from 'lucide-react';
import { cn } from '@/utils';
import { Rating } from '@/components/ui/Rating';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { Tooltip } from '@heroui/react';

interface MediaCardOverlaysProps {
  mediaType: MediaType;
  item?: LibraryMedia;
  rating?: number | null;
  isInteractive: boolean;
  primaryRole?: string;
  roleName?: string;
}

const getRoleIcon = (primaryRole?: string) => {
  if (primaryRole === 'voice') return <Mic className='h-3 w-3' />;
  if (primaryRole === 'guest') return <Users className='h-3 w-3' />;
  if (primaryRole === 'production') return <Clapperboard className='h-3 w-3' />;
  return <User className='h-3 w-3' />;
};

const getRoleColor = (primaryRole?: string) => {
  if (primaryRole === 'voice') return 'bg-Tertiary-500/20 text-Tertiary-300 border-Tertiary-500/30';
  if (primaryRole === 'guest') return 'bg-Secondary-500/20 text-Secondary-300 border-Secondary-500/30';
  if (primaryRole === 'production') return 'bg-Warning-500/20 text-Warning-300 border-Warning-500/30';
  return 'bg-Primary-500/20 text-Primary-300 border-Primary-500/30';
};

export function MediaCardOverlays({
  mediaType,
  item,
  rating,
  isInteractive,
  primaryRole,
  roleName,
}: MediaCardOverlaysProps) {
  const status = LIBRARY_MEDIA_STATUS.find(
    (s) => s.value === item?.status || (item?.isFavorite && s.value === 'favorites')
  );

  return (
    <>
      {/* Media Type & Status Badges */}
      <AnimatePresence>
        {!isInteractive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute top-3 z-20 flex w-full items-start justify-between gap-2 px-3'
          >
            <div className='flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md'>
              {mediaType === 'movie' ? <Film className='size-3' /> : <Tv className='size-3' />}
              <span className='capitalize'>{mediaType}</span>
            </div>
            <div className='flex flex-col items-end gap-2'>
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
              {/* User Rating */}
              {item?.userRating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='border-Primary-400/50 bg-Primary-500/20 text-Primary-200 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-md'>
                    <Heart className='size-3 fill-current' />
                    <span>{item.userRating}/10</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Role Badge (Person Context) */}
      <AnimatePresence>
        {roleName && !isInteractive && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className='absolute top-11 left-3 z-20'
          >
            <Tooltip content={roleName.length > 15 ? roleName : undefined} className='tooltip-secondary!'>
              <div
                className={cn(
                  'flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md',
                  getRoleColor(primaryRole)
                )}
              >
                {getRoleIcon(primaryRole)}
                <span className='line-clamp-1 max-w-24'>{roleName}</span>
              </div>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TMDB Rating */}
      <AnimatePresence>
        {!isInteractive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className='absolute right-3 bottom-4 z-20'
          >
            <Rating rating={rating} className='*:text-xs [&_svg]:size-3!' />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
