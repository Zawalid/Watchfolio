import { getGenres, getMediaType, getRating } from '@/utils/media';
import BaseMediaCard from './BaseMediaCard';
import { generateMediaId } from '@/utils/library';
import { useLibraryItem } from '@/hooks/library/useLibraryQueries';

interface MediaCardProps {
  media: Media;
  tabIndex?: number;
}

export default function MediaCard({ media, tabIndex }: MediaCardProps) {
  const { id, poster_path, vote_average, genre_ids } = media;
  const media_type = getMediaType(media);
  const title = (media_type === 'movie' ? (media as Movie).title : (media as TvShow).name) || 'Untitled';
  const rating = getRating(vote_average || 0);
  const { data: item } = useLibraryItem(generateMediaId({ ...media, media_type }));

  return (
    <BaseMediaCard
      id={id}
      title={title}
      mediaType={media_type}
      posterPath={poster_path}
      releaseDate={(media as Movie).release_date || (media as TvShow).first_air_date}
      rating={rating ? Number(rating) : undefined}
      genres={getGenres(genre_ids) || []}
      item={item || undefined}
      media={media}
      tabIndex={tabIndex}
    />
  );
}
