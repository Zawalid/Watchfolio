import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export async function prefetchQuery<TData>(queryFn: () => Promise<TData>, queryKey: unknown[]) {
  const cachedData = queryClient.getQueryData<TData>(queryKey);

  if (cachedData) return { data: cachedData, queryKey, fromCache: true };

  const data = await queryClient.prefetchQuery({ queryKey, queryFn });

  return { data, queryKey, fromCache: false };
}

export const queryKeys = {
  details: (type: 'movie' | 'tv', id: string) => ['details', type, id],
  category: (type: 'movie' | 'tv', category: string, page: number) => [type, category, page],
  search: (query: string, page: number) => ['search', query, page],
  recommendations: (type: 'movie' | 'tv', id: string) => ['recommendations', type, id],
  season: (seasonNumber: number) => ['season', seasonNumber],
};
