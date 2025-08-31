import BaseMediaCard from '@/components/media/BaseMediaCard';
import { getGenres } from '@/utils/media';

interface LibraryCardProps {
  item: LibraryMedia;
  tabIndex?: number;
  isFocused?: boolean;
  isOwnProfile?: boolean;
}

export default function LibraryCard({ item, tabIndex, isOwnProfile }: LibraryCardProps) {
  const title = item.title || 'Untitled';

  return (
    <BaseMediaCard
      id={item.tmdbId}
      title={title}
      mediaType={item.media_type}
      posterPath={item.posterPath}
      releaseDate={item.releaseDate}
      rating={item.rating}
      genres={getGenres(item.genres || [])}
      item={item}
      tabIndex={tabIndex}
      isOwnProfile={isOwnProfile}
    />
  );
}
