import MediaPage from '@/components/media/MediaPage';
import { TMDB_MOVIE_CATEGORIES } from '@/utils/constants';

export default function Movies() {
  return <MediaPage type='movie' categories={TMDB_MOVIE_CATEGORIES} />;
}
