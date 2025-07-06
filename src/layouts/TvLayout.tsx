import { Tv, TrendingUp, Star, Calendar, Zap } from 'lucide-react';
import MediaLayout from '@/components/media/MediaLayout';

const TV_CATEGORIES = [
  {
    id: 'popular',
    label: 'Popular',
    description: "Trending TV shows everyone's talking about",
    icon: TrendingUp,
    gradient: 'from-Primary-500 to-Secondary-500',
  },
  {
    id: 'top-rated',
    label: 'Top Rated',
    description: 'Outstanding series with exceptional storytelling',
    icon: Star,
    gradient: 'from-Warning-500 to-Warning-600',
  },
  {
    id: 'airing-today',
    label: 'Airing Today',
    description: 'New episodes dropping today',
    icon: Zap,
    gradient: 'from-Success-500 to-Success-600',
  },
  {
    id: 'on-tv',
    label: 'On TV',
    description: 'Currently airing and upcoming shows',
    icon: Calendar,
    gradient: 'from-Secondary-500 to-Secondary-600',
  },
];

export default function TvLayout() {
  return (
    <MediaLayout
      title='TV Shows'
      subtitle='Discover your next binge-worthy series'
      icon={Tv}
      iconGradient='from-Secondary-400 to-Primary-400'
      categories={TV_CATEGORIES}
      sortOptions={[
        { key: 'popularity', label: 'Popularity' },
        { key: 'vote_average', label: 'Rating' },
        { key: 'first_air_date', label: 'Air Date' },
        { key: 'name', label: 'Title' },
      ]}
      filterOptions={['genres', 'networks', 'language', 'ratingRange', 'releaseYear']}
      filterTitle='TV Show Filters'
      specialCategoryHandling={{
        categoryId: 'on-tv',
        displayName: 'On TV',
      }}
    />
  );
}
