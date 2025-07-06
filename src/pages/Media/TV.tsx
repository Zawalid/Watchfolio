import MediaPage from '@/components/media/MediaPage';
import { TMDB_TV_CATEGORIES } from '@/utils/constants';

export default function Tv() {
  return <MediaPage type='tv' categories={TMDB_TV_CATEGORIES} />;
}
