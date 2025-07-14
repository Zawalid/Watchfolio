import { Film, TrendingUp, Star, Calendar, PlayCircle } from 'lucide-react';
import MediaLayout from '@/layouts/MediaLayout';

const MOVIE_CATEGORIES = [
  {
    id: 'popular',
    label: 'Popular',
    description: "Trending movies everyone's talking about",
    icon: TrendingUp,
  },
  {
    id: 'top-rated',
    label: 'Top Rated',
    description: 'Critically acclaimed masterpieces',
    icon: Star,
  },
  {
    id: 'now-playing',
    label: 'Now Playing',
    description: 'Currently in theaters',
    icon: PlayCircle,
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    description: 'Soon to be released',
    icon: Calendar,
  },
];

export default function MoviesLayout() {
  return (
    <MediaLayout
      title='Movies'
      subtitle='Discover your next cinematic adventure'
      icon={Film}
      iconGradient='from-Success-400 to-Primary-400'
      categories={MOVIE_CATEGORIES}
      sortOptions={[
        { key: 'popularity', label: 'Popularity' },
        { key: 'vote_average', label: 'Rating' },
        { key: 'release_date', label: 'Release Date' },
        { key: 'title', label: 'Title' },
      ]}
      filterOptions={['genres', 'language', 'ratingRange', 'releaseYear']}
      filterTitle='Movie Filters'
    />
  );
}
