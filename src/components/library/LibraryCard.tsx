import BaseMediaCard from '@/components/media/BaseMediaCard';

interface LibraryCardProps {
  item: LibraryMedia;
  tabIndex?: number;
  isFocused?: boolean;
}

export default function LibraryCard({ item, tabIndex }: LibraryCardProps) {
  const title = item.title || 'Untitled';
  const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;

  return (
    <BaseMediaCard
      id={item.id}
      title={title}
      mediaType={item.media_type}
      posterPath={item.posterPath}
      releaseYear={releaseYear}
      rating={item.userRating}
      genres={item.genres}
      item={item}
      tabIndex={tabIndex}
    />
  );
}
