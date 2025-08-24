import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getAllLibraryItems, countLibraryItems, getLibraryItem } from '@/lib/rxdb';
import { queryKeys } from '@/lib/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

const PAGE_SIZE = 20;

const mapSortBy = (sortBy: string) => {
  switch (sortBy) {
    case 'recent':
      return 'addedAt';
    case 'user_rating':
      return 'userRating';
    case 'release_date':
      return 'releaseDate';
    default:
      return sortBy;
  }
};

export const useInfiniteLibraryItems = (filters: {
  status: LibraryFilterStatus;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  query?: string;
  mediaType?: MediaType | 'all';
  genres?: string[];
  networks?: number[];
}) => {
  const library = useAuthStore((state) => state.user?.profile.library);

  return useInfiniteQuery({
    queryKey: queryKeys.library({ libraryId: library?.$id, ...filters }),
    queryFn: ({ pageParam = 0 }) =>
      getAllLibraryItems(library?.$id, {
        ...filters,
        limit: PAGE_SIZE,
        offset: pageParam * PAGE_SIZE,
        sortBy: mapSortBy(filters.sortBy),
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};

export const useLibraryItem = (id: string) => {
  return useQuery({
    queryKey: queryKeys.libraryItem(id),
    queryFn: () => getLibraryItem(id),
    enabled: !!id,
  });
};

export const useLibraryTotalCount = () => {
  const library = useAuthStore((state) => state.user?.profile.library);

  const { data } = useQuery({
    queryKey: queryKeys.libraryCount(library?.$id),
    queryFn: async () => {
      const counts = await Promise.all(
        LIBRARY_MEDIA_STATUS.map((status) => countLibraryItems(library?.$id, status.value))
      );
      const all = counts.reduce((acc, count) => acc + count, 0);
      return counts.reduce(
        (acc, count, index) => {
          acc[LIBRARY_MEDIA_STATUS[index].value] = count;
          return acc;
        },
        { all } as Record<string, number>
      );
    },
  });
  return (
    data ||
    LIBRARY_MEDIA_STATUS.reduce(
      (acc, status) => {
        acc[status.value] = 0;
        return acc;
      },
      { all: 0 } as Record<string, number>
    )
  );
};
