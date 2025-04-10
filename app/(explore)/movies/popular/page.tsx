import { getPopularMovies } from '@/lib/api';
import WithPagination from '../../components/WithPagination';

export const metadata = {
  title: 'Popular Movies | Watchfolio',
  description: 'List of popular movies',
};

export default WithPagination(getPopularMovies);
