import { useLoaderData } from 'react-router';
import Cast from '@/components/details/Cast';
import Info from '@/components/details/Info';
import Seasons from '@/components/details/Seasons';
import Trailers from '@/components/details/Trailers';

export default function Details({ type }: { type: 'movie' | 'tv' }) {
  const media = useLoaderData() as TvShowDetails | MovieDetails;

  return (
    <div className=''>
      <Info media={media} />
      {type === 'tv' && 'seasons' in media && <Seasons seasons={media.seasons} show={media as TvShowDetails} />}
      <Cast cast={media.credits.cast} />
      <Trailers videos={media.videos?.results || []} />
    </div>
  );
}
