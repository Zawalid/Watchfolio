import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getAllLibraryItems,
  countLibraryItems,
  getLibraryItem,
  getLibraryItemsByIds,
  getLibraryItemByTmdbId,
} from '@/lib/rxdb';
import { queryKeys } from '@/lib/react-query';
import { appwriteService } from '@/lib/appwrite/api';
import { useInfo } from './useLibraryMutations';

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

export const useInfiniteLibraryItems = (filters: LibraryFilters, options: { enabled?: boolean }) => {
  const { userId } = useInfo();

  const query = useInfiniteQuery({
    queryKey: queryKeys.library({ userId, ...filters }),
    queryFn: ({ pageParam = 0 }) =>
      getAllLibraryItems(userId, {
        ...filters,
        limit: PAGE_SIZE,
        offset: pageParam * PAGE_SIZE,
        sortBy: mapSortBy(filters.sortBy || 'recent'),
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: options.enabled,
  });

  if (query.isError) log(query.error);

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

  if (query.isError) log(query.error);

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
  const { userId } = useInfo()

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

export const useInfinitePublicLibraryItems = (
  libraryId: string,
  filters: LibraryFilters,
  options: { enabled?: boolean }
) => {
  return useInfiniteQuery({
    queryKey: ['public-library', libraryId, filters],
    queryFn: async ({ pageParam = 0 }) => {
      // Map the sortBy from UI key to the database field key
      const mappedFilters = {
        ...filters,
        sortBy: filters.sortBy ? mapSortBy(filters.sortBy) : undefined,
      };

      const items = await appwriteService.libraryMedia.getPublicLibraryItems(
        libraryId,
        PAGE_SIZE,
        pageParam * PAGE_SIZE,
        mappedFilters // Pass the new filters to the API call
      );
      return items.documents;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: options.enabled,
  });
};
