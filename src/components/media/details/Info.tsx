import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { LANGUAGES, NETWORKS } from '@/utils/constants/TMDB';
import { LazyImage } from '@/components/ui/LazyImage';
import {
  getDirectorOrCreator,
  getFormattedRuntime,
  getMediaType,
  getRating,
  getReleaseYear,
  getTmdbImage,
} from '@/utils/media';
import ActionButtons from './ActionButtons';
import { slugify } from '@/utils';
import { Rating } from '@/components/ui/Rating';
import NetworkCard from '@/pages/networks/NetworkCard';

interface InfoProps {
  media: Media;
}

export default function Info({ media }: InfoProps) {
  const { vote_average, genres } = media;
  const type = getMediaType(media);

  const title = type === 'movie' ? (media as Movie).title : (media as TvShow).name;

  return (
    <div className='flex-1'>
      {/* Cinematic backdrop hero - Mobile only */}
      <div className='relative -mx-4 -mt-15 h-[65vh] min-h-[400px] w-screen overflow-hidden sm:hidden'>
        <motion.div
          className='absolute inset-0 w-full'
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <LazyImage
            src={getTmdbImage(media, 'original', true)}
            alt={title}
            className='size-full object-cover object-center'
          />
        </motion.div>

        {/* Multi-layer gradient for seamless background merge */}
        <div className='from-Grey-900 via-Grey-900/80 absolute inset-0 bg-gradient-to-t to-transparent'></div>
        <div className='to-Grey-900/60 absolute inset-0 bg-gradient-to-b from-transparent via-transparent'></div>
        <div className='from-Grey-900 via-Grey-900/95 absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t to-transparent'></div>
        <div className='bg-Grey-900 absolute right-0 bottom-0 left-0 h-16'></div>

        {/* Content overlay */}
        <div className='absolute inset-0 flex flex-col justify-end p-4 pb-8'>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='space-y-3'
          >
            <div className='flex items-center gap-2'>
              <Rating rating={Number(getRating(vote_average))} />
              <div className='flex items-center gap-2'>
                <span className='bg-Secondary-900/80 text-Secondary-300 ring-Secondary-500/30 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 backdrop-blur-md'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-1 size-3'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {getReleaseYear(media, 'full')}
                </span>
                <span className='bg-Tertiary-900/80 text-Tertiary-300 ring-Tertiary-500/30 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 backdrop-blur-md'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-1 size-3'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {getFormattedRuntime(media)}
                </span>
              </div>
            </div>

            <h1 className='heading gradient text-3xl leading-tight font-bold'>{title}</h1>

            <div className='flex flex-wrap gap-1.5'>
              {genres?.slice(0, 3).map((genre, index) => (
                <motion.span
                  key={genre.id}
                  className='flex min-h-[28px] items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  {genre.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile actions section */}
      <div className='relative z-10 -mt-4 sm:hidden'>
        <ActionButtons media={{ ...media, media_type: type }} />
      </div>

      <div className='min-h-[300px] py-6 sm:min-h-[600px] sm:px-0 sm:py-4 sm:pt-12 lg:min-h-[700px] lg:pt-16'>
        <div className='flex flex-col gap-6 sm:flex-row sm:gap-6 lg:gap-8'>
          {/* Desktop Left Column - Poster & Actions */}
          <div className='hidden flex-col gap-3 sm:flex'>
            <motion.div
              className='group ring-Primary-500/20 relative mx-auto aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-xl shadow-2xl ring-1 md:max-w-[260px] lg:mx-0 lg:max-w-[300px]'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <LazyImage
                src={getTmdbImage(media, 'original')}
                alt={title}
                className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
            </motion.div>

            <div className='mx-auto w-full max-w-[240px] lg:mx-0 lg:max-w-[300px]'>
              <ActionButtons media={{ ...media, media_type: type }} />
            </div>
          </div>

          {/* Right Column - Info */}
          <motion.div
            className='min-w-0 flex-1'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Desktop Title & Meta - Hidden on mobile since it's in hero */}
            <div className='mb-4 hidden sm:mb-6 sm:block'>
              <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
                <div className='w-fit'>
                  <Rating rating={Number(getRating(vote_average))} />
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                  <motion.span className='bg-Secondary-900/80 text-Secondary-300 ring-Secondary-500/30 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='mr-1 size-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {getReleaseYear(media, 'full')}
                  </motion.span>
                  <motion.span className='bg-Tertiary-900/80 text-Tertiary-300 ring-Tertiary-500/30 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='mr-1 size-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {getFormattedRuntime(media)}
                  </motion.span>
                </div>
              </div>
              <h1 className='heading gradient mb-5 text-3xl lg:text-4xl'>{title}</h1>
              <div className='flex flex-wrap gap-2'>
                {genres?.map((genre, index) => (
                  <motion.span
                    key={genre.id}
                    className='flex min-h-[32px] items-center rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {genre.name}
                  </motion.span>
                ))}
              </div>
            </div>

            <p className='mb-4 text-sm leading-relaxed text-gray-300 sm:mb-6 sm:text-base'>
              {media.overview || 'No overview available.'}
            </p>
            <Details media={media} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Details({ media }: { media: Media }) {
  const type = getMediaType(media);
  const directorOrCreator = getDirectorOrCreator(media);

  const tvShowNetworks =
    'networks' in media && media.networks
      ? (media.networks
          .map((tvNetwork) => NETWORKS.find((network) => network.id === tvNetwork.id))
          .filter(Boolean)
          .slice(0, 4) as Network[])
      : [];

  return (
    <div className='mt-4 space-y-4 border-t border-white/10 pt-4 sm:space-y-6'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-12'>
        <div>
          <h4 className='mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase'>Status</h4>
          <p className='pill-bg text-sm w-fit text-gray-200'>
            {getMediaType(media) === 'tv' ? (media as TvShow).status : 'Released'}
          </p>
        </div>

        <div>
          <h4 className='mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase'>Language</h4>
          <p className='pill-bg text-sm w-fit text-gray-200'>
            {LANGUAGES.find((lang) => lang.iso_639_1 === media.original_language)?.name || 'Unknown'}
          </p>
        </div>
      </div>

      <div className='space-y-4 sm:space-y-6'>
        <div>
          <h4 className='mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase'>Production Countries</h4>
          <div className='flex flex-wrap gap-1.5 sm:gap-2'>
            {media.production_countries?.slice(0, 4).map((country) => (
              <div
                key={country.iso_3166_1}
                className='pill-bg flex items-center gap-2 text-xs text-gray-300 sm:text-sm'
              >
                <span>{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className='mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase'>Production Companies</h4>
          <div className='flex flex-wrap gap-1.5 sm:gap-2'>
            {media.production_companies?.slice(0, 4).map((company) => (
              <div key={company.id} className='pill-bg flex items-center gap-2 text-xs text-gray-300 sm:text-sm'>
                <span>{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Networks section for TV shows */}
      {tvShowNetworks.length > 0 && (
        <div>
          <h4 className='mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase'>Networks</h4>
          <div className='flex flex-wrap gap-2'>
            {tvShowNetworks.map((network) => (
              <NetworkCard
                key={network.id}
                network={network}
                className='min-h-20 h-14'
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className='mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase'>
          {type === 'movie' ? 'Director' : 'Creator'}
        </h4>
        <Link
          to={
            directorOrCreator?.name ? `/celebrities/${directorOrCreator?.id}-${slugify(directorOrCreator?.name)}` : ''
          }
          className='pill-bg flex min-h-[44px] w-fit items-center gap-2 overflow-hidden py-0 pl-0 sm:gap-2.5 [&>div]:size-8 sm:[&>div]:size-10'
        >
          <LazyImage
            src={getTmdbImage(directorOrCreator, 'w200')}
            alt={directorOrCreator?.name || 'Unknown'}
            className='rounded-e-l size-full object-cover'
          />
          <span className='pr-3 text-xs text-gray-200 sm:text-sm'>{directorOrCreator?.name}</span>
        </Link>
      </div>
    </div>
  );
}
