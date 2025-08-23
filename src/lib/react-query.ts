import { QueryClient } from '@tanstack/react-query';
import { DiscoverParams } from './api/TMDB';

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
  discover: (type: MediaType, params: DiscoverParams) => [
    'discover',
    type,
    ...Object.entries(params).map(([key, value]) => `${key}=${value}`),
  ],
  category: (type: MediaType, category: Categories,) => [type, category],
  trending: (type: 'all' | MediaType, timeWindow: 'day' | 'week') => ['trending', type, timeWindow],

  details: (type: MediaType, id: number) => ['details', type, id],
  recommendations: (type: MediaType, id: string) => ['recommendations', type, id],
  season: (seasonNumber: number) => ['season', seasonNumber],

  search: (contentType: string, query: string) => ['search', contentType, query],
  suggestions: (query: string) => ['suggestions', query],

  celebrities: (category: string) => ['celebrities', category] as const,
  celebrity: (id: number) => ['celebrity', id] as const,
  personCredits: (id: number, type: MediaType | 'combined') => ['person', id, 'credits', type] as const,

  collection: (id: number) => ['collection', id] as const,

  network: (id: number, params: DiscoverParams) => ['network', id, params] as const,
};
