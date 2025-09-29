import { useQuery } from '@tanstack/react-query';
import { getDetails, searchMovie, searchTvShows } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { generateMediaId } from '@/utils/library';
import { useLibraryItem } from '@/hooks/library/useLibraryQueries';
import BaseMediaCard from '@/components/media/BaseMediaCard';
import { MediaCardSkeleton } from '../media/MediaCardsListSkeleton';
import { Sparkles } from 'lucide-react';

interface Recommendation {
  title: string;
  year: number;
  detailed_analysis: string;
  mood_alignment: string;
  type: 'movie' | 'tv';
}

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { detailed_analysis, type, mood_alignment, title, year } = recommendation;

  // First, search for the title to get TMDB ID
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['ai-recommendation-search', title, year, type],
    queryFn: async () => {
      const searchFn = type === 'movie' ? searchMovie : searchTvShows;
      const results = await searchFn(title);

      if (results.results.length === 0) return null;

      // Find exact match by year
      const exactMatch = results.results.find((item: Movie | TvShow) => {
        const itemYear =
          type === 'movie'
            ? (item as Movie).release_date?.substring(0, 4)
            : (item as TvShow).first_air_date?.substring(0, 4);
        return itemYear === year.toString();
      });

      // Return exact match or first result
      return exactMatch || results.results[0];
    },
    staleTime: Infinity,
  });

  // If we found a match, fetch full details
  const { data: mediaDetails } = useQuery({
    queryKey: searchResults ? queryKeys.details(type, searchResults.id) : ['disabled'],
    queryFn: () => (searchResults ? getDetails(type, searchResults.id) : Promise.resolve(null)),
    enabled: !!searchResults,
    staleTime: Infinity,
  });

  // Library integration
  const mediaId = mediaDetails ? generateMediaId({ ...mediaDetails, media_type: type }) : '';
  const { data: libraryItem } = useLibraryItem(mediaId);

  // Show loading state
  if (isSearching || (searchResults && !mediaDetails)) return <MediaCardSkeleton />;

  // If no search results found, show fallback card
  if (!searchResults || !mediaDetails) {
    return (
      <div className='relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08]'>
        <div className='absolute top-3 right-3 z-30'>
          <div className='border-Secondary-500/40 bg-Secondary-500/20 text-Secondary-300 flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium backdrop-blur-sm'>
            <Sparkles className='h-3 w-3' />
            <span>AI Pick</span>
          </div>
        </div>

        <div className='rounded-2xl bg-gradient-to-br from-Grey-900/98 to-Grey-800/98 p-5 backdrop-blur-xl h-full'>
          <div className='flex h-full flex-col space-y-4'>
            <div className='flex items-center gap-2'>
              <Sparkles className='text-Secondary-400 h-5 w-5' />
              <span className='text-Secondary-300 text-base font-semibold'>AI Analysis</span>
            </div>

            <div className='flex-1 space-y-4 overflow-y-auto'>
              <div>
                <h4 className='text-Primary-300 mb-2 text-sm font-medium'>Why this matches</h4>
                <p className='text-Grey-300 text-sm leading-relaxed'>{mood_alignment}</p>
              </div>

              <div className='border-t border-white/10 pt-3'>
                <h4 className='text-Primary-300 mb-2 text-sm font-medium'>Detailed analysis</h4>
                <p className='text-Grey-300 text-sm leading-relaxed'>{detailed_analysis}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This should only render if we have both searchResults and mediaDetails
  if (!mediaDetails) {
    return (
      <div className='aspect-[2/3] animate-pulse rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08]'>
        <div className='bg-Grey-800/50 h-full w-full rounded-2xl' />
      </div>
    );
  }

  const displayTitle = (mediaDetails as Movie).title || (mediaDetails as TvShow).name || title;
  const releaseDate = (mediaDetails as Movie).release_date || (mediaDetails as TvShow).first_air_date;
  const genres = mediaDetails.genres?.map((g: { name: string }) => g.name) || [];

  return (
    <BaseMediaCard
      id={searchResults.id}
      title={displayTitle}
      mediaType={type}
      posterPath={mediaDetails.poster_path}
      releaseDate={releaseDate}
      rating={mediaDetails.vote_average}
      genres={genres}
      item={libraryItem || undefined}
      media={mediaDetails}
      aiAnalysis={{
        detailed_analysis,
        mood_alignment,
      }}
    />
  );
}
