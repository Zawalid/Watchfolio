import { formatDate } from '.';

export const getRating = (rating: number) => (rating % 1 === 0 ? rating : rating.toFixed(1));

export const getReleaseYear = (media: Media, format: 'year' | 'full' = 'year') => {
  const dateStr = (media as Movie).release_date || (media as TvShow).first_air_date;

  if (!dateStr) return null;

  if (format === 'year') {
    return new Date(dateStr).getFullYear();
  } else {
    return formatDate(dateStr);
  }
};

export const getMediaType = (media: Media): 'movie' | 'tv' => {
  if (media.media_type) return media.media_type;
  if ((media as Movie).release_date !== undefined) {
    return 'movie';
  } else if ((media as TvShow).first_air_date !== undefined) {
    return 'tv';
  }
  throw new Error('Unknown media type');
};

export const getFormattedRuntime = (media: Media): string => {
  const runtime = (media as Movie).runtime || (media as TvShow).episode_run_time?.[0];


  if (!runtime) return 'N/A';

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${getMediaType(media) === 'tv' ? '/Episode' : ''}`;
};

export const getDirectorOrCreator = (media: Media): Person | null => {
  const mediaType = getMediaType(media);

  if (mediaType === 'movie') {
    const movieMedia = media as Movie;
    return movieMedia.credits?.crew?.find((person) => person.job === 'Director') || null;
  } else {
    const tvMedia = media as TvShow;
    return tvMedia.created_by?.[0] || null;
  }
};
