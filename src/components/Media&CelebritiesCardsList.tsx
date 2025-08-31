import { useNavigate } from 'react-router';
import { InfiniteCardsList, InfiniteCardsListProps } from '@/components/ui/InfiniteCardsList';
import MediaCard from './media/MediaCard';
import MediaCardsListSkeleton from './media/MediaCardsListSkeleton';
import PersonCard from '@/components/celebrity/details/CelebrityCard';
import CelebritiesCardsListSkeleton from '@/components/celebrity/CelebritiesCardsListSkeleton';
import { Film, Users2Icon } from 'lucide-react';
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
      getItemKey={(item: MediaOrPerson) => `${isPerson(item) ? 'person' : item.media_type}-${item.id}`}
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
          : props.queryKey.includes('recommendations')
            ? "We couldn't find any recommendations based on this content. Explore trending titles instead."
            : props.queryKey.includes('similar')
              ? "We couldn't find any similar content based on this item. Discover more trending shows and movies."
              : 'It seems there are no media at the moment. Please come back and check later.'
      }
      emptyIcon={contentType === 'person' ? Users2Icon : Film}
      emptyTitle={contentType === 'person' ? 'No Celebrities Available' : 'No Titles Available'}
      onSelect={(item) => {
        if (isPerson(item)) navigate(`/celebrities/${item.id}-${slugify(item.name)}`);
        else navigate(generateMediaLink(item));
      }}
    />
  );
}
