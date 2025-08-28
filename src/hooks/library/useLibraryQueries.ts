import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getAllLibraryItems,
  countLibraryItems,
  getLibraryItem,
  getLibraryItemsByIds,
  getLibraryItemByTmdbId,
} from '@/lib/rxdb';
import { queryKeys } from '@/lib/react-query';
import { useAuthStore } from '@/stores/useAuthStore';


const PAGE_SIZE = 20;

const mapSortBy = (sortBy: string) => {
  switch (sortBy) {
    case 'recent':
      return 'addedAt';
    case 'user_rating':
      return 'userRating';
    case 'release_date':
      return 'releaseDate';
    case 'runtime':
      return 'totalMinutesRuntime';
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
  const userId = useAuthStore((state) => state.user?.$id);

  const query = useInfiniteQuery({
    queryKey: queryKeys.library({ userId, ...filters }),
    queryFn: ({ pageParam = 0 }) =>
      getAllLibraryItems(userId, {
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

  if (query.isError) console.log(query.error);

  return query;
};

export const useLibraryItem = (id: string) => {
  const query = useQuery({
    queryKey: queryKeys.libraryItem(id),
    queryFn: () => {
      if (String(id).includes('-')) {
        const [mediaType, tmdbId] = id.split('-');
        return getLibraryItemByTmdbId(Number(tmdbId), mediaType as MediaType);
      }
      return getLibraryItem(id);
    },
    enabled: !!id,
  });

  if (query.isError) console.log(query.error);

  return query;
};

export const useLibraryItemsByIds = (ids: string[]) => {
  return useQuery({
    queryKey: ['libraryItemsByIds', ids],
    queryFn: () => getLibraryItemsByIds(ids),
    enabled: ids && ids.length > 0,
  });
};

const status: LibraryFilterStatus[] = ['all', 'watching', 'willWatch', 'onHold', 'dropped', 'completed', 'favorites'];

export const useLibraryTotalCount = () => {
  const userId = useAuthStore((state) => state.user?.$id);

  const { data } = useQuery({
    queryKey: queryKeys.libraryCount(userId),
    queryFn: async () => {
      const counts = await Promise.all(status.map((s) => countLibraryItems(userId, s)));
      return counts.reduce(
        (acc, count, index) => {
          acc[status[index]] = count;
          return acc;
        },
        {} as Record<string, number>
      );
    },
  });

  return (
    data ||
    status.reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<string, number>
    )
  );
};
