import { formatDate } from '@/utils';
import { motion } from 'motion/react';
import EpisodesList from './EpisodesList';

export default function SeasonDetails({ season, show }: { season: Season; show: TvShow }) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className='scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 max-h-[85vh] overflow-y-auto overflow-x-hidden px-1 py-2'>
      <motion.div
        className='flex flex-col gap-8 md:flex-row'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {/* Poster Image */}
        <motion.div className='shrink-0 md:w-1/3' variants={itemVariants}>
          <div className='relative aspect-2/3 w-full overflow-hidden rounded-2xl shadow-xl ring-2 ring-Primary-500/20'>
            <img
              src={
                season.poster_path ? `http://image.tmdb.org/t/p/w500${season.poster_path}` : '/images/placeholder.png'
              }
              alt={`${show.name}: ${season.name}`}
              className='h-full w-full object-cover transition-all duration-500 hover:scale-105'
            />
            <div className='absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 md:opacity-100'></div>
          </div>
        </motion.div>

        {/* Season Details */}
        <motion.div className='flex-1 space-y-8' variants={itemVariants}>
          <motion.div variants={itemVariants}>
            <h3 className='mb-4 text-4xl font-bold tracking-tight text-white'>
              <span className='text-Primary-400'>{show.name}</span>: {season.name}
            </h3>
            <div className='mb-5 flex flex-wrap gap-2'>
              {season.air_date && (
                <motion.span
                  className='inline-flex items-center rounded-full bg-Secondary-900 px-3 py-1 text-sm font-medium text-Secondary-300 ring-1 ring-Secondary-500/30'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-1 h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {formatDate(season.air_date)}
                </motion.span>
              )}
              <motion.span
                className='inline-flex items-center rounded-full bg-Tertary-900 px-3 py-1 text-sm font-medium text-Tertary-300 ring-1 ring-Tertary-500/30'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mr-1 h-4 w-4'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                    clipRule='evenodd'
                  />
                </svg>
                {season.episode_count} Episodes
              </motion.span>
              {season.vote_average > 0 && (
                <motion.span
                  className='inline-flex items-center rounded-full bg-yellow-900/30 px-3 py-1 text-sm font-medium text-yellow-300 ring-1 ring-yellow-500/30'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className='mr-1 text-yellow-400'>★</span>
                  {season.vote_average.toFixed(1)}
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Overview */}
          <motion.div
            className='space-y-4 rounded-xl bg-black/20 p-5 ring-1 ring-white/5 backdrop-blur-xs'
            variants={itemVariants}
          >
            <h4 className='text-xl font-semibold text-Primary-300'>Overview</h4>
            <p className='text-base leading-relaxed text-gray-300'>
              {season.overview || `No description available for ${season.name}.`}
            </p>
          </motion.div>

          {/* Episodes section */}
          {season.episodes && season.episodes.length > 0 && (
            <EpisodesList
              episodes={season.episodes}
              count={season.episodes.length}
              showName={show.name}
              seasonName={season.name}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
