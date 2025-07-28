import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { formatDate } from '@/utils';
import { getTmdbImage } from '@/utils/media';

export default function EpisodesList({ episodes }: { episodes: Episode[] }) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className='py-3 text-center text-sm text-gray-400'>
        <p>No episodes available for this season.</p>
      </div>
    );
  }

  return (
    <motion.div className='space-y-2' initial='hidden' animate='visible' variants={containerVariants}>
      {episodes.map((episode) => (
        <motion.div
          key={episode.id}
          variants={itemVariants}
          className='group flex items-start gap-3 rounded-lg border border-blur  bg-white/5 transition hover:border-gray-700 hover:bg-gray-800/40'
        >
          {episode.still_path ? (
            <div className='relative aspect-video w-32 shrink-0 self-stretch overflow-hidden rounded-s-md'>
              <img
                src={getTmdbImage(episode, 'w300')}
                alt={`${episode.name} still`}
                className='h-full w-full object-cover'
                loading='lazy'
              />
            </div>
          ) : (
            <div className='aspect-video w-28 shrink-0 self-stretch rounded-s-md border border-white/10 bg-gray-700/40' />
          )}

          <div className='flex flex-1 flex-col justify-center py-2 pr-3'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center text-sm text-white/80'>
                <div className='h-5 w-5 border  border-white/10 grid place-content-center  rounded-full bg-gray-800 text-xs font-medium text-gray-300'>
                  {episode.episode_number}
                </div>
                <span className='ml-2 truncate font-medium'>{episode.name}</span>
              </div>

              {episode.vote_average > 0 && (
                <span className='text-[11px] text-yellow-400'>★ {episode.vote_average.toFixed(1)}</span>
              )}
            </div>

            <div className='mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-400'>
              {episode.air_date && <span>{formatDate(episode.air_date)}</span>}
              {episode.runtime && (
                <>
                  {episode.air_date && <span className='text-gray-600'>•</span>}
                  <span>{episode.runtime} min</span>
                </>
              )}
            </div>

            {episode.overview && (
              <details className='[&[open]>summary]:text-primary-400 mt-1 text-[11px] text-gray-400'>
                <summary className='hover:text-primary-400 cursor-pointer text-[11px] text-gray-500 select-none'>
                  Description
                </summary>
                <p className='mt-0.5 border-l border-gray-700/50 pl-2 leading-relaxed'>{episode.overview}</p>
              </details>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
