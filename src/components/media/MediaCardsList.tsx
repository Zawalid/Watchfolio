import { useNavigate } from 'react-router';
import { InfiniteCardsList, InfiniteCardsListProps } from '@/components/ui/InfiniteCardsList';
import MediaCard from './MediaCard';
import MediaCardsListSkeleton from './MediaCardsListSkeleton';
import { Film } from 'lucide-react';
import { getMediaType } from '@/utils/media';
import { generateMediaLink } from '@/utils/media';

export default function MediaCardsList(
  props: Omit<
    InfiniteCardsListProps<Media>,
    | 'CardComponent'
    | 'SkeletonComponent'
    | 'getItemKey'
    | 'errorMessage'
    | 'noResultsMessage'
    | 'emptyMessage'
    | 'emptyIcon'
    | 'emptyTitle'
  >
) {
  const navigate = useNavigate();

  return (
    <InfiniteCardsList
      {...props}
      CardComponent={({ item, tabIndex }: { item: Media; tabIndex?: number }) => (
        <MediaCard media={item} tabIndex={tabIndex} />
      )}
      SkeletonComponent={MediaCardsListSkeleton}
      getItemKey={(item: Media) => item.id}
      errorMessage='There was an error loading the media list. Please try again.'
      noResultsMessage="We couldn't find any movies or TV shows matching your search. Try different keywords or explore trending content."
      emptyMessage='It seems there are no media at the moment. Please come back and check later.'
      emptyIcon={Film}
      emptyTitle='No Media'
      onSelect={(item) => {
        const type = getMediaType(item);
        navigate(
          generateMediaLink(
            type,
            item.id,
            (type === 'movie' ? (item as Movie).title : (item as TvShow).name) || 'Untitled'
          )
        );
      }}
    />
  );
}
