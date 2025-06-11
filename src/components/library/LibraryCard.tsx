import { Link } from 'react-router';
import { useState } from 'react';
import { Button } from '@heroui/button';
import { Star, Heart, Calendar, Film, Tv, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useLibraryModal } from '@/context/useLibraryModal';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn, slugify } from '@/utils';

interface LibraryCardProps {
  item: LibraryMediaData;
  tabIndex?: number;
}

const getLink = (type: string, id: number, title: string) => {
  return `/${type === 'tv' ? 'tv' : 'movies'}/details/${id}-${slugify(title)}`;
};

export default function LibraryCard({ item, tabIndex = 0 }: LibraryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const { toggleFavorite, removeItem } = useLibraryStore();
  const { openModal } = useLibraryModal();

  const title = item.title || 'Untitled';
  const status = LIBRARY_MEDIA_STATUS.find((s) => s.value === item.status);
  const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
  const rating = item.userRating;

  const handleToggleFavorite = () => {
    toggleFavorite({ mediaType: item.mediaType, id: item.id });
  };

  const handleRemove = () => {
    removeItem(item.mediaType, item.id);
  };

  const handleEditStatus = () => {
    // Create a mock Media object for the modal
    const mockMedia: Media = {
      id: item.id,
      media_type: item.mediaType,
      title: item.title ?? 'Untitled',
      poster_path: item.posterPath ?? null,
      backdrop_path: null,
      overview: '',
      original_language: 'en',
      adult: false,
      popularity: 0,
      vote_average: 0,
      vote_count: 0,
      // Movie-specific fields
      original_title: item.title ?? 'Untitled',
      release_date: item.releaseDate ?? null,
      genre_ids: [],
      // TV-specific fields
      name: item.title ?? 'Untitled',
      original_name: item.title ?? 'Untitled',
      first_air_date: item.releaseDate ?? null,
      origin_country: [],
    } as Media;
    openModal(mockMedia);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        window.location.href = getLink(item.mediaType, item.id, title);
        break;
      case 'f':
      case 'F': {
        e.preventDefault();
        toggleFavorite({ mediaType: item.mediaType, id: item.id });
        break;
      }
      case 'e':
      case 'E': {
        e.preventDefault();
        const mockMedia: Media = {
          id: item.id,
          media_type: item.mediaType,
          title: item.title ?? 'Untitled',
          poster_path: item.posterPath ?? null,
          backdrop_path: null,
          overview: '',
          original_language: 'en',
          adult: false,
          popularity: 0,
          vote_average: 0,
          vote_count: 0,
          // Movie-specific fields
          original_title: item.title ?? 'Untitled',
          release_date: item.releaseDate ?? null,
          genre_ids: [],
          // TV-specific fields
          name: item.title ?? 'Untitled',
          original_name: item.title ?? 'Untitled',
          first_air_date: item.releaseDate ?? null,
          origin_country: [],
        } as Media;
        openModal(mockMedia);
        break;
      }
      case 'Delete':
      case 'Backspace': {
        e.preventDefault();
        removeItem(item.mediaType, item.id);
        break;
      }
      case 'Escape':
        setShowActions(false);
        (e.target as HTMLElement).blur?.();
        break;
    }
  };

  // Grid view only
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role='article'
      aria-label={`${title} - ${item.mediaType}`}
      className='group focus:ring-Primary-500/50 focus:border-Primary-500/50 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.08] shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20 focus:ring-2 focus:outline-none'
    >
      {/* Quick Actions */}
      <div className='absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100'>
        <Button
          isIconOnly
          size='sm'
          className={cn(
            'h-8 w-8 border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110',
            item.isFavorite
              ? 'border-red-400/50 bg-red-500/30 text-red-300 hover:bg-red-500/40'
              : 'border-white/30 bg-white/20 text-white hover:border-red-400/50 hover:bg-red-500/30 hover:text-red-300'
          )}
          onPress={handleToggleFavorite}
          aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('size-4', item.isFavorite && 'fill-current')} />
        </Button>

        <Button
          isIconOnly
          size='sm'
          className='h-8 w-8 border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-blue-400/50 hover:bg-blue-500/30 hover:text-blue-300'
          onPress={() => setShowActions(!showActions)}
          aria-label='More actions'
        >
          <MoreHorizontal className='size-4' />
        </Button>
      </div>

      {/* Actions Menu */}
      {showActions && (
        <div className='absolute top-14 right-3 z-30 min-w-[160px] rounded-lg border border-white/20 bg-black/80 shadow-xl backdrop-blur-md'>
          <div className='space-y-1 p-2'>
            <Button
              size='sm'
              variant='ghost'
              className='w-full justify-start text-white hover:bg-white/10'
              startContent={<Edit3 className='size-4' />}
              onPress={handleEditStatus}
            >
              Edit Status
            </Button>
            <Button
              size='sm'
              variant='ghost'
              className='w-full justify-start text-red-400 hover:bg-red-500/10'
              startContent={<Trash2 className='size-4' />}
              onPress={handleRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Poster Link */}
      <Link
        to={getLink(item.mediaType, item.id, title)}
        className='relative block aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'
      >
        <LazyImage
          src={item.posterPath ? `http://image.tmdb.org/t/p/w500${item.posterPath}` : '/images/placeholder.png'}
          alt={title}
          className={cn(
            'size-full object-cover transition-all duration-500 ease-out',
            isHovered ? 'scale-110' : 'scale-100'
          )}
        />

        {/* Gradients */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Media type badge */}
        <div className='absolute top-3 left-3 flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm'>
          {item.mediaType === 'movie' ? <Film className='size-3' /> : <Tv className='size-3' />}
          <span className='capitalize'>{item.mediaType}</span>
        </div>

        {/* Status badge */}
        {status && (
          <div
            className={cn(
              'absolute top-3 left-3 mt-8 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm',
              status.className
            )}
          >
            <status.icon className='size-3' />
            <span>{status.label}</span>
          </div>
        )}

        {/* Content overlay */}
        <div className='absolute inset-x-0 bottom-0 space-y-3 p-4'>
          <h3 className='line-clamp-2 text-lg leading-tight font-semibold text-white drop-shadow-lg'>{title}</h3>

          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2 text-white/80'>
              {rating && (
                <div className='flex items-center gap-1'>
                  <Star className='size-4 fill-yellow-400 text-yellow-400' />
                  <span>{rating}/10</span>
                </div>
              )}

              {releaseYear && (
                <>
                  {rating && <span className='text-white/40'>•</span>}
                  <div className='flex items-center gap-1'>
                    <Calendar className='size-3' />
                    <span>{releaseYear}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Genres */}
          {isHovered && item.genres && item.genres.length > 0 && (
            <div className='flex flex-wrap gap-1.5'>
              {item.genres.slice(0, 3).map((genre: string) => (
                <span
                  key={genre}
                  className='rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm'
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
