import { Filter, Search, Heart, CheckCircle, Clock, Eye, AlertOctagon, XCircle } from 'lucide-react';

const getFilterInfo = (filter: UserMediaFilter) => {
  switch (filter) {
    case 'watched':
      return { icon: <CheckCircle className='size-6' />, label: 'Completed', color: 'text-green-400' };
    case 'watching':
      return { icon: <Clock className='size-6' />, label: 'Currently Watching', color: 'text-blue-400' };
    case 'will-watch':
      return { icon: <Eye className='size-6' />, label: 'Plan to Watch', color: 'text-purple-400' };
    case 'on-hold':
      return { icon: <AlertOctagon className='size-6' />, label: 'On Hold', color: 'text-yellow-400' };
    case 'dropped':
      return { icon: <XCircle className='size-6' />, label: 'Dropped', color: 'text-red-400' };
    default:
      return { icon: <Heart className='size-6' />, label: 'Favorites', color: 'text-red-400' };
  }
};

export default function EmptyState({
  filter,
  hasQuery,
  query,
}: {
  filter?: UserMediaFilter;
  hasQuery: boolean;
  query: string;
}) {
  if (hasQuery) {
    return (
      <div className='flex h-full flex-col items-center justify-center py-20 text-center'>
        <div className='mb-6 rounded-full bg-white/5 p-6 backdrop-blur-md'>
          <Search className='text-Grey-400 size-12' />
        </div>
        <h3 className='text-Primary-50 mb-2 text-xl font-semibold'>No results found</h3>
        <p className='text-Grey-400 max-w-md'>
          No items in your library match "{query}". Try adjusting your search terms.
        </p>
      </div>
    );
  }

  const filterInfo = filter ? getFilterInfo(filter) : null;

  const getEmptyMessage = () => {
    switch (filter) {
      case 'all':
        return {
          title: 'Your library is empty',
          message: 'Start building your collection by adding movies and TV shows to your library.',
        };
      case 'watching':
        return {
          title: 'Not watching anything yet',
          message: 'Mark movies or TV shows as "Currently Watching" to see them here.',
        };
      case 'watched':
        return {
          title: 'No completed items',
          message: 'Mark movies or TV shows as "Completed" when you finish watching them.',
        };
      case 'will-watch':
        return {
          title: 'Nothing planned to watch',
          message: 'Add movies or TV shows to your "Plan to Watch" list to keep track of what you want to see.',
        };
      case 'on-hold':
        return {
          title: 'Nothing on hold',
          message: 'Items you pause watching will appear here.',
        };
      case 'dropped':
        return {
          title: 'Nothing dropped',
          message: 'Movies or TV shows you stop watching will appear here.',
        };
      case 'favorites':
        return {
          title: 'No favorites yet',
          message: 'Mark your favorite movies and TV shows with a heart to see them here.',
        };
      default:
        return {
          title: 'No items found',
          message: 'This section is currently empty.',
        };
    }
  };

  const { title, message } = getEmptyMessage();

  return (
    <div className='flex h-full flex-col items-center justify-center py-20 text-center'>
      <div className='mb-6 rounded-full bg-white/5 p-6 backdrop-blur-md'>
        {filterInfo ? (
          <div className={filterInfo.color}>{filterInfo.icon}</div>
        ) : (
          <Filter className='text-Grey-400 size-12' />
        )}
      </div>
      <h3 className='text-Primary-50 mb-2 text-xl font-semibold'>{title}</h3>
      <p className='text-Grey-400 max-w-md'>{message}</p>
      {status === 'all' && (
        <button className='bg-Primary-600 hover:bg-Primary-700 mt-6 rounded-lg px-6 py-3 font-medium text-white transition-colors'>
          Browse Movies & TV Shows
        </button>
      )}
    </div>
  );
}
