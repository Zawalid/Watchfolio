import { useParams } from 'react-router';
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
        comparison = (b.userRating || 0) - (a.userRating || 0);
        break;
      case 'date':
        comparison = new Date(b.releaseDate || '').getTime() - new Date(a.releaseDate || '').getTime();
        break;
      case 'recent':
      default:
        comparison = new Date(b.addedToLibraryAt).getTime() - new Date(a.addedToLibraryAt).getTime();
    }
    return sortDir === 'asc' ? comparison : -comparison;
  });
};

export default function Library() {
  const { status } = useParams<{ status: LibraryFilterStatus }>();
  const [query] = useQueryState('query', { defaultValue: '' });
  const [sortBy] = useQueryState('sort', { defaultValue: 'recent' });
  const [sortDir] = useQueryState('dir', { defaultValue: 'desc' });
  const [selectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedPlatforms] = useQueryState('platforms', parseAsArrayOf(parseAsString));

  const { getAllItems, getFavorites, getItemsByStatus } = useLibraryStore();

  const rawItems = (() => {
    if (!status || status === 'all') return getAllItems();
    if (status === 'favorites') return getFavorites();
    return getItemsByStatus(status as LibraryMediaStatus);
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

    return true;
  });

  const sortedItems = sortItems(filteredItems, sortBy, sortDir);

  const handleReorder = (reorderedItems: LibraryMedia[]) => {
    // For now, just log the reordered items
    // In a real app, you'd save this custom order
    console.log('Items reordered:', reorderedItems);
  };

  return (
    <div className='h-full space-y-8'>
      <LibraryCardsList
        items={sortedItems}
        allItems={rawItems}
        status={status || 'all'}
        query={query}
        onReorder={handleReorder}
      />
    </div>
  );
}
