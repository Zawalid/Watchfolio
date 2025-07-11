import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Heart, ChevronUp, ChevronDown, Clapperboard } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn } from '@/utils';
import { Button } from '@heroui/button';

interface PersonProfileProps {
  person: Person;
  appearances: number;
}

const getAgeInfo = (person: Person) => {
  if (!person.birthday) return null;

  const birthDate = new Date(person.birthday);
  const endDate = person.deathday ? new Date(person.deathday) : new Date();
  const age = Math.floor((endDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return {
    age,
    lifespan: person.deathday
      ? `${birthDate.getFullYear()} - ${new Date(person.deathday).getFullYear()}`
      : `Born ${birthDate.getFullYear()}`,
  };
};

export default function PersonProfile({ person, appearances }: PersonProfileProps) {
  const isDeceased = !!person.deathday;
  const ageInfo = getAgeInfo(person);

  return (
    <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
      {/* Left Column - Photo */}
      <motion.div
        className={cn(
          'group relative aspect-[2/3] max-h-[500px] w-full max-w-[300px] overflow-hidden rounded-xl shadow-2xl ring-1',
          isDeceased ? 'ring-Grey-500/30' : 'ring-Primary-500/20'
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LazyImage
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
              : '/images/placeholder-person.png'
          }
          alt={person.name}
          className={cn(
            'size-full object-cover transition-transform duration-300 group-hover:scale-105',
            isDeceased && 'saturate-75'
          )}
        />
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300 group-hover:opacity-100',
            isDeceased
              ? 'bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-20'
              : 'bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0'
          )}
        ></div>

        {/* Memorial indicator */}
        {isDeceased && (
          <div className='absolute top-3 right-3 rounded-full border border-white/30 bg-black/60 p-2 backdrop-blur-sm'>
            <Heart className='h-4 w-4 text-white/80' />
          </div>
        )}
      </motion.div>

      {/* Right Column - Info */}
      <motion.div
        className='flex-1'
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Title & Meta */}
        <div className='mb-6'>
          <div className='mb-3 flex flex-wrap items-center gap-3'>
            {person.known_for_department && (
              <motion.span className='bg-Secondary-900/80 text-Secondary-300 ring-Secondary-500/30 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                <Award className='mr-1 size-4' />
                {person.known_for_department}
              </motion.span>
            )}
            <motion.span className='bg-Tertiary-900/80 text-Tertiary-300 ring-Tertiary-500/30 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
              <Clapperboard className='mr-1 size-4' />
              {appearances} Appearances
            </motion.span>

            {/* Memorial badge for deceased */}
            {isDeceased && ageInfo && (
              <>
                <motion.span className='bg-Grey-900/80 text-Grey-300 ring-Grey-500/30 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                  <Calendar className='mr-1 size-4' />
                  {ageInfo.lifespan}
                  <span className='ml-1 text-xs opacity-75'>(aged {ageInfo.age})</span>
                </motion.span>
                <motion.span className='bg-Error-900/80 text-Error-300 ring-Error-500/30 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                  <Heart className='mr-1 size-4' />
                  In Memory
                </motion.span>
              </>
            )}
          </div>

          <h1 className={cn('heading', isDeceased ? 'text-Grey-200' : 'gradient')}>{person.name}</h1>

          {/* Respectful subtitle for deceased */}
          {isDeceased && (
            <p className='text-Grey-400 mt-2 text-sm'>Remembered for their contributions to entertainment</p>
          )}
        </div>

        {/* Biography */}
        <PersonBiography biography={person.biography} />

        {/* Details */}
        <div className='mt-4 flex gap-12 border-t border-white/10 pt-4'>
          {person.birthday && (
            <div>
              <h4 className='mb-1 text-xs font-medium text-gray-400'>{isDeceased ? 'Born' : 'Birthday'}</h4>
              <p className='pill-bg text-sm text-gray-200'>
                {new Date(person.birthday).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          {person.deathday && (
            <div>
              <h4 className='mb-1 text-xs font-medium text-gray-400'>Passed Away</h4>
              <p className='pill-bg text-sm text-gray-200'>
                {new Date(person.deathday).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          {person.place_of_birth && (
            <div>
              <h4 className='mb-1 text-xs font-medium text-gray-400'>Birthplace</h4>
              <p className='pill-bg text-sm text-gray-200'>{person.place_of_birth}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const BIOGRAPHY_PREVIEW_LENGTH = 400;

function PersonBiography({ biography }: { biography?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!biography) return null;

  const shouldShowExpansion = biography.length > BIOGRAPHY_PREVIEW_LENGTH;
  const displayBiography =
    shouldShowExpansion && !isExpanded ? biography.slice(0, BIOGRAPHY_PREVIEW_LENGTH).trim() + '...' : biography;

  return (
    <div className='mb-6 space-y-3'>
      <motion.div animate={{ height: 'auto' }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <p className='text-base leading-relaxed text-gray-300'>{displayBiography}</p>
      </motion.div>

      {shouldShowExpansion && (
        <Button className='button-secondary! text-xs!' size='sm' onPress={() => setIsExpanded(!isExpanded)}>
          <span>{isExpanded ? 'Show Less' : 'Read Full Biography'}</span>
          {isExpanded ? (
            <ChevronUp className='h-4 w-4 transition-transform group-hover:-translate-y-0.5' />
          ) : (
            <ChevronDown className='h-4 w-4 transition-transform group-hover:translate-y-0.5' />
          )}
        </Button>
      )}
    </div>
  );
}
