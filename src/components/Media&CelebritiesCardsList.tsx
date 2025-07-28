import { useNavigate } from 'react-router';
import { InfiniteCardsList, InfiniteCardsListProps } from '@/components/ui/InfiniteCardsList';
import MediaCard from './media/MediaCard';
import MediaCardsListSkeleton from './media/MediaCardsListSkeleton';
import PersonCard from '@/components/celebrity/details/CelebrityCard';
import CelebritiesCardsListSkeleton from '@/components/celebrity/CelebritiesCardsListSkeleton';
import { Film, Users2Icon } from 'lucide-react';
import { getMediaType } from '@/utils/media';
import { generateMediaLink } from '@/utils/media';
import { slugify } from '@/utils';

type MediaOrPerson = Media | Person;

export default function MediaAndCelebritiesCardsList(
  props: Omit<
    InfiniteCardsListProps<MediaOrPerson>,
    | 'CardComponent'
    | 'SkeletonComponent'
    | 'getItemKey'
    | 'errorMessage'
    | 'noResultsMessage'
    | 'emptyMessage'
    | 'emptyIcon'
    | 'emptyTitle'
  > & {
    contentType?: ContentType;
  }
) {
  const { contentType = 'movie' } = props;
  const navigate = useNavigate();

  const isPerson = (item: MediaOrPerson): item is Person => {
    return 'name' in item && !('title' in item) && !('first_air_date' in item);
  };

  return (
    <InfiniteCardsList
      {...props}
      CardComponent={({ item, tabIndex }: { item: MediaOrPerson; tabIndex?: number }) => {
        if (isPerson(item)) {
          return <PersonCard person={item} tabIndex={tabIndex} />;
        } else {
          return <MediaCard media={item} tabIndex={tabIndex} />;
        }
      }}
      SkeletonComponent={contentType === 'person' ? CelebritiesCardsListSkeleton : MediaCardsListSkeleton}
      getItemKey={(item: MediaOrPerson) => item.id}
      errorMessage={
        contentType === 'person'
          ? 'There was an error loading the celebrity list. Please try again.'
          : 'There was an error loading the media list. Please try again.'
      }
      noResultsMessage={
        contentType === 'person'
          ? "We couldn't find any celebrities matching your search. Try different keywords or explore trending celebrities."
          : "We couldn't find any movies or TV shows matching your search. Try different keywords or explore trending content."
      }
      emptyMessage={
        contentType === 'person'
          ? 'It seems there are no celebrities at the moment. Please come back and check later.'
          : 'It seems there are no media at the moment. Please come back and check later.'
      }
      emptyIcon={contentType === 'person' ? Users2Icon : Film}
      emptyTitle={contentType === 'person' ? 'No Celebrities' : 'No Media'}
      onSelect={(item) => {
        if (isPerson(item)) {
          // Navigate to celebrity details
          navigate(`/celebrities/${item.id}-${slugify(item.name)}`);
        } else {
          // Navigate to media details
          const type = getMediaType(item);
          navigate(
            generateMediaLink(
              type,
              item.id,
              (type === 'movie' ? (item as Movie).title : (item as TvShow).name) || 'Untitled'
            )
          );
        }
      }}
    />
  );
}
