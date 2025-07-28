import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import EpisodesList from './EpisodesList';
import { MorphingDialogContent } from '@/components/ui/MorphingDialog';
import { queryKeys } from '@/lib/react-query';
import { getTvShowSeasonDetails } from '@/lib/api/TMDB';
import { formatDate } from '@/utils';
import { containerVariants, itemVariants } from '@/lib/animations';
import { getTmdbImage } from '@/utils/media';

export default function SeasonDetails({ season, show }: { season: Season; show: TvShow }) {
  const { data: seasonWithEps, isLoading } = useQuery({
    queryKey: queryKeys.season(season.season_number),
    queryFn: () => getTvShowSeasonDetails(show.id, season.season_number),
    enabled: !!show.id,
    initialData: season,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!seasonWithEps) return null;

  return (
    <MorphingDialogContent className='bg-blur relative grid h-[80vh] w-full max-w-[80vw] grid-cols-[1fr_2.3fr] rounded-xl backdrop-blur-2xl'>
      <motion.div variants={itemVariants}>
        <div className='relative size-full overflow-hidden rounded-s-xl'>
          <img
            src={getTmdbImage(seasonWithEps, 'w500')}
            alt={`${show.name}: ${seasonWithEps.name}`}
            className='size-full object-cover transition-all duration-500 hover:scale-105'
          />
          <div className='absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 md:opacity-100'></div>
        </div>
      </motion.div>

      <motion.div className='flex min-h-0 flex-col space-y-5 p-6' variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <h3 className='text-2xl font-bold text-white'>
            {seasonWithEps.name}
            <span className='ml-1 text-xl font-semibold text-gray-300'>• {show.name}</span>
          </h3>
          <div className='mt-3 flex flex-wrap gap-2'>
            {seasonWithEps.air_date && (
              <motion.span
                className='bg-Secondary-900 text-Secondary-300 ring-Secondary-500/30 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1'
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
                {formatDate(seasonWithEps.air_date)}
              </motion.span>
            )}
            <motion.span
              className='bg-Tertiary-900 text-Tertiary-300 ring-Tertiary-500/30 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='mr-1 h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                  clipRule='evenodd'
                />
              </svg>
              {seasonWithEps.episodes?.length || 'N/A'} Episodes
            </motion.span>
            {seasonWithEps.vote_average > 0 && (
              <motion.span
                className='inline-flex items-center rounded-full bg-yellow-900/30 px-3 py-1 text-xs font-medium text-yellow-300 ring-1 ring-yellow-500/30'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className='mr-1 text-yellow-400'>★</span>
                {seasonWithEps.vote_average.toFixed(1)}
              </motion.span>
            )}
          </div>
        </motion.div>
        {seasonWithEps.overview && (
          <motion.div variants={itemVariants}>
            <h4 className='mb-2 text-base font-medium tracking-wider text-gray-400 uppercase'>Overview</h4>
            <div className='mt-1 rounded-md bg-white/5 p-2 transition-all hover:border-gray-700 hover:bg-gray-800/40'>
              <p className='text-sm leading-relaxed text-gray-300'>{seasonWithEps.overview}</p>
            </div>
          </motion.div>
        )}
        <div className='bg-border h-px'></div>
        {seasonWithEps.episodes && seasonWithEps.episodes.length > 0 && (
          <motion.div variants={itemVariants} className='flex min-h-0 flex-1 flex-col'>
            <h4 className='mb-2 text-base font-medium tracking-wider text-gray-400 uppercase'>Episodes</h4>
            <div className='min-h-0 flex-1 overflow-auto'>
              <EpisodesList episodes={seasonWithEps.episodes} />
            </div>
          </motion.div>
        )}
      </motion.div>
    </MorphingDialogContent>
  );
}
