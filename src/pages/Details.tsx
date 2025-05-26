import { useParams } from 'react-router';
import Cast from '@/components/details/Cast';
import Info from '@/components/details/Info';
import Seasons from '@/components/details/Seasons';
import Trailers from '@/components/details/Trailers';
import { useQuery } from '@tanstack/react-query';
import { getDetails } from '@/lib/api';
import DetailsSkeleton from '@/components/skeletons/DetailsSkeleton';
import { Error } from '@/components/Status';
import Recommendations from '@/components/details/Recommendations';
import Similar from '@/components/details/Similar';

export default function Details({ type }: { type: 'movie' | 'tv' }) {
  // const media = useLoaderData() as TvShowDetails | MovieDetails;
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
    <div >
      <Info media={media} />
      <div className='container'>
        {type === 'tv' && 'seasons' in media && <Seasons seasons={media.seasons} show={media as TvShowDetails} />}
        <Cast cast={media.credits.cast} />
        <Trailers videos={media.videos?.results || []} />
        <Similar type={type} id={media.id} />
        <Recommendations type={type} id={media.id} />
      </div>
    </div>
  );
}
