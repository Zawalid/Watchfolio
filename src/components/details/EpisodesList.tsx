import { formatDate } from '@/utils';
import { motion } from 'motion/react';

interface EpisodesListProps {
  episodes: Episode[];
  count: number;
  showName: string;
  seasonName: string;
}

export default function EpisodesList({ episodes, count, showName, seasonName }: EpisodesListProps) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className='p-6 text-center text-gray-400'>
        <p>No episodes available for this season.</p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const episodeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    }),
  };

  return (
    <div className='scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 max-h-[85vh] overflow-y-auto overflow-x-hidden px-4 py-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-white'>
          <span className='text-Primary/400'>{showName}</span>: {seasonName} Episodes
        </h2>
        <span className='text-sm font-medium text-Primary/400'>
          {episodes.length} {episodes.length === 1 ? 'Episode' : 'Episodes'}
        </span>
      </div>

      <motion.div className='space-y-4' variants={containerVariants} initial='hidden' animate='visible'>
        {episodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            custom={index}
            variants={episodeVariants}
            className='group relative overflow-hidden rounded-lg bg-white/5 p-5 transition-all hover:bg-Primary/900/30 hover:ring-1 hover:ring-Primary/500/30'
            whileHover={{ y: -2 }}
          >
            <div className='flex flex-col gap-4 sm:flex-row'>
              {/* Episode still image */}
              {episode.still_path && (
                <div className='relative aspect-video w-full overflow-hidden rounded-lg sm:w-1/3 lg:w-1/4'>
                  <img
                    src={`http://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={`${episode.name} - Episode ${episode.episode_number}`}
                    className='h-full w-full object-cover transition-all duration-500 hover:scale-105'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw'
                  />
                </div>
              )}

              {/* Episode details */}
              <div className='flex-1 space-y-3'>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-full bg-Primary/500/20 text-sm font-semibold text-Primary/300'>
                    {episode.episode_number}
                  </span>
                  <h3 className='text-xl font-medium text-white transition-colors group-hover:text-Primary/300'>
                    {episode.name}
                  </h3>
                </div>

                <div className='flex flex-wrap gap-2'>
                  {episode.air_date && (
                    <span className='inline-flex items-center rounded-full bg-Secondary/900 px-2.5 py-0.5 text-xs font-medium text-Secondary/300 ring-1 ring-Secondary/500/30'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='mr-1 h-3 w-3'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                          clipRule='evenodd'
                        />
                      </svg>
                      {formatDate(episode.air_date)}
                    </span>
                  )}

                  {episode.runtime && (
                    <span className='inline-flex items-center rounded-full bg-Tertary/900 px-2.5 py-0.5 text-xs font-medium text-Tertary/300 ring-1 ring-Tertary/500/30'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='mr-1 h-3 w-3'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                          clipRule='evenodd'
                        />
                      </svg>
                      {episode.runtime} min
                    </span>
                  )}

                  {episode.vote_average > 0 && (
                    <span className='inline-flex items-center rounded-full bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-300 ring-1 ring-yellow-500/30'>
                      <span className='mr-1 text-yellow-400'>★</span>
                      {episode.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>

                {episode.overview && (
                  <p className='line-clamp-3 text-sm text-gray-300 transition-all group-hover:line-clamp-none'>
                    {episode.overview}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
