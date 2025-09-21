import { motion, AnimatePresence } from 'framer-motion';
import { Film, Tv, Heart } from 'lucide-react';
import { cn } from '@/utils';
import { Rating } from '@/components/ui/Rating';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

interface MediaCardOverlaysProps {
  mediaType: MediaType;
  item?: LibraryMedia;
  rating?: number | null;
  isInteractive: boolean;
  isPersonContext: boolean;
}

export function MediaCardOverlays({ mediaType, item, rating, isInteractive, isPersonContext }: MediaCardOverlaysProps) {
  const status = LIBRARY_MEDIA_STATUS.find(
    (s) => s.value === item?.status || (item?.isFavorite && s.value === 'favorites')
  );

  return (
    <>
      {/* User Rating */}
      <AnimatePresence>
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

      {/* Media Type & Status Badges */}
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

      {/* TMDB Rating */}
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
    </>
  );
}
