import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, Heart, MapPin, Film } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn, slugify } from '@/utils';
import { getPersonDetails, getPersonCombinedCredits } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { getTmdbImage } from '@/utils/media';

interface CelebrityCardProps {
  person: Person;
  tabIndex?: number;
}

export default function CelebrityCard({ person, tabIndex = 0 }: CelebrityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isInteractive = isHovered || isFocused;

  // Fetch person details and credits for enhanced information
  const { data: personDetails } = useQuery({
    queryKey: queryKeys.celebrity(person.id),
    queryFn: () => getPersonDetails(person.id),
    staleTime: 1000 * 60 * 30,
    enabled: isInteractive,
  });

  const { data: credits } = useQuery({
    queryKey: [...queryKeys.celebrity(person.id), 'combined-credits'],
    queryFn: () => getPersonCombinedCredits(person.id),
    staleTime: 1000 * 60 * 30,
    enabled: isInteractive,
  });

  // Use detailed data if available, fallback to basic person data
  const displayPerson = personDetails || person;
  const isDeceased = !!displayPerson.deathday;
  const totalAppearances = credits ? (credits.cast?.length || 0) + (credits.crew?.length || 0) : null;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={tabIndex}
      role='article'
      aria-label={`${displayPerson.name} - ${displayPerson.known_for_department}`}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] shadow-lg backdrop-blur-sm transition-all duration-500 ease-out',
        isInteractive && 'border-white/25 shadow-2xl shadow-black/40',
        isFocused &&
          'border-Tertiary-400/70 shadow-Tertiary-500/25 ring-Tertiary-400/50 shadow-2xl ring-2 ring-offset-2 ring-offset-gray-900'
      )}
    >
      <Link className='absolute inset-0 z-10' to={`/celebrities/${person.id}-${slugify(displayPerson.name)}`} />

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

      {/* Top Badges - Primary Info */}
      <AnimatePresence>
        {!isInteractive && (
          <>
            {/* Department Badge - Top left */}
            {displayPerson.known_for_department && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className='absolute top-3 left-3 z-20'
              >
                <div className='flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 shadow-lg backdrop-blur-md'>
                  <Award className='size-3' />
                  <span className='capitalize'>{displayPerson.known_for_department}</span>
                </div>
              </motion.div>
            )}

            {/* Total Appearances Badge - Top right */}
            {totalAppearances !== null && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className='absolute top-3 right-3 z-20'
              >
                <div className='border-Tertiary-400/30 bg-Tertiary-500/20 text-Tertiary-300 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium shadow-lg backdrop-blur-md'>
                  <Film className='size-3' />
                  <span>{totalAppearances}</span>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Memorial Badge - Top right for deceased (overrides appearances) */}
      <AnimatePresence>
        {isDeceased && !isInteractive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className='absolute top-3 right-3 z-30'
          >
            <div className='border-Error-400/30 bg-Error-900/80 text-Error-300 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-lg backdrop-blur-md'>
              <Heart className='size-3 fill-current' />
              <span>In Memory</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo content */}
      <div className='relative block aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'>
        <motion.div
          animate={{
            scale: isInteractive ? 1.08 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='size-full'
        >
          <LazyImage
            src={getTmdbImage(displayPerson, 'w500')}
            alt={displayPerson.name}
            className={cn('size-full object-cover', isDeceased && 'saturate-75')}
          />
        </motion.div>

        {/* Enhanced gradients for better text visibility */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInteractive ? 0 : 0.4 }}
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
              className='from-Tertiary-500/8 to-Primary-500/5 absolute inset-0 bg-gradient-to-br via-transparent'
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
            <h3
              className={cn(
                'line-clamp-2 text-lg leading-tight font-bold drop-shadow-lg transition-colors duration-300',
                isDeceased ? 'text-Grey-200' : 'group-hover:text-Tertiary-300 text-white'
              )}
            >
              {displayPerson.name}
            </h3>
          </motion.div>

          <motion.div
            animate={{
              y: isInteractive ? -2 : 0,
              opacity: isInteractive ? 1 : 0.9,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='flex items-center gap-2'
          >
            {/* Birth year badge - Bottom info */}
            {displayPerson.birthday && (
              <div className='flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md'>
                <Calendar className='size-3' />
                <span>{new Date(displayPerson.birthday).getFullYear()}</span>
                {isDeceased && displayPerson.deathday && (
                  <span className='text-Grey-400'>- {new Date(displayPerson.deathday).getFullYear()}</span>
                )}
              </div>
            )}

            {/* Place of birth badge - Bottom info */}
            {displayPerson.place_of_birth && (
              <div className='border-Secondary-400/30 bg-Secondary-500/20 text-Secondary-300 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md sm:flex'>
                <MapPin className='size-3' />
                <span className='max-w-16 truncate'>{displayPerson.place_of_birth.split(',').pop()?.trim()}</span>
              </div>
            )}
          </motion.div>

          {/* Enhanced hover details - Additional info only */}
          <AnimatePresence>
            {isInteractive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className='flex flex-wrap gap-1.5'
              >
                {/* Age badge - Only for living people */}
                {displayPerson.birthday && !isDeceased && (
                  <motion.span className='border-Success-400/30 bg-Success-500/20 text-Success-300 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md'>
                    <Calendar className='mr-1 inline size-3' />
                    Age {new Date().getFullYear() - new Date(displayPerson.birthday).getFullYear()}
                  </motion.span>
                )}

                {/* Gender badge */}
                {displayPerson.gender !== undefined && (
                  <motion.span className='border-Primary-400/30 bg-Primary-500/20 text-Primary-300 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md'>
                    {displayPerson.gender === 1 ? '♀' : displayPerson.gender === 2 ? '♂' : '⚧'}
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
