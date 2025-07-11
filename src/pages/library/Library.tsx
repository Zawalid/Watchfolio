import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { useLibraryStore } from '@/stores/useLibraryStore';
import LibraryCardsList from '@/components/library/LibraryCardsList';

const sortItems = (items: LibraryMedia[], sortBy: string, sortDir: string): LibraryMedia[] => {
  return [...items].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
        break;
      case 'rating':
        comparison = (a.userRating || 0) - (b.userRating || 0);
        break;
      case 'date':
        comparison = new Date(a.releaseDate || '').getTime() - new Date(b.releaseDate || '').getTime();
        break;
      case 'recent':
      default:
        comparison = new Date(a.addedToLibraryAt).getTime() - new Date(b.addedToLibraryAt).getTime();
    }
    return sortDir === 'asc' ? comparison : -comparison;
  });
};

export default function Library({ status }: { status: LibraryFilterStatus }) {
  const [query] = useQueryState('query', { defaultValue: '' });
  const [sortBy] = useQueryState('sort', { defaultValue: 'recent' });
  const [sortDir] = useQueryState('dir', { defaultValue: 'desc' });
  const [selectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedPlatforms] = useQueryState('platforms', parseAsArrayOf(parseAsString));
  const [selectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));


  const { getAllItems, getItemsByStatus } = useLibraryStore();

  const rawItems = (() => {
    if (!status || status === 'all') return getAllItems();
    return getItemsByStatus(status);
  })();

  const filteredItems = rawItems.filter((item) => {
    // Filter by search query
    if (query) {
      const searchTerm = query.toLowerCase();
      if (
        !(
          item.title?.toLowerCase().includes(searchTerm) ||
          item.genres?.some((genre) => genre.toLowerCase().includes(searchTerm)) ||
          item.status?.toLowerCase().includes(searchTerm)
        )
      ) {
        return false;
      }
    }

    // Filter by genres
    if (selectedGenres && selectedGenres.length > 0) {
      if (!item.genres || !item.genres.some((genre) => selectedGenres.includes(genre.toLowerCase()))) {
        return false;
      }
    }

    // Filter by platforms
    if (selectedPlatforms && selectedPlatforms.length > 0) {
      // Assuming there's a platforms field in the items
      // if (!item.platforms || !item.platforms.some(platform =>
      //   selectedPlatforms.includes(platform)
      // )) {
      //   return false;
      // }
    }

    // Filter by media types (movie, tv, anime)
    if (selectedTypes && selectedTypes.length > 0) {
      if (!selectedTypes.includes(item.media_type)) {
        return false;
      }
    }

    return true;
  });

  const sortedItems = sortItems(filteredItems, sortBy, sortDir);

  return (
    <div className='h-full space-y-8'>
      <LibraryCardsList items={sortedItems} allItems={rawItems} status={status || 'all'} query={query} />
    </div>
  );
}
