import { JSX } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import MediaCard from './MediaCard';
import Pagination from '@/components/ui/Pagination';
import MediaCardsListSkeleton from '@/components/skeletons/MediaCardsListSkeleton';
import { Error, NoResults } from '@/components/Status';
import { Slider } from '@/components/ui/slider';

type MediaCardsListProps = {
  queryOptions: UseQueryOptions<TMDBResponse>;
  asSlider?: boolean;
  emptyComponent?: JSX.Element;
  errorMessage?: string;
};

export default function MediaCardsList({ queryOptions, asSlider, emptyComponent, errorMessage }: MediaCardsListProps) {
  const [query] = useQueryState('query', { defaultValue: '' });
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));

  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
    queryKey: [...new Set([...queryOptions.queryKey, query, page])],
  });

  const [parent] = useAutoAnimate({ duration: 500 });

  if (isError) return <Error message={errorMessage} />;
  if (isLoading) return <MediaCardsListSkeleton asSlider={asSlider} />;
  if (query && !data?.results?.length) return <NoResults />;
  if (data?.total_results === 0 && emptyComponent) return emptyComponent;

  if (asSlider)
    return (
      <Slider smartSlide={true}>
        {data?.results?.map((media) => (
          <Slider.Slide key={media.id} className='w-[160px] sm:w-[200px]!'>
            <MediaCard key={media.id} media={media} />
          </Slider.Slide>
        ))}
      </Slider>
    );

  return (
    <>
      <div
        className='grid items-start gap-5 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'
        ref={parent}
      >
        {data?.results?.map((media) => <MediaCard key={media.id} media={media} />)}
      </div>
      <Pagination
        total={Math.min(data?.total_pages || 0, 500)} //? Because te TMDB API only allows up to 500 pages
        page={page || data?.page}
        siblings={2}
      />
    </>
  );
}
