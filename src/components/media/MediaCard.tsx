import { getGenres, getMediaType, getRating } from '@/utils/media';
import BaseMediaCard from './BaseMediaCard';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { generateMediaId } from '@/utils/library';

interface MediaCardProps {
  media: Media;
  tabIndex?: number;
}

export default function MediaCard({ media, tabIndex }: MediaCardProps) {
  const { id, poster_path, vote_average, genre_ids } = media;
  const media_type = getMediaType(media);
  const title = (media_type === 'movie' ? (media as Movie).title : (media as TvShow).name) || 'Untitled';
  const rating = getRating(vote_average || 0);
  const item = useLibraryStore((state) => state.getItem(generateMediaId({ ...media, media_type })));

  return (
    <BaseMediaCard
      id={id}
      title={title}
      mediaType={media_type}
      posterPath={poster_path}
      releaseDate={(media as Movie).release_date || (media as TvShow).first_air_date}
      rating={rating ? Number(rating) : undefined}
      genres={getGenres(genre_ids) || []}
      item={item}
      media={media}
      tabIndex={tabIndex}
    />
  );
}
