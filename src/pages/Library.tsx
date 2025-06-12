import { useParams } from 'react-router';
import { useQueryState } from 'nuqs';
import { useState, useEffect } from 'react';
import { useLibraryStore } from '@/stores/useLibraryStore';
import LibraryCardsList from '@/components/library/LibraryCardsList';
import Pagination from '@/components/library/Pagination';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const { getAllItems, getFavorites, getItemsByStatus } = useLibraryStore();

  // Get items based on current status
  const rawItems = (() => {
    if (!status || status === 'all') return getAllItems();
    if (status === 'favorites') return getFavorites();
    return getItemsByStatus(status as LibraryMediaStatus);
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
  const sortedItems = sortItems(filteredItems, sortBy, sortDir);

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
  }, [status, query, sortBy, sortDir]);

  const handleReorder = (reorderedItems: LibraryMedia[]) => {
    // For now, just log the reordered items
    // In a real app, you'd save this custom order
    console.log('Items reordered:', reorderedItems);
  };
  return (
    <div className='h-full space-y-8'>
      <LibraryCardsList
        items={paginatedItems}
        allItems={rawItems}
        status={status || 'all'}
        query={query}
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
