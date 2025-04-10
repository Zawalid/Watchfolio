import { Suspense, type JSX } from 'react';
// import { useAutoAnimate } from '@formkit/auto-animate/react';
import { NoResults } from './Status';
import Card from './Card';
import { getMediaType } from '@/utils';
import Pagination from './ui/Pagination';
import CardsListSkeleton from './CardsSkeleton';
// import { useSearchParams } from '@/hooks/useSearchParams';

type Props = {
  data: TMDBResponse;
  query?: string;
  page?: number;
  emptyComponent?: JSX.Element;
};

function List({ data, emptyComponent, query = '', page }: Props) {
  // const [parent] = useAutoAnimate({ duration: 400 });

  const filteredData = data.results.filter((media) => {
    const title = getMediaType(media) === 'movie' ? (media as Movie).title : (media as TvShow).name;
    return title.toLowerCase().includes(query.toLowerCase());
  });

  if (query && !filteredData.length) return <NoResults />;
  if (!data?.results.length && emptyComponent) return emptyComponent;

  return (
    <>
      <div
        className='grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-start gap-5 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'
        // ref={parent}
      >
        {filteredData.map((media) => (
          <Card key={media.id} media={media} />
        ))}
      </div>
      <Pagination
        total={Math.min(data.total_pages, 500)} // Because te TMDB API only allows up to 500 pages
        page={page || data.page}
        siblings={2}
      />
    </>
  );
}

export default function CardsList(props: Props) {
  return (
    <Suspense fallback={<CardsListSkeleton />}>
      <List {...props} />
    </Suspense>
  );
}
