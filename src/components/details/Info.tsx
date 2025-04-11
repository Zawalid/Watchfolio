import { LANGUAGES } from '@/lib/api/values';
import { getMediaType, getRating, getReleaseYear } from '@/utils';
import { STAR_ICON } from '@/components/ui/Icons';
import LazyImage from '../ui/LazyImage';

/* 
Watch Now : https://broflix.ci/tv/id | https://broflix.ci/movies/id
*/

export default function Info({ media }: { media: TvShowDetails | MovieDetails }) {
  const { vote_average, backdrop_path, poster_path, overview, original_language, genres } = media;
  const type = getMediaType(media);

  const title = type === 'movie' ? (media as MovieDetails).title : (media as TvShowDetails).name;
  const original_title =
    type === 'movie' ? (media as MovieDetails).original_title : (media as TvShowDetails).original_name;

  return (
    <section className='h-screen'>
      <div className='absolute top-[70px] inset-0'>
        <div
          className='size-full bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: `url("http://image.tmdb.org/t/p/original${backdrop_path}")`,
          }}
        />
        <div className='absolute inset-0 bg-linear-to-b from-transparent via-black/80 to-black' />
      </div>
      <div className='relative container z-10 flex h-full items-end'>
        <div className='w-full max-w-7xl pb-20'>
          <div className='flex flex-col-reverse gap-6 md:flex-row md:gap-8'>
            <div className="relative aspect-[2/3] w-full max-w-[250px] overflow-hidden rounded-lg shadow-xl">
              <LazyImage
                src={poster_path ? `http://image.tmdb.org/t/p/original${poster_path}` : '/images/placeholder.png'}
                alt={title}
                className='size-full object-cover'
              />
            </div>

            <div className='flex flex-1 flex-col gap-3'>
              <div className='space-y-2'>
                <h1 className='text-3xl leading-none font-bold text-white md:text-4xl'>{title}</h1>
                <div className='flex flex-wrap items-center gap-x-2 gap-y-2'>
                  <span className='text-sm text-gray-300'>{getReleaseYear(media)}</span>
                  <span className='text-gray-300'>●</span>
                  <span className='text-sm text-gray-300'>
                    {LANGUAGES.find((l) => l.iso_639_1 === original_language)?.english_name}
                  </span>
                  <span className='text-gray-300'>●</span>
                  <Rating rating={Number(getRating(vote_average))} />
                  {original_title !== title && (
                    <>
                      <span className='text-gray-300'>●</span>
                      <span className='text-sm text-gray-300'>{original_title}</span>
                    </>
                  )}
                </div>
              </div>
              <Genres genres={genres} />
              <div className='max-w-prose'>
                <p className='text-base leading-relaxed text-gray-300'>{overview}</p>
              </div>

              {type === 'movie' ? (
                <MovieDetails details={media as MovieDetails} />
              ) : (
                <TvShowDetails details={media as TvShowDetails} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MovieDetails({ details }: { details: MovieDetails }) {
  const { release_date, runtime } = details;

  return (
    <div className='mt-6 space-y-4'>
      <div className='flex flex-col gap-y-2 text-sm'>
        <div className='flex items-center gap-2'>
          <span className='text-gray-400'>Release Date</span>
          <span className='text-gray-200'>{release_date}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-gray-400'>Run time</span>
          <span className='text-gray-200'>{Number(runtime) ? `${runtime} min` : 'N/A'} </span>
        </div>
      </div>
    </div>
  );
}

function TvShowDetails({ details }: { details: TvShowDetails }) {
  const { status, first_air_date, last_air_date, number_of_seasons, number_of_episodes, episode_run_time } = details;

  return (
    <div className='mt-6 space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='space-y-3'>
          <h3 className='text-sm font-medium text-gray-400'>Broadcast Information</h3>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center gap-2'>
              <span className='text-gray-400'>Status</span>
              <span className='text-gray-200'>{status}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-400'>First Aired</span>
              <span className='text-gray-200'>{first_air_date}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-400'>Last Aired</span>
              <span className='text-gray-200'>{last_air_date}</span>
            </div>
          </div>
        </div>
        <div className='space-y-3'>
          <h3 className='text-sm font-medium text-gray-400'>Series Details</h3>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center gap-2'>
              <span className='text-gray-400'>Seasons</span>
              <span className='text-gray-200'>{number_of_seasons}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-400'>Episodes</span>
              <span className='text-gray-200'>{number_of_episodes}</span>
            </div>
            {!!Number(episode_run_time) && (
              <div className='flex items-center gap-2'>
                <span className='text-gray-400'>Episode Length</span>
                <span className='text-gray-200'>{Number(episode_run_time)} min</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Genres({ genres }: { genres: { id: number; name: string }[] }) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      {genres.map((g) => (
        <span
          key={g.id}
          className='rounded-md bg-white/10 px-2.5 py-0.5 text-sm text-nowrap text-gray-200 backdrop-blur-xs'
        >
          {g.name}
        </span>
      ))}
    </div>
  );
}

function Rating({ rating, className = '' }: { rating: number; className?: string }) {
  const getBgColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-500/90';
    if (rating >= 7) return 'bg-emerald-400/90';
    if (rating >= 6) return 'bg-yellow-500/90';
    if (rating >= 5) return 'bg-orange-500/90';
    return 'bg-red-500/90';
  };

  return (
    <div
      className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-sm text-white [&>svg]:!size-4 ${getBgColor(rating)} ${className}`}
    >
      {STAR_ICON}
      <span className='font-medium'>{rating}</span>
    </div>
  );
}
