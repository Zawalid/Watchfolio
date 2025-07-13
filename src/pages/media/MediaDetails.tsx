import { useParams } from 'react-router';
import Cast from '@/components/media/details/Cast';
import Info from '@/components/media/details/Info';
import Seasons from '@/components/media/details/Seasons';
import Trailers from '@/components/media/details/Trailers';
import DetailsSkeleton from '@/components/media/details/DetailsSkeleton';
import Recommendations from '@/components/media/details/Recommendations';
import Similar from '@/components/media/details/Similar';
import { useQuery } from '@tanstack/react-query';
import { getDetails } from '@/lib/api/TMDB';
import { Status } from '@/components/ui/Status';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function MediaDetails({ type }: { type: 'movie' | 'tv' }) {
  const { slug } = useParams();
  const {
    data: media,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['details', type, slug],
    queryFn: async () => await getDetails(type, slug!),
  });

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

  return (
    <div>
      <Info media={media} />
      <div>
        {type === 'tv' && 'seasons' in media && <Seasons seasons={media.seasons || []} show={media as TvShow} />}
        <Cast cast={media.credits?.cast || []} />
        <Trailers videos={media.videos?.results || []} />
        <Similar type={type} id={media.id} />
        <Recommendations type={type} id={media.id} />
      </div>
    </div>
  );
}
