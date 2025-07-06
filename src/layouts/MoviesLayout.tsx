import { Film, TrendingUp, Star, Calendar, PlayCircle } from 'lucide-react';
import MediaLayout from '@/components/media/MediaLayout';

const MOVIE_CATEGORIES = [
  {
    id: 'popular',
    label: 'Popular',
    description: "Trending movies everyone's talking about",
    icon: TrendingUp,
    gradient: 'from-Primary-500 to-Secondary-500',
  },
  {
    id: 'top-rated',
    label: 'Top Rated',
    description: 'Critically acclaimed masterpieces',
    icon: Star,
    gradient: 'from-Warning-500 to-Warning-600',
  },
  {
    id: 'now-playing',
    label: 'Now Playing',
    description: 'Currently in theaters',
    icon: PlayCircle,
    gradient: 'from-Success-500 to-Success-600',
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    description: 'Soon to be released',
    icon: Calendar,
    gradient: 'from-Secondary-500 to-Secondary-600',
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
      filterOptions={['genres', 'networks', 'language', 'ratingRange', 'releaseYear']}
      filterTitle='Movie Filters'
    />
  );
}
