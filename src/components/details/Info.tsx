import { motion } from 'framer-motion';
import { LANGUAGES } from '@/lib/api/TMDB/values';
import { STAR_ICON } from '@/components/ui/Icons';
import { LazyImage } from '@/components/ui/LazyImage';
import { getDirectorOrCreator, getFormattedRuntime, getMediaType, getRating, getReleaseYear } from '@/utils/media';
import ActionButtons from './ActionButtons';

export default function Info({ media }: { media: Media }) {
  const { vote_average, poster_path, genres } = media;
  const type = getMediaType(media);

  const title = type === 'movie' ? (media as Movie).title : (media as TvShow).name;

  return (
    <div className='min-h-[700px] flex-1 py-4 pt-16'>
      <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
        {/* Left Column - Poster & Actions */}
        <div className='flex flex-col gap-3'>
          <motion.div
            className='group ring-Primary-500/20 relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-xl shadow-2xl ring-1'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LazyImage
              src={poster_path ? `http://image.tmdb.org/t/p/original${poster_path}` : '/images/placeholder.png'}
              alt={title}
              className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
          </motion.div>

          <ActionButtons media={media} onPlayTrailer={() => {}} />
        </div>

        {/* Right Column - Info */}
        <motion.div
          className='flex-1'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Title & Meta */}
          <div className='mb-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Rating rating={Number(getRating(vote_average))} />
              <motion.span className='bg-Secondary-900/80 text-Secondary-300 ring-Secondary-500/30 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                <svg xmlns='http://www.w3.org/2000/svg' className='mr-1 size-4' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                    clipRule='evenodd'
                  />
                </svg>
                {getReleaseYear(media, 'full')}
              </motion.span>
              <motion.span className='bg-Tertiary-900/80 text-Tertiary-300 ring-Tertiary-500/30 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                <svg xmlns='http://www.w3.org/2000/svg' className='mr-1 size-4' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                    clipRule='evenodd'
                  />
                </svg>
                {getFormattedRuntime(media)}
              </motion.span>
            </div>
            <h1 className='mb-5 text-2xl font-bold text-white lg:text-3xl'>{title}</h1>
            <div className='flex flex-wrap gap-2'>
              {genres.map((genre, index) => (
                <motion.span
                  key={genre.id}
                  className='rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300 backdrop-blur-md transition-all duration-200 hover:bg-white/10'
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

          <p className='text-base leading-relaxed text-gray-300'>{media.overview || 'No overview available.'}</p>
          <Details media={media} />
        </motion.div>
      </div>
    </div>
  );
}

function Rating({ rating }: { rating: number }) {
  const getBgColor = (rating: number) => {
    if (rating >= 8) return 'bg-Success-500/20 border-Success-500/50 text-Success-400 ring-Success-500/30';
    if (rating >= 7) return 'bg-Success-500/20 border-Success-500/50 text-Success-400 ring-Success-500/30';
    if (rating >= 6) return 'bg-Warning-500/20 border-Warning-500/50 text-Warning-400 ring-Warning-500/30';
    if (rating >= 5) return 'bg-Warning-500/20 border-Warning-500/50 text-Warning-400 ring-Warning-500/30';
    return 'bg-Error-500/20 border-Error-500/50 text-Error-400 ring-Error-500/30';
  };

  return (
    <motion.div
      className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md ${getBgColor(rating)}`}
    >
      {STAR_ICON}
      <span>{rating}</span>
    </motion.div>
  );
}

function Details({ media }: { media: Media }) {
  const type = getMediaType(media);
  const directorOrCreator = getDirectorOrCreator(media);

  return (
    <div className='mt-4 space-y-4 border-t border-white/10 pt-4'>
      <div className='flex gap-12'>
        <div>
          <h4 className='mb-1 text-xs font-medium text-gray-400'>Status</h4>
          <p className='pill-bg text-sm text-gray-200'>
            {getMediaType(media) === 'tv' ? (media as TvShow).status : 'Released'}
          </p>
        </div>

        <div>
          <h4 className='mb-1 text-xs font-medium text-gray-400'>Language</h4>
          <p className='pill-bg text-sm text-gray-200'>
            {LANGUAGES.find((lang) => lang.iso_639_1 === media.original_language)?.name || 'Unknown'}
          </p>
        </div>
      </div>
      <div className='flex gap-12'>
        <div>
          <h4 className='mb-1 text-xs font-medium text-gray-400'>Production Countries</h4>
          <div className='flex flex-wrap gap-2'>
            {media.production_countries?.slice(0, 4).map((country) => (
              <div key={country.iso_3166_1} className='pill-bg flex items-center gap-2 text-sm text-gray-300'>
                <span>{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className='mb-1 text-xs font-medium text-gray-400'>Production Companies</h4>
          <div className='flex flex-wrap gap-2'>
            {media.production_companies?.slice(0, 4).map((company) => (
              <div key={company.id} className='pill-bg flex items-center gap-2 text-sm text-gray-300'>
                <span>{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h4 className='mb-1 text-xs font-medium text-gray-400'>{type === 'movie' ? 'Director' : 'Creator'}</h4>
        <div className='pill-bg flex w-fit items-center gap-2.5 overflow-hidden py-0 pl-0 [&>div]:size-8'>
          <LazyImage
            src={
              directorOrCreator?.profile_path
                ? `http://image.tmdb.org/t/p/w200${directorOrCreator?.profile_path}`
                : '/images/placeholder-person.png'
            }
            alt={directorOrCreator?.name || 'Unknown'}
            className='rounded-e-l size-full object-cover'
          />
          <span className='text-sm text-gray-200'>{directorOrCreator?.name}</span>
        </div>
      </div>
    </div>
  );
}

// function ActionButtons() {
//   return (
//     <motion.div
//       className='flex w-full flex-col gap-2'
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: 0.1 }}
//     >
//       {/* Will probably redirect to https://broflix.ci/ */}
//       {/* <Button
//         color='primary'
//         isDisabled
//         className='transition-all! duration-200 hover:scale-105'
//         startContent={<Play className='size-4' />}
//       >
//         Watch Now
//       </Button> */}
//       <Button className='button-secondary' isDisabled startContent={<Play className='size-4' />}>
//         Watch Trailer
//       </Button>
//       <div className="grid grid-cols-2 gap-2">

//       <Button className='button-secondary' isDisabled startContent={<Heart className='size-4' />}>
//         Favorite
//       </Button>
//       <Button className='button-secondary' isDisabled startContent={<Bookmark className='size-4' />}>
//         Watch Later
//       </Button>
//       </div>
//     </motion.div>
//   );
// }
