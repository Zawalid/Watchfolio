import { useParams } from 'react-router';
import { useQueryState } from 'nuqs';
import { useState, useEffect } from 'react';
import { useLibraryStore } from '@/stores/useLibraryStore';
import LibraryCardsList from '@/components/library/LibraryCardsList';
import Pagination from '@/components/library/Pagination';

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
  const [viewMode] = useQueryState('view', { defaultValue: 'grid' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

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

  // Pagination logic
  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, query, sortBy]);

  const handleReorder = (reorderedItems: UserMediaData[]) => {
    // For now, just log the reordered items
    // In a real app, you'd save this custom order
    console.log('Items reordered:', reorderedItems);
  };
  return (
    <div className='space-y-8'>
      <LibraryCardsList
        items={paginatedItems}
        allItems={rawItems}
        filter={filter || 'all'}
        query={query}
        viewMode={viewMode as 'grid' | 'list'}
        onReorder={handleReorder}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center pt-8'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
