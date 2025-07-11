import { useParams } from 'react-router';
import Cast from '@/components/media-details/Cast';
import Info from '@/components/media-details/Info';
import Seasons from '@/components/media-details/Seasons';
import Trailers from '@/components/media-details/Trailers';
import { useQuery } from '@tanstack/react-query';
import { getDetails } from '@/lib/api/TMDB';
import DetailsSkeleton from '@/components/skeletons/DetailsSkeleton';
import { Error } from '@/components/Status';
import Recommendations from '@/components/media-details/Recommendations';
import Similar from '@/components/media-details/Similar';

export default function Details({ type }: { type: 'movie' | 'tv' }) {
  // const media = useLoaderData() as Media;
  const { slug } = useParams();
  const {
    data: media,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['details', type, slug],
    queryFn: async () => await getDetails(type, slug!),
  });

  if (isPending) return <DetailsSkeleton type={type} />;
  if (isError) return <Error />;
  if (!media) return;

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
