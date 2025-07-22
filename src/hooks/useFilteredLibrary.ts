import { useMemo } from 'react';
import { useDiscoverParams } from './useDiscoverParams';

export function useFilteredLibrary(allMedia: LibraryMedia[] | undefined, status?: LibraryFilterStatus) {
  const {query, sortBy, sortDir, selectedGenres: genres, selectedTypes: types } = useDiscoverParams();

  return useMemo(() => {
    if (!allMedia) return [];

    let filtered = allMedia;

    // This block handles multiple filter types simultaneously.
    filtered = allMedia.filter((item) => {
      if (status && status !== 'all') {
        if (status === 'favorites' ? !item.isFavorite : item.status !== status) {
          return false;
        }
      }
      if (query) {
        if (!item.title?.toLowerCase().includes(query.toLowerCase())) {
          return false;
        }
      }
     if (genres && genres.length > 0) {
       if (!genres.every((selected) => item.genres?.map((g) => g.toLowerCase()).includes(selected))) {
         return false;
       }
     }
      if (types && types.length > 0) {
        if (!types.includes(item.media_type)) {
          return false;
        }
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'recent':
          comparison = new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'rating':
          comparison = (b.userRating || 0) - (a.userRating || 0);
          break;
        case 'date':
          comparison = new Date(b.releaseDate || '').getTime() - new Date(a.releaseDate || '').getTime();
          break;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [allMedia, genres, query, sortBy, sortDir, status, types]);
}
