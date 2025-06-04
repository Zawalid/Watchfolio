import { useParams } from 'react-router';
import { useQueryState } from 'nuqs';
import { useLibraryStore } from '@/stores/useLibraryStore';
import LibraryCardsList from '@/components/library/LibraryCardsList';

const sortItems = (items: UserMediaData[], sortBy: string): UserMediaData[] => {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'rating':
        return (b.userRating || 0) - (a.userRating || 0);
      case 'date':
        return new Date(b.releaseDate || '').getTime() - new Date(a.releaseDate || '').getTime();
      case 'recent':
      default:
        return new Date(b.addedToLibraryAt).getTime() - new Date(a.addedToLibraryAt).getTime();
    }
  });
};

export default function Library() {
  const { filter } = useParams<{ filter: UserMediaFilter }>();
  const [query] = useQueryState('query', { defaultValue: '' });
  const [sortBy] = useQueryState('sort', { defaultValue: 'recent' });
  const [viewMode] = useQueryState('view', { defaultValue: 'list' });

  const { getAllItems, getFavorites, getItemsByStatus } = useLibraryStore();

  // Get items based on current status
  const rawItems = (() => {
    if (!filter || filter === 'all') return getAllItems();
    if (filter === 'favorites') return getFavorites();
    return getItemsByStatus(filter as UserMediaStatus);
  })();

  // Filter items based on query
  const filteredItems = rawItems.filter((item) => {
    if (!query) return true;
    const searchTerm = query.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchTerm) ||
      item.genres?.some((genre) => genre.toLowerCase().includes(searchTerm)) ||
      item.notes?.toLowerCase().includes(searchTerm)
    );
  });

  // Sort filtered items
  const sortedItems = sortItems(filteredItems, sortBy);

  return (
    <LibraryCardsList
      items={sortedItems}
      allItems={rawItems}
      filter={filter || 'all'}
      query={query}
      viewMode={viewMode as 'grid' | 'list'}
    />
  );
}
