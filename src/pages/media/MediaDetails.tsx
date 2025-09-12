import { useParams } from 'react-router';
import Cast from '@/components/media/details/Cast';
import Info from '@/components/media/details/Info';
import Seasons from '@/components/media/details/Seasons';
import Media from '@/components/media/details/Media';
import DetailsSkeleton from '@/components/media/details/DetailsSkeleton';
import Recommendations from '@/components/media/details/Recommendations';
import Similar from '@/components/media/details/Similar';
import { useQuery } from '@tanstack/react-query';
import { getDetails } from '@/lib/api/TMDB';
import { Status } from '@/components/ui/Status';
import { usePageTitle } from '@/hooks/usePageTitle';
import { queryKeys } from '@/lib/react-query';

export default function MediaDetails({ type }: { type: MediaType }) {
  const { slug } = useParams();
  const id = parseInt(slug!);

  const {
    data: media,
    isLoading,
    isError,
  } = useQuery({ queryKey: queryKeys.details(type, id), queryFn: async () => await getDetails(type, id) });

  usePageTitle(isLoading ? 'Loading...' : (media as Movie)?.title || (media as TvShow)?.name || '');

  if (isLoading) return <DetailsSkeleton type={type} />;
  if (!media)
    return (
      <Status.NotFound
        title={`${type === 'tv' ? 'TV Show' : 'Movie'} Not Found`}
        message='The media you are looking for does not exist. Please try again with a different media.'
      />
    );
  if (isError) return <Status.Error message='There was an error loading the media details. Please try again.' />;

  const mediaTitle = type === 'movie' ? (media as Movie).title : (media as TvShow).name;

  return (
    <div>
      <Info media={media} />
      <div>
        {type === 'tv' && 'seasons' in media && <Seasons seasons={media.seasons || []} show={media as TvShow} />}
        <Media videos={media.videos?.results || []} images={media.images} mediaTitle={mediaTitle} />
        <Cast cast={media.credits?.cast || []} />
        <Similar type={type} id={media.id} />
        <Recommendations type={type} id={media.id} />
      </div>
    </div>
  );
}
