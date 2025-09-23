import { useQuery } from '@tanstack/react-query';
import { getDetails, searchMovie, searchTvShows } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { generateMediaId } from '@/utils/library';
import { useLibraryItem } from '@/hooks/library/useLibraryQueries';
import BaseMediaCard from '@/components/media/BaseMediaCard';

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
        const itemYear = type === 'movie'
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
    queryFn: () => searchResults ? getDetails(type, searchResults.id) : Promise.resolve(null),
    enabled: !!searchResults,
    staleTime: Infinity,
  });

  // Library integration
  const mediaId = mediaDetails ? generateMediaId({ ...mediaDetails, media_type: type }) : '';
  const { data: libraryItem } = useLibraryItem(mediaId);

  // Show loading state
  if (isSearching || (searchResults && !mediaDetails)) {
    return (
      <div className="aspect-[2/3] rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] animate-pulse">
        <div className="h-full w-full bg-Grey-800/50 rounded-2xl" />
      </div>
    );
  }

  // If no search results found, show fallback card
  if (!searchResults) {
    return (
      <div className="aspect-[2/3] rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] p-4 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="border-Secondary-500/40 bg-Secondary-500/20 text-Secondary-300 flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium backdrop-blur-sm w-fit">
            <span>AI Pick</span>
          </div>
          <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
          <p className="text-Grey-400 text-sm">{year} • {type === 'movie' ? 'Movie' : 'TV Show'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-Grey-300 text-xs">{detailed_analysis}</p>
          <p className="text-Secondary-300 text-xs italic">{mood_alignment}</p>
        </div>
      </div>
    );
  }

  // This should only render if we have both searchResults and mediaDetails
  if (!mediaDetails) {
    return (
      <div className="aspect-[2/3] rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] animate-pulse">
        <div className="h-full w-full bg-Grey-800/50 rounded-2xl" />
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
        mood_alignment
      }}
    />
  );
}