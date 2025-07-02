import { getMediaType, getRating, getReleaseYear } from '@/utils/media';
import { GENRES } from '@/lib/api/TMDB/values';
import BaseMediaCard from './BaseMediaCard';
import { useLibraryStore } from '@/stores/useLibraryStore';

interface MediaCardProps {
  media: Media;
  tabIndex?: number;
}

export default function MediaCard({ media, tabIndex }: MediaCardProps) {
  const { id, poster_path, vote_average, genre_ids } = media;
  const type = getMediaType(media);
  const title = (type === 'movie' ? (media as Movie).title : (media as TvShow).name) || 'Untitled';
  const releaseYear = getReleaseYear(media);
  const rating = getRating(vote_average || 0);

  const { getItem } = useLibraryStore();

  const item = getItem(type, id);

  const displayGenres =
    genre_ids
      ?.slice(0, 2)
      .map((id) => GENRES.find((genre) => genre.id === id)?.label || 'Unknown')
      .filter(Boolean) || [];

  return (
    <BaseMediaCard
      id={id}
      title={title}
      mediaType={type}
      posterPath={poster_path}
      releaseYear={releaseYear ? Number(releaseYear) : null}
      rating={rating ? Number(rating) : undefined}
      genres={displayGenres}
      item={item}
      media={media}
      tabIndex={tabIndex}
    />
  );
}
