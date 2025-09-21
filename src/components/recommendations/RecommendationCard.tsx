import { useState } from 'react';
import { Button, Popover, PopoverTrigger, PopoverContent } from '@heroui/react';
import { Info, Sparkles, Heart, Plus, Star, Calendar, Film, Tv } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDetails } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { useAddOrUpdateLibraryItem } from '@/hooks/library/useLibraryMutations';
import { generateMediaId } from '@/utils/library';
import { useLibraryItem } from '@/hooks/library/useLibraryQueries';
import { getTmdbImage } from '@/utils/media';
import { cn } from '@/utils';
import type { Movie, TvShow } from '@/types';

interface Recommendation {
  tmdb_id: number;
  imdb_id?: string;
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
  const { tmdb_id, detailed_analysis, type, mood_alignment, title, year } = recommendation;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Fetch TMDB details
  const { data: mediaDetails, isLoading } = useQuery({
    queryKey: queryKeys.details(type, tmdb_id),
    queryFn: () => getDetails(type, tmdb_id),
    staleTime: Infinity,
  });

  // Create media object for library operations
  const mediaObject = mediaDetails ? {
    ...mediaDetails,
    id: tmdb_id,
    media_type: type,
  } as Media : null;

  const mediaId = mediaObject ? generateMediaId(mediaObject) : '';
  const { data: existingItem } = useLibraryItem(mediaId);
  const { mutate: addOrUpdateItem } = useAddOrUpdateLibraryItem();

  const handleAddToLibrary = () => {
    if (!mediaObject) return;
    addOrUpdateItem({
      item: {
        id: mediaId,
        status: existingItem?.status || 'willWatch',
        media_type: type
      },
      media: mediaObject,
    });
  };

  const handleToggleFavorite = () => {
    if (!mediaObject) return;
    addOrUpdateItem({
      item: {
        id: mediaId,
        isFavorite: !existingItem?.isFavorite,
        media_type: type
      },
      media: mediaObject,
    });
  };

  const isInLibrary = !!existingItem;
  const isFavorite = existingItem?.isFavorite;

  // Show loading state
  if (isLoading || !mediaDetails) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] p-6 animate-pulse aspect-[2/3] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 bg-white/5 rounded w-1/2"></div>
        </div>
        <div className="h-3 bg-white/5 rounded w-full"></div>
      </div>
    );
  }

  const posterUrl = mediaDetails.poster_path
    ? getTmdbImage(mediaDetails, 'w500')
    : null;

  const displayTitle = (mediaDetails as Movie).title || (mediaDetails as TvShow).name || title;
  const displayYear = year || new Date((mediaDetails as Movie).release_date || (mediaDetails as TvShow).first_air_date || '').getFullYear();
  const rating = mediaDetails.vote_average ? Math.round(mediaDetails.vote_average * 10) / 10 : null;
  const genres = mediaDetails.genres?.slice(0, 3) || [];

  return (
    <div className="group relative w-full max-w-sm mx-auto rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] shadow-lg transition-all duration-300 hover:border-white/25 hover:shadow-2xl hover:scale-[1.02] overflow-hidden flex flex-col">
      {/* AI Badge */}
      <div className="absolute top-3 left-3 z-20">
        <div className="border-Secondary-500/40 bg-Secondary-500/20 text-Secondary-300 flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium backdrop-blur-sm">
          <Sparkles className="h-3 w-3" />
          <span>AI Pick</span>
        </div>
      </div>

      {/* Library Status Badge */}
      {isInLibrary && (
        <div className="absolute top-3 right-12 z-20">
          <div className="border-Primary-500/40 bg-Primary-500/20 text-Primary-300 flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium backdrop-blur-sm">
            <Star className="h-3 w-3 fill-current" />
          </div>
        </div>
      )}

      {/* AI Analysis Button */}
      <div className="absolute top-3 right-3 z-20">
        <Popover
          isOpen={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          placement="top-end"
          offset={10}
        >
          <PopoverTrigger>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="bg-white/10 border border-white/20 text-Grey-300 hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200"
            >
              <Info className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-lg p-6 bg-Grey-900/95 border border-white/10 backdrop-blur-md">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-Secondary-400" />
                <span className="text-base font-semibold text-Secondary-300">AI Analysis</span>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-Primary-300 mb-2">Why this matches your request</h4>
                  <p className="text-sm text-Grey-300 leading-relaxed">
                    {mood_alignment}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <h4 className="text-sm font-medium text-Primary-300 mb-2">Detailed analysis</h4>
                  <p className="text-sm text-Grey-300 leading-relaxed">
                    {detailed_analysis}
                  </p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-b from-Grey-800 to-Grey-900">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div className={`flex h-full items-center justify-center ${posterUrl ? 'hidden' : 'flex'}`}>
          <div className="text-center">
            {type === 'movie' ? (
              <Film className="mx-auto h-12 w-12 text-Grey-500 mb-2" />
            ) : (
              <Tv className="mx-auto h-12 w-12 text-Grey-500 mb-2" />
            )}
            <p className="text-Grey-500 text-sm">No poster</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-4">
        {/* Title and Year */}
        <div className="space-y-2">
          <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight">
            {displayTitle}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-Grey-400">
              {type === 'movie' ? <Film className="h-3.5 w-3.5" /> : <Tv className="h-3.5 w-3.5" />}
              <span className="capitalize font-medium">{type}</span>
            </div>
            <span className="text-Grey-600">•</span>
            <div className="flex items-center gap-1.5 text-Grey-400">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-medium">{displayYear}</span>
            </div>
            {rating && (
              <>
                <span className="text-Grey-600">•</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 font-semibold">{rating}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full border border-Primary-500/30 bg-Primary-500/10 px-3 py-1 text-xs text-Primary-300 font-medium"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onPress={handleAddToLibrary}
            size="sm"
            className={cn(
              "flex-1 rounded-xl font-semibold transition-all duration-200 min-h-10",
              isInLibrary
                ? "bg-Primary-500/20 border border-Primary-500/40 text-Primary-300 hover:bg-Primary-500/30"
                : "bg-gradient-to-r from-Primary-500 to-Secondary-500 text-white hover:shadow-lg hover:scale-[1.02] shadow-Primary-500/20"
            )}
            startContent={isInLibrary ? <Star className="h-4 w-4 fill-current" /> : <Plus className="h-4 w-4" />}
          >
            {isInLibrary ? 'In Library' : 'Add to Library'}
          </Button>
          <Button
            onPress={handleToggleFavorite}
            size="sm"
            isIconOnly
            className={cn(
              "rounded-xl transition-all duration-200 min-h-10 min-w-10",
              isFavorite
                ? "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30"
                : "bg-white/10 border border-white/20 text-Grey-400 hover:bg-white/20 hover:text-white hover:scale-[1.02]"
            )}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
        </div>
      </div>
    </div>
  );
}