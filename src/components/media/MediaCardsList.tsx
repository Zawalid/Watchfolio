import { useEffect } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useNavigate } from 'react-router';
import { SwiperProps } from 'swiper/react';
import MediaCard from './MediaCard';
import { Pagination } from '@/components/ui/Pagination';
import MediaCardsListSkeleton from '@/components/media/MediaCardsListSkeleton';
import { Slider } from '@/components/ui/slider';
import { useListNavigator } from '@/hooks/useListNavigator';
import { useNavigation } from '@/contexts/NavigationContext';
import { generateMediaLink, getMediaType } from '@/utils/media';
import { cn } from '@/utils';
import { Status } from '@/components/ui/Status';
import { Film } from 'lucide-react';

type MediaCardsListProps = {
  queryOptions: UseQueryOptions<TMDBResponse>;
  asSlider?: boolean;
  slideClassName?: string;
  sliderProps?: SwiperProps;
};

export default function MediaCardsList({ queryOptions, asSlider, slideClassName, sliderProps }: MediaCardsListProps) {
  const [query] = useQueryState('query', { defaultValue: '' });
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const navigate = useNavigate();
  const { isActive } = useNavigation();

  const { data, isLoading, isError, refetch } = useQuery({
    ...queryOptions,
    queryKey: [...new Set([...queryOptions.queryKey, query, page])],
  });

  // Only enable navigation when this navigator is active
  const navigationEnabled =
    isActive('media-cards') && !isLoading && !isError && (data?.results?.length || 0) > 0 && !asSlider;

  const { containerRef, currentIndex, setCurrentIndex } = useListNavigator({
    itemCount: data?.results?.length || 0,
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
    enabled: navigationEnabled,
  });

  useEffect(() => {
    setCurrentIndex(-1);
  }, [data?.results, query, page, setCurrentIndex]);

  if (isLoading) return <MediaCardsListSkeleton asSlider={asSlider} />;
  if (isError)
    return (
      <Status.Error message='There was an error loading the media list. Please try again.' onRetry={() => refetch()} />
    );
  if (!data?.results?.length)
    return (
      <Status.NoResults message="We couldn't find any movies or TV shows matching your search. Try different keywords or explore trending content." />
    );
  if (data.total_results === 0)
    return (
      <Status.Empty
        Icon={Film}
        title='No Media'
        message='It seems there are no media at the moment. Please come back and check later.'
      />
    );

  if (asSlider)
    return (
      <Slider {...sliderProps}>
        {data?.results?.map((media) => (
          <Slider.Slide key={media.id} className={cn('w-[160px] sm:w-[200px]!', slideClassName)}>
            <MediaCard key={media.id} media={media} />
          </Slider.Slide>
        ))}
      </Slider>
    );

  return (
    <>
      <div ref={containerRef} className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-5'>
        {data?.results?.map((media, index) => (
          <MediaCard key={media.id} media={media} tabIndex={currentIndex === index ? 0 : -1} />
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
