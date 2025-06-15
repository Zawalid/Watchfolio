import { Filter, Search, Heart, FunnelX } from 'lucide-react';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { Button } from '@heroui/button';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { ShortcutTooltip } from '../ui/ShortcutKey';
import { Tooltip } from '@heroui/tooltip';

const getFilterInfo = (filter: LibraryFilterStatus) => {
  const statusOption = LIBRARY_MEDIA_STATUS.find((status) => status.value === filter);

  if (statusOption) {
    const IconComponent = statusOption.icon;
    return {
      icon: <IconComponent className='size-6' />,
      label: statusOption.label,
      color: statusOption.className.split(' ')[0],
    };
  }

  switch (filter) {
    case 'favorites':
      return { icon: <Heart className='size-6' />, label: 'Favorites', color: 'text-red-400' };
    default:
      return { icon: <Filter className='size-6' />, label: 'Unknown', color: 'text-gray-400' };
  }
};

export default function EmptyState({ status }: { status?: LibraryFilterStatus }) {
  const [query, setQuery] = useQueryState('query');
  const [selectedGenres, setSelectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedPlatforms, setSelectedPlatforms] = useQueryState('platforms', parseAsArrayOf(parseAsString));
  const [selectedTypes, setSelectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));

  const hasFilters = Boolean(selectedGenres?.length || selectedPlatforms?.length || selectedTypes?.length);
  const hasQuery = !!query && query.trim() !== '';

  if (hasFilters || hasQuery) {
    return (
      <div className='flex h-full flex-col items-center justify-center py-20 text-center'>
        <div className='mb-6 rounded-full bg-white/5 p-6 backdrop-blur-md'>
          {hasFilters ? <FunnelX className='size-12 text-amber-400' /> : <Search className='text-Grey-400 size-12' />}
        </div>
        <h3 className='text-Primary-50 mb-2 text-xl font-semibold'>
          {hasFilters ? 'No matches found with current filters' : 'No matches found'}
        </h3>
        <p className='text-Grey-400 max-w-md'>
          {hasFilters
            ? 'Your current filters are too specific. Try adjusting them to see more content.'
            : `Couldn't find any shows or movies matching "${query}". Try a different search term or check your spelling.`}
        </p>
        <div className='mt-6 flex gap-3'>
          <Tooltip content={<ShortcutTooltip shortcutName={hasFilters ? 'clearFilters' : 'clearSearch'} className='kbd-sm'/>} className='tooltip-secondary'>
            <Button
              className='button-secondary'
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

  // Handle status-based empty state
  const statusInfo = status ? getFilterInfo(status) : null;

  const getEmptyMessage = () => {
    switch (status) {
      case 'all':
        return {
          title: 'Your watchlist awaits',
          message:
            'Ready to start your journey? Discover amazing movies and TV shows to build your personal collection.',
        };
      case 'watching':
        return {
          title: 'Nothing on your screen yet',
          message: "When you start watching something new, it'll appear here so you can track your progress.",
        };
      case 'watched':
        return {
          title: 'Nothing completed yet',
          message: 'Finished watching something? Mark it as "Watched" to keep track of your completed adventures.',
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

  return (
    <div className='flex h-full flex-col items-center justify-center py-20 text-center'>
      <div className='mb-6 rounded-full bg-white/5 p-6 backdrop-blur-md'>
        {statusInfo ? (
          <div className={statusInfo.color}>{statusInfo.icon}</div>
        ) : (
          <Filter className='text-Grey-400 size-12' />
        )}
      </div>
      <h3 className='text-Primary-50 mb-2 text-xl font-semibold'>{title}</h3>
      <p className='text-Grey-400 max-w-md'>{message}</p>
      {status === 'all' && (
        <button className='bg-Primary-600 hover:bg-Primary-700 mt-6 rounded-lg px-6 py-3 font-medium text-white transition-colors'>
          Start Exploring
        </button>
      )}
    </div>
  );
}
