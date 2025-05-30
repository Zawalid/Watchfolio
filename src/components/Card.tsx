import { Link } from 'react-router';
import { getMediaType, getRating, getReleaseYear } from '@/utils/media';
import { slugify } from '@/utils';
import { GENRES } from '@/lib/api/TMDB/values';
import LazyImage from '@/components/ui/LazyImage';
import CardActions from './CardActions';

const getLink = (type: string, id: number, title: string) => {
  return `/${type === 'tv' ? 'tv' : 'movies'}/details/${id}-${slugify(title)}`;
};

export default function Card({ media }: { media: TvShow | Movie }) {
  const { id, poster_path, vote_average, genre_ids } = media;
  const type = getMediaType(media);
  const title = type === 'movie' ? (media as Movie).title : (media as TvShow).name;

  return (
    <div className='group relative flex flex-col'>
      <CardActions media={{ ...media, media_type: type }} />
      <Link to={getLink(type, id, title)} className='mb-3 w-full rounded-2xl'>
        <div className='relative h-[220px] w-full overflow-hidden rounded-2xl shadow-lg md:h-[250px] lg:h-[300px]'>
          <LazyImage
            src={poster_path ? `http://image.tmdb.org/t/p/w500${poster_path}` : '/images/placeholder.png'}
            alt={title}
            className='size-full object-cover object-center transition-transform duration-300 group-hover:scale-110'
          />
        </div>
      </Link>
      <div className='mb-2 flex items-center justify-between gap-1'>
        <Link
          to={getLink(type, id, title)}
          className='text-Primary-50 hover:text-Primary-200 mb-1 line-clamp-1 cursor-pointer text-sm text-ellipsis sm:mb-2 md:text-base'
        >
          {title}
        </Link>
        <p className='text-Grey-300 text-xs md:text-sm'>{getReleaseYear(media) || 'N/A'}</p>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-Grey-300 line-clamp-1 text-xs text-ellipsis md:text-sm'>
          {genre_ids?.length ? genre_ids?.map((id) => GENRES.find((g) => g.id === id)?.name).join(', ') : 'N/A'}
        </p>
        <div className='flex items-center justify-between space-x-1'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='-mt-[3px] w-3 text-yellow-500 md:w-4 dark:text-yellow-600'
          >
            <path
              d='M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z'
              fill='currentColor'
              strokeWidth='0'
            ></path>
          </svg>
          <p className='text-xs text-slate-600 md:text-sm dark:text-zinc-400'>{getRating(vote_average || 0)}</p>
        </div>
      </div>
    </div>
  );
}
