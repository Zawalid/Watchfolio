import { useMemo } from 'react';
import { Clock, CheckCircle, Star, Heart, Film, Tv, Eye, AlertTriangle, XCircle, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClasses: string;
  description?: string;
  delay?: number;
}

const StatCard = ({ label, value, icon: Icon, colorClasses, description, delay = 0 }: StatCardProps) => {
  const [textColor, bgColor, borderColor] = colorClasses.split(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1, ease: 'easeOut' }}
      className={`rounded-xl border bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-xl ${borderColor || 'border-white/10'} group`}
    >
      <div className='mb-3 flex items-center justify-between'>
        <div className={`rounded-lg p-2.5 ${bgColor || 'bg-white/10'}`}>
          <Icon className={`size-5 ${textColor || 'text-Primary-300'}`} />
        </div>
      </div>
      <div>
        <div className='text-Primary-50 text-2xl font-bold md:text-3xl'>{value}</div>
        <p className='text-Grey-300 group-hover:text-Primary-50 text-sm font-medium transition-colors'>{label}</p>
        {description && <p className='text-Grey-500 mt-0.5 text-xs'>{description}</p>}
      </div>
    </motion.div>
  );
};

interface LibraryStatsProps {
  items: UserMediaData[];
}

export default function LibraryStats({ items }: LibraryStatsProps) {
  const stats = useMemo(() => {
    const ratedItems = items.filter((item) => item.userRating && item.userRating > 0);
    const avgRating =
      ratedItems.length > 0 ? ratedItems.reduce((sum, item) => sum + (item.userRating || 0), 0) / ratedItems.length : 0;

    const movies = items.filter((item) => item.mediaType === 'movie');
    const tvShows = items.filter((item) => item.mediaType === 'tv');

    // Status counts
    const watching = items.filter((item) => item.status === 'watching');
    const watched = items.filter((item) => item.status === 'watched');
    const willWatch = items.filter((item) => item.status === 'will-watch');
    const onHold = items.filter((item) => item.status === 'on-hold');
    const dropped = items.filter((item) => item.status === 'dropped');
    const favorites = items.filter((item) => item.isFavorite);

    return {
      total: items.length,
      movies: movies.length,
      tvShows: tvShows.length,
      watching: watching.length,
      watched: watched.length,
      willWatch: willWatch.length,
      onHold: onHold.length,
      dropped: dropped.length,
      favorites: favorites.length,
      avgRating,
      ratedCount: ratedItems.length,
    };
  }, [items]);

  const statCardsData: StatCardProps[] = [
    {
      label: 'Total Items',
      value: stats.total,
      icon: Film,
      colorClasses: 'text-Primary-400 bg-Primary-500/20 border-Primary-500/20',
      description: 'In your library',
    },
    {
      label: 'Movies',
      value: stats.movies,
      icon: Film,
      colorClasses: 'text-blue-400 bg-blue-500/20 border-blue-500/20',
      description: 'Movies tracked',
    },
    {
      label: 'TV Shows',
      value: stats.tvShows,
      icon: Tv,
      colorClasses: 'text-purple-400 bg-purple-500/20 border-purple-500/20',
      description: 'Series followed',
    },
    {
      label: 'Watching',
      value: stats.watching,
      icon: Clock,
      colorClasses: 'text-blue-400 bg-blue-500/20 border-blue-500/20',
      description: 'Currently viewing',
    },
    {
      label: 'Completed',
      value: stats.watched,
      icon: CheckCircle,
      colorClasses: 'text-green-400 bg-green-500/20 border-green-500/20',
      description: 'Finished watching',
    },
    {
      label: 'Plan to Watch',
      value: stats.willWatch,
      icon: Eye,
      colorClasses: 'text-purple-400 bg-purple-500/20 border-purple-500/20',
      description: 'On your list',
    },
    {
      label: 'On Hold',
      value: stats.onHold,
      icon: AlertTriangle,
      colorClasses: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/20',
      description: 'Paused viewing',
    },
    {
      label: 'Dropped',
      value: stats.dropped,
      icon: XCircle,
      colorClasses: 'text-red-400 bg-red-500/20 border-red-500/20',
      description: 'Stopped watching',
    },
    {
      label: 'Favorites',
      value: stats.favorites,
      icon: Heart,
      colorClasses: 'text-red-400 bg-red-500/20 border-red-500/20',
      description: 'Your top picks',
    },
    {
      label: 'Avg. Rating',
      value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A',
      icon: Star,
      colorClasses: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/20',
      description: `${stats.ratedCount} rated items`,
    },
  ];

  return (
    <div className='space-y-4'>
      <h3 className='text-Primary-50 text-lg font-semibold'>Library Statistics</h3>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {statCardsData.map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index} />
        ))}
      </div>
    </div>
  );
}
