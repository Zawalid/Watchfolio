import BaseMediaCard from '@/components/media/BaseMediaCard';

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
      id={item.id}
      title={title}
      mediaType={item.media_type}
      posterPath={item.posterPath}
      releaseDate={item.releaseDate}
      rating={item.userRating || item.rating}
      genres={item.genres}
      item={item}
      tabIndex={tabIndex}
      isOwnProfile={isOwnProfile}
    />
  );
}
