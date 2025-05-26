import { formatDate } from '.';

export const getRating = (rating: number) => (rating % 1 === 0 ? rating : rating.toFixed(1));

export const getReleaseYear = (media: TvShow | Movie, format: 'year' | 'full' = 'year') => {
  const dateStr = (media as Movie).release_date || (media as TvShow).first_air_date;

  if (!dateStr) return null;

  if (format === 'year') {
    return new Date(dateStr).getFullYear();
  } else {
    return formatDate(dateStr);
  }
};

export const getMediaType = (media: TvShow | Movie): 'movie' | 'tv' => {
  if (media.media_type) return media.media_type;
  if ((media as Movie).release_date !== undefined) {
    return 'movie';
  } else if ((media as TvShow).first_air_date !== undefined) {
    return 'tv';
  }
  throw new Error('Unknown media type');
};

export const getFormattedRuntime = (media: TvShowDetails | MovieDetails): string => {
  const runtime = (media as MovieDetails).runtime || (media as TvShowDetails).episode_run_time?.[0];

  console.log(runtime)

  if (!runtime) return 'N/A';

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${getMediaType(media) === 'tv' ? '/Episode' : ''}`;
};

export const getDirectorOrCreator = (media: MovieDetails | TvShowDetails): Person | null => {
  const mediaType = getMediaType(media);

  if (mediaType === 'movie') {
    const movieMedia = media as MovieDetails;
    return movieMedia.credits?.crew?.find((person) => person.job === 'Director') || null;
  } else {
    const tvMedia = media as TvShowDetails;
    return tvMedia.created_by?.[0] || null;
  }
};
