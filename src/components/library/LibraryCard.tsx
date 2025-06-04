import { Link } from 'react-router';
import { LazyImage } from '@/components/ui/LazyImage';
import { Star, CheckCircle, Clock, Eye, AlertOctagon, XCircle, Film as MovieIcon, Tv as TvIcon, Heart } from 'lucide-react';
import { slugify } from '@/utils';

interface LibraryCardProps {
  item: UserMediaData;
  viewMode: 'grid' | 'list';
}

const getStatusIconAndColor = (status: UserMediaData['status']) => {
  switch (status) {
    case 'watched':
      return { icon: <CheckCircle className='size-3' />, color: 'text-green-400', label: 'Completed', bgColor: 'bg-green-500/20' };
    case 'watching':
      return { icon: <Clock className='size-3' />, color: 'text-blue-400', label: 'Watching', bgColor: 'bg-blue-500/20' };
    case 'will-watch':
      return { icon: <Eye className='size-3' />, color: 'text-purple-400', label: 'Plan to Watch', bgColor: 'bg-purple-500/20' };
    case 'on-hold':
      return { icon: <AlertOctagon className='size-3' />, color: 'text-yellow-400', label: 'On Hold', bgColor: 'bg-yellow-500/20' };
    case 'dropped':
      return { icon: <XCircle className='size-3' />, color: 'text-red-400', label: 'Dropped', bgColor: 'bg-red-500/20' };
    default:
      return { icon: null, color: '', label: '', bgColor: '' };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function LibraryCard({ item, viewMode }: LibraryCardProps) {
  const title = item.title || 'Untitled';
  const posterPath = item.posterPath;
  const year = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
  const tmdbId = item.id;
  const mediaType = item.mediaType;

  const titleSlug = slugify(title);
  const linkHref = `/${mediaType === 'movie' ? 'movies' : 'tv'}/details/${tmdbId}-${titleSlug}`;

  const statusInfo = getStatusIconAndColor(item.status);

  if (viewMode === 'list') {
    return (
      <div className='group flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:shadow-xl'>
        <Link to={linkHref} className='shrink-0'>
          <div className='aspect-[2/3] w-20 overflow-hidden rounded-lg bg-white/10 md:w-24'>
            <LazyImage
              src={posterPath ? `http://image.tmdb.org/t/p/w342${posterPath}` : '/images/placeholder.png'}
              alt={title}
              className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
          </div>
        </Link>
        
        <div className='flex flex-1 flex-col justify-between overflow-hidden py-1'>
          <div>
            <Link to={linkHref} className='block'>
              <h3 className='mb-1 truncate text-base font-semibold text-Primary-50 transition-colors hover:text-Primary-200 md:text-lg'>
                {title}
              </h3>
            </Link>
            
            <div className='mb-2 flex items-center gap-2 text-xs text-Grey-300'>
              {year && <span>{year}</span>}
              {year && <span className='opacity-50'>•</span>}
              {mediaType === 'movie' ? <MovieIcon className='size-3.5' /> : <TvIcon className='size-3.5' />}
              <span className='capitalize'>{mediaType === 'movie' ? 'Movie' : 'TV Show'}</span>
              {item.genres && item.genres.length > 0 && (
                <>
                  <span className='opacity-50'>•</span>
                  <span className='truncate'>{item.genres.slice(0, 2).join(', ')}</span>
                </>
              )}
            </div>

            {item.lastWatchedEpisode && mediaType === 'tv' && (
              <div className='mb-2 text-xs text-Grey-400'>
                Last watched: S{item.lastWatchedEpisode.seasonNumber}E{item.lastWatchedEpisode.episodeNumber}
                {item.lastWatchedEpisode.watchedAt && (
                  <span className='ml-1'>• {formatDate(item.lastWatchedEpisode.watchedAt)}</span>
                )}
              </div>
            )}

            {item.notes && (
              <p className='line-clamp-2 text-xs text-Grey-400 italic'>"{item.notes}"</p>
            )}
          </div>

          <div className='mt-3 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              {item.isFavorite && (
                <div className='flex items-center gap-1 text-red-400' title='Favorite'>
                  <Heart className='size-3 fill-current' />
                </div>
              )}
              
              {item.userRating && (
                <div className='flex items-center gap-1 text-yellow-400' title={`Your rating: ${item.userRating}/10`}>
                  <Star className='size-3 fill-current' />
                  <span className='text-xs font-medium'>{item.userRating}</span>
                </div>
              )}

              {statusInfo.icon && statusInfo.label && (
                <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${statusInfo.color} ${statusInfo.bgColor}`}>
                  {statusInfo.icon}
                  <span>{statusInfo.label}</span>
                </div>
              )}
            </div>

            <div className='text-xs text-Grey-500'>
              Added {formatDate(item.addedToLibraryAt)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className='group relative block overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-xl'>
      <Link to={linkHref} className='block aspect-[2/3]'>
        <LazyImage
          src={posterPath ? `http://image.tmdb.org/t/p/w500${posterPath}` : '/images/placeholder.png'}
          alt={title}
          className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
      </Link>

      {/* Status Badge */}
      {item.status !== 'none' && statusInfo.icon && (
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs backdrop-blur-md ${statusInfo.color} ${statusInfo.bgColor} border border-current/20`}
          title={`Status: ${statusInfo.label}`}
        >
          {statusInfo.icon}
        </div>
      )}

      {/* Favorite Badge */}
      {item.isFavorite && (
        <div className='absolute top-3 left-3 rounded-full bg-red-500/20 p-1.5 backdrop-blur-md border border-red-400/20'>
          <Heart className='size-3 fill-red-400 text-red-400' />
        </div>
      )}

      {/* Rating Badge */}
      {item.userRating && (
        <div className='absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs backdrop-blur-md border border-yellow-400/20'>
          <Star className='size-3 fill-yellow-400 text-yellow-400' />
          <span className='font-medium text-yellow-400'>{item.userRating}</span>
        </div>
      )}

      {/* Title overlay on hover */}
      <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
        <Link to={linkHref}>
          <h3 className='line-clamp-2 text-sm font-semibold leading-tight text-white drop-shadow-sm'>
            {title}
          </h3>
        </Link>
        <div className='mt-1 flex items-center justify-between text-xs text-grey-300'>
          <span>{year || 'N/A'}</span>
          <span className='capitalize'>{mediaType}</span>
        </div>
      </div>
    </div>
  );
}