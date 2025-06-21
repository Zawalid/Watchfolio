import { JSX, useState, useEffect, useRef } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useNavigate } from 'react-router';
import MediaCard from './MediaCard';
import { Pagination } from '@/components/ui/Pagination';
import MediaCardsListSkeleton from '@/components/skeletons/MediaCardsListSkeleton';
import { Error, NoResults } from '@/components/Status';
import { Slider } from '@/components/ui/slider';
import { useListNavigator } from '@/hooks/useListNavigator';
import { generateMediaLink, getMediaType } from '@/utils/media';

type MediaCardsListProps = {
  queryOptions: UseQueryOptions<TMDBResponse>;
  asSlider?: boolean;
  emptyComponent?: JSX.Element;
  errorMessage?: string;
};

export default function MediaCardsList({ queryOptions, asSlider, emptyComponent, errorMessage }: MediaCardsListProps) {
  const [query] = useQueryState('query', { defaultValue: '' });
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
    queryKey: [...new Set([...queryOptions.queryKey, query, page])],
  });

  useEffect(() => {
    setFocusIndex(-1);
  }, [data?.results, query, page]);

  useListNavigator({
    containerRef: cardsContainerRef,
    itemSelector: '[role="article"]',
    itemCount: data?.results?.length || 0,
    currentIndex: focusIndex,
    onNavigate: setFocusIndex,
    onSelect: (index) => {
      if (index >= 0 && data?.results?.[index]) {
        const media = data.results[index];
        const type = getMediaType(media);
        navigate(
          generateMediaLink(
            type,
            media.id,
            (type === 'movie' ? (media as Movie).title : (media as TvShow).name) || 'Untitled'
          )
        );
      }
    },
    orientation: 'grid',
    enabled: !isLoading && !isError && (data?.results?.length || 0) > 0 && !asSlider,
    loop: true,
    autoFocus: true,
  });

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
      <div ref={cardsContainerRef} className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-5'>
        {data?.results?.map((media, index) => (
          <MediaCard key={media.id} media={media} tabIndex={focusIndex === index ? 0 : -1} />
        ))}
      </div>
      <Pagination
        total={Math.min(data?.total_pages || 0, 500)} //? Because te TMDB API only allows up to 500 pages
        page={page || data?.page}
        siblings={2}
      />
    </>
  );
}
