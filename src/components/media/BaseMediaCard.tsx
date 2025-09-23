import { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Calendar, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLongPress } from 'use-long-press';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn, formatDate } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getDetails } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { generateMediaLink, getTmdbImage } from '@/utils/media';
import { useViewportSize } from '@/hooks/useViewportSize';
import { useAddOrUpdateLibraryItem } from '@/hooks/library/useLibraryMutations';
import { generateMediaId } from '@/utils/library';
import { MobileActionsDrawer, QuickActions } from './QuickActions';
import { PersonRoleBadges } from './PersonRoleBadges';
import { MediaCardOverlays } from './MediaCardOverlays';
import { AiAnalysisBadge } from './AiAnalysisBadge';

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
  aiAnalysis?: {
    detailed_analysis: string;
    mood_alignment: string;
  };
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
  aiAnalysis,
}: BaseMediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const { isBelow } = useViewportSize();
  const isMobile = isBelow('md');
  const navigate = useNavigate();

  const clickCount = useRef(0);
  const clickTimer = useRef<number | null>(null);

  const { mutate: addOrUpdateItem } = useAddOrUpdateLibraryItem();

  const { data: mediaDetails } = useQuery({
    queryKey: queryKeys.details(mediaType, id),
    queryFn: () => getDetails(mediaType, id),
    enabled: isHovered,
    staleTime: Infinity,
  });

  const isInteractive = isHovered || isFocused;
  const isPersonContext = !!celebrityRoles && celebrityRoles.length > 0;

  const handleFavorite = useCallback(() => {
    const mediaId = generateMediaId(item || (media && { ...media, media_type: mediaType }));
    addOrUpdateItem({
      item: { id: mediaId, isFavorite: !item?.isFavorite, media_type: mediaType },
      media: media ? { ...media, media_type: mediaType } : undefined,
    });

    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1000);

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [item, media, mediaType, addOrUpdateItem]);

  const handleLongPress = useLongPress(() => setShowMobileDrawer(true), {
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true,
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isMobile) return; // Desktop uses Link

      e.preventDefault();
      e.stopPropagation();

      clickCount.current += 1;

      if (clickCount.current === 1) {
        // Start timer for single click
        clickTimer.current = window.setTimeout(() => {
          // Single click - navigate
          navigate(generateMediaLink(item || media));
          clickCount.current = 0;
        }, 300);
      } else if (clickCount.current === 2) {
        // Double click - favorite
        if (clickTimer.current) {
          clearTimeout(clickTimer.current);
          clickTimer.current = null;
        }
        handleFavorite();
        clickCount.current = 0;
      }
    },
    [isMobile, navigate, item, media, handleFavorite]
  );

  return (
    <>
      <motion.div
        // {...(isMobile ? { ...longPressProps, onClick: handleClick } : { onClick: handleClick })}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={tabIndex}
        role='article'
        aria-label={`${title} - ${mediaType}`}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] shadow-lg transition-all duration-500 ease-out hover:border-white/25 hover:shadow-2xl focus:outline-none',
          isFocused &&
            !isMobile &&
            'border-Secondary-400/70 ring-Secondary-400/50 ring-offset-Grey-900 shadow-2xl ring-2 ring-offset-2'
        )}
        whileFocus={{ scale: 1.03, y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        {...handleLongPress()}
      >
        {/* Link for desktop only */}
        {!isMobile && <Link className='absolute inset-0 z-10' to={generateMediaLink(item || media)} />}

        {/* Heart Animation */}
        <AnimatePresence>
          {showHeartAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1.5, 2],
                y: [0, -20, -40, -60],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1,
                times: [0, 0.2, 0.6, 1],
                ease: 'easeOut',
              }}
              className='pointer-events-none absolute inset-0 z-40 flex items-center justify-center'
            >
              <Heart className='text-Error-400 h-16 w-16 fill-current drop-shadow-lg' />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions - Desktop Only */}
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
        </AnimatePresence>

        {/* AI Badge and Analysis Button */}
        {aiAnalysis && <AiAnalysisBadge aiAnalysis={aiAnalysis} />}

        {/* All Overlays */}
        <MediaCardOverlays
          mediaType={mediaType}
          item={item}
          rating={rating}
          isInteractive={isInteractive}
          isPersonContext={isPersonContext}
        />

        {/* Person Role Badges */}
        <AnimatePresence>
          {isPersonContext && <PersonRoleBadges roles={celebrityRoles!} primaryRole={primaryRole} maxVisible={2} />}
        </AnimatePresence>

        <div className='from-Grey-800 to-Grey-900 relative block aspect-[2/3] overflow-hidden bg-gradient-to-br'>
          <motion.div
            animate={{ scale: isInteractive ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='h-full w-full'
          >
            <LazyImage
              src={getTmdbImage({ poster_path: posterPath } as Media, 'w500')}
              alt={title}
              className='h-full w-full object-cover'
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
                  <Calendar className='h-3.5 w-3.5' />
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

      <MobileActionsDrawer
        isOpen={showMobileDrawer}
        onClose={() => setShowMobileDrawer(false)}
        mediaType={mediaType}
        item={item}
        media={media}
        title={title}
      />
    </>
  );
}

