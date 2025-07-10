import { Filter, Search, FunnelX, Film, Tv, TrendingUp, Star, Heart, Sparkles } from 'lucide-react';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { Button } from '@heroui/button';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { Tooltip } from '@heroui/tooltip';
import { Link } from 'react-router';

const getFilterInfo = (filter: LibraryFilterStatus) => {
  const statusOption = LIBRARY_MEDIA_STATUS.find((status) => status.value === filter);

  if (statusOption) {
    const IconComponent = statusOption.icon;
    return {
      icon: <IconComponent className='size-10' />,
      label: statusOption.label,
      color: statusOption.className.split(' ')[0],
    };
  }

  switch (filter) {
    case 'favorites':
      return { icon: <Heart className='size-10' />, label: 'Favorites', color: 'text-red-400' };
    default:
      return { icon: <Filter className='size-10' />, label: 'Unknown', color: 'text-gray-400' };
  }
};

export default function EmptyState({ status }: { status?: LibraryFilterStatus }) {
  const [query, setQuery] = useQueryState('query');
  const [selectedGenres, setSelectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedPlatforms, setSelectedPlatforms] = useQueryState('platforms', parseAsArrayOf(parseAsString));
  const [selectedTypes, setSelectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));

  const hasFilters = Boolean(selectedGenres?.length || selectedPlatforms?.length || selectedTypes?.length);
  const hasQuery = !!query && query.trim() !== '';

  if (status === 'all') {
    return (
      <div className='flex h-full flex-col items-center justify-center py-20 text-center'>
        <div className='mb-6 rounded-full border border-white/10 bg-white/5 p-6 backdrop-blur-md'>
          <Film className='text-Primary-400 size-10' />
        </div>
        <h3 className='text-Grey-50 mb-2 text-xl font-semibold'>Your watchlist awaits</h3>
        <p className='text-Grey-400 mb-6 max-w-md'>
          Ready to start your journey? Discover amazing movies and TV shows to build your personal collection.
        </p>
        <Button
          as={Link}
          to='/'
          color='primary'
          size='md'
          className='font-medium'
          startContent={<Sparkles className='h-4 w-4' />}
        >
          Start Exploring
        </Button>

        {/* Simple suggestions */}
        <div className='mt-8 flex flex-wrap justify-center gap-2'>
          <Link
            to='/movies'
            className='pill-bg flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:bg-white/10'
          >
            <Film className='text-Primary-400 h-4 w-4' />
            <span className='text-Grey-300 text-sm'>Movies</span>
          </Link>
          <Link
            to='/tv'
            className='pill-bg flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:bg-white/10'
          >
            <Tv className='text-Secondary-400 h-4 w-4' />
            <span className='text-Grey-300 text-sm'>TV Shows</span>
          </Link>
          <Link
            to='/movies?category=popular'
            className='pill-bg flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:bg-white/10'
          >
            <TrendingUp className='text-Warning-400 h-4 w-4' />
            <span className='text-Grey-300 text-sm'>Trending</span>
          </Link>
          <Link
            to='/tv?category=top-rated'
            className='pill-bg flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:bg-white/10'
          >
            <Star className='text-Success-400 h-4 w-4' />
            <span className='text-Grey-300 text-sm'>Top Rated</span>
          </Link>
        </div>
      </div>
    );
  }

  if (hasFilters || hasQuery) {
    return (
      <div className='flex h-full flex-col items-center justify-center py-20 text-center'>
        <div className='mb-6 rounded-full border border-white/10 bg-white/5 p-6 backdrop-blur-md'>
          {hasFilters ? (
            <FunnelX className='text-Warning-400 h-12 w-12' />
          ) : (
            <Search className='text-Grey-400 h-12 w-12' />
          )}
        </div>
        <h3 className='text-Grey-50 mb-2 text-xl font-semibold'>
          {hasFilters ? 'No matches found' : 'No results found'}
        </h3>
        <p className='text-Grey-400 max-w-md'>
          {hasFilters
            ? 'Your current filters are too specific. Try adjusting them to see more content.'
            : `Couldn't find any shows or movies matching "${query}". Try a different search term.`}
        </p>
        <div className='mt-6'>
          <Tooltip
            content={<ShortcutTooltip shortcutName={hasFilters ? 'clearFilters' : 'clearSearch'} className='kbd-sm!' />}
            className='tooltip-secondary!'
          >
            <Button
              className='button-secondary!'
              onPress={() => {
                if (hasFilters) {
                  setSelectedGenres(null);
                  setSelectedPlatforms(null);
                  setSelectedTypes(null);
                } else setQuery(null);
              }}
            >
              {hasFilters ? 'Clear Filters' : 'Clear Search'}
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  }

  const statusInfo = status ? getFilterInfo(status) : null;

  const getEmptyMessage = () => {
    switch (status) {
      case 'watching':
        return {
          title: 'Nothing on your screen yet',
          message: "When you start watching something new, it'll appear here so you can track your progress.",
        };
      case 'completed':
        return {
          title: 'Nothing completed yet',
          message: 'Finished watching something? Mark it as "Completed" to keep track of your completed adventures.',
        };
      case 'willWatch':
        return {
          title: 'Nothing planned to watch',
          message:
            'Found something interesting? Add it to your "Plan to Watch" list so you never forget the good stuff.',
        };
      case 'onHold':
        return {
          title: 'No shows taking a break',
          message: "Sometimes we need a pause. When you put something on hold, you'll find it here waiting for you.",
        };
      case 'dropped':
        return {
          title: 'No shows left behind... yet',
          message: "Not every show is meant to be. When something doesn't click, it'll land here.",
        };
      case 'favorites':
        return {
          title: 'No favorites chosen',
          message: 'Found something you absolutely love? Hit the heart button to save your all-time favorites here.',
        };
      default:
        return {
          title: 'Nothing here yet',
          message: 'This section is waiting for some content to appear.',
        };
    }
  };

  const { title, message } = getEmptyMessage();

  // Regular empty state for other statuses
  return (
    <div className='flex h-full flex-col items-center justify-center py-20 text-center'>
      <div className='mb-6 rounded-full border border-white/10 bg-white/5 p-6 backdrop-blur-md'>
        {statusInfo ? (
          <div className={statusInfo.color}>{statusInfo.icon}</div>
        ) : (
          <Filter className='text-Grey-400 h-12 w-12' />
        )}
      </div>
      <h3 className='text-Grey-50 mb-2 text-xl font-semibold'>{title}</h3>
      <p className='text-Grey-400 max-w-md'>{message}</p>
    </div>
  );
}
