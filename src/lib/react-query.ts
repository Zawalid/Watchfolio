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
  discover: (type: 'movie' | 'tv', params: DiscoverParams) => ['discover', type, params],
  category: (type: 'movie' | 'tv', category: Categories, page: number) => [type, category, page],
  trending: (type: 'all' | 'movie' | 'tv', timeWindow: 'day' | 'week') => ['trending', type, timeWindow],
  
  details: (type: 'movie' | 'tv', id: string) => ['details', type, id],
  recommendations: (type: 'movie' | 'tv', id: string) => ['recommendations', type, id],
  season: (seasonNumber: number) => ['season', seasonNumber],
  
  search: (contentType: string, query: string, page: number) => ['search', contentType, query, page],
  suggestions: (query: string) => ['suggestions', query],

  celebrities: (category: string, page: number) => ['celebrities', category, page] as const,
  celebrity: (id: number) => ['celebrity', id] as const,
  personCredits: (id: number, type: 'movie' | 'tv' | 'combined') => ['person', id, 'credits', type] as const,

  collection: (id: number) => ['collection', id] as const,
};
