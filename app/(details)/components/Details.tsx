import Cast from './Cast';
import { Info } from './Info';
import Seasons from './Seasons';
import Trailers from './Trailers';

export default function Details({ media, }: { media: TvShowDetails | MovieDetails }) {
  return (
    <div className=''>
      <Info media={media} />
      {media.media_type === 'tv' && 'seasons' in media && (
        <Seasons seasons={media.seasons} show={(media as TvShowDetails)} />
      )}
      <Cast cast={media.credits.cast} />
      <Trailers videos={media.videos?.results || []} />
    </div>
  );
}
