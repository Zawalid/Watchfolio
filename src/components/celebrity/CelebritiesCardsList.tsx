import { useNavigate } from 'react-router';
import { InfiniteCardsList, InfiniteCardsListProps } from '@/components/ui/InfiniteCardsList';
import PersonCard from '@/components/celebrity/details/CelebrityCard';
import CelebritiesCardsListSkeleton from '@/components/celebrity/CelebritiesCardsListSkeleton';
import { Users2Icon } from 'lucide-react';
import { slugify } from '@/utils';

export default function CelebritiesCardsList(
  props: Omit<
    InfiniteCardsListProps<Person>,
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
      CardComponent={({ item, tabIndex }: { item: Person; tabIndex?: number }) => (
        <PersonCard person={item} tabIndex={tabIndex} />
      )}
      SkeletonComponent={CelebritiesCardsListSkeleton}
      getItemKey={(item: Person) => item.id}
      errorMessage='There was an error loading the celebrity list. Please try again.'
      noResultsMessage="We couldn't find any celebrities matching your search. Try different keywords or explore trending celebrities."
      emptyMessage='It seems there are no celebrities at the moment. Please come back and check later.'
      emptyIcon={Users2Icon}
      emptyTitle='No Celebrities'
      onSelect={(item) => {
        navigate(`/celebrities/${item.id}-${slugify(item.name)}`);
      }}
    />
  );
}
