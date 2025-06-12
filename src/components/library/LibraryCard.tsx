import { Link } from 'react-router';
import { useState } from 'react';
import { Button } from '@heroui/button';
import { Star, Heart, Calendar, Film, Tv, Trash2, Edit3 } from 'lucide-react';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useLibraryModal } from '@/hooks/useLibraryModal';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn, slugify } from '@/utils';

interface LibraryCardProps {
  item: LibraryMedia;
  tabIndex?: number;
}

const getLink = (type: string, id: number, title: string) => {
  return `/${type === 'tv' ? 'tv' : 'movies'}/details/${id}-${slugify(title)}`;
};

export default function LibraryCard({ item, tabIndex = 0 }: LibraryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { toggleFavorite, removeItem } = useLibraryStore();
  const { openModal } = useLibraryModal();
  const { confirm } = useConfirmationModal();

  const title = item.title || 'Untitled';
  const status = LIBRARY_MEDIA_STATUS.find((s) => s.value === item.status);
  const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;

  const handleToggleFavorite = () => toggleFavorite({ media_type: item.media_type, id: item.id });
  const handleRemove = async () => {
    const confirmed = await confirm({
      title: 'Remove from Library',
      message: `Are you sure you want to remove "${item.title || 'this item'}" from your library?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      confirmVariant: 'danger',
      confirmationKey: 'remove_media',
    });

    if (confirmed) {
      removeItem(item.media_type, item.id);
    }
  };
  const handleEditStatus = () => openModal(item);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        window.location.href = getLink(item.media_type, item.id, title);
        break;
      case 'f':
      case 'F': {
        e.preventDefault();
        handleToggleFavorite();
        break;
      }
      case 'e':
      case 'E': {
        e.preventDefault();
        handleEditStatus();
        break;
      }
      case 'Delete':
      case 'Backspace': {
        e.preventDefault();
        handleRemove();
        break;
      }
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role='article'
      aria-label={`${title} - ${item.media_type}`}
      className='group focus:ring-Primary-500/50 focus:border-Primary-500/50 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.08] shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20 focus:ring-2 focus:outline-none'
    >
      {/* Quick Actions */}
      <div className='absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100'>
        <Button
          isIconOnly
          size='sm'
          className={cn(
            'border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110',
            item.isFavorite
              ? 'border-pink-400/50 bg-pink-500/30 text-pink-300 hover:bg-pink-500/40'
              : 'border-white/30 bg-white/20 text-white hover:border-pink-400/50 hover:bg-pink-500/30 hover:text-pink-300'
          )}
          onPress={handleToggleFavorite}
          aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('size-4', item.isFavorite && 'fill-current')} />
        </Button>

        <Button
          isIconOnly
          size='sm'
          className='border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-blue-400/50 hover:bg-blue-500/30 hover:text-blue-300'
          onPress={handleEditStatus}
          aria-label='More actions'
        >
          <Edit3 className='size-4' />
        </Button>

        <Button
          isIconOnly
          size='sm'
          className='border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-red-400/50 hover:bg-red-500/30 hover:text-red-300'
          onPress={handleRemove}
          aria-label='More actions'
        >
          <Trash2 className='size-4' />
        </Button>
      </div>

      <div className='absolute top-3 left-3 z-20 flex flex-col items-start gap-2 opacity-100 transition-all duration-200 group-hover:z-0 group-hover:opacity-0'>
        {/* Media type badge */}
        <div className='flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm'>
          {item.media_type === 'movie' ? <Film className='size-3' /> : <Tv className='size-3' />}
          <span className='capitalize'>{item.media_type}</span>
        </div>

        {/* Status badge */}
        {status && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm',
              status.className
            )}
          >
            <status.icon className='size-4' />
            <span>{status.label}</span>
          </div>
        )}
      </div>

      {/* Poster Link */}
      <Link
        to={getLink(item.media_type, item.id, title)}
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

        {/* Content overlay */}
        <div className='absolute inset-x-0 bottom-0 space-y-3 p-4'>
          <h3 className='line-clamp-2 text-lg leading-tight font-semibold text-white drop-shadow-lg'>{title}</h3>

          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2 text-white/80'>
              {item.rating && (
                <div className='flex items-center gap-1'>
                  <Star className='size-4 fill-yellow-400 text-yellow-400' />
                  <span>{item.rating}/10</span>
                </div>
              )}

              {releaseYear && (
                <>
                  {item.rating && <span className='text-white/40'>•</span>}
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
