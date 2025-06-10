'use client';

import { useMemo } from 'react';
import { Star, Film, Tv, type LucideIcon, TrendingUp, Calendar, SquareArrowOutUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { USER_MEDIA_STATUS } from '@/utils/constants';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className: string;
  description?: string;
  delay?: number;
  link?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ label, value, icon: Icon, className, description, delay = 0, trend, link }: StatCardProps) => {
  const [textColor, bgColor, borderColor] = className.split(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: delay * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 ${borderColor || 'border-white/10'}`}
    >
      {/* Animated background gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

      {/* Glow effect */}
      <div
        className={`absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20 ${bgColor}`}
      />

      <div className='relative z-10'>
        <div className='mb-4 flex items-center justify-between'>
          <div className={`relative rounded-xl p-3 ${bgColor || 'bg-white/10'} backdrop-blur-sm`}>
            <Icon className={`size-6 ${textColor || 'text-Primary-300'}`} />
            {/* Icon glow */}
            <div
              className={`absolute inset-0 rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30 ${bgColor}`}
            />
          </div>

          {link ? (
            <Link
              to={link}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor} opacity-80 transition-all duration-300 hover:opacity-100`}
              aria-label={`View all ${label.toLowerCase()}`}
            >
              <SquareArrowOutUpRight className={`size-4 ${textColor}`} />
            </Link>
          ) : trend ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay * 0.1 + 0.3 }}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                trend.isPositive ? 'bg-Success-500/20 text-Success-400' : 'bg-Error-500/20 text-Error-400'
              }`}
            >
              <TrendingUp className={`size-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
              {Math.abs(trend.value)}%
            </motion.div>
          ) : null}
        </div>

        <div className='space-y-1'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay * 0.1 + 0.2 }}
            className='text-Primary-50 text-3xl font-bold transition-colors duration-300 group-hover:text-white'
          >
            {value}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay * 0.1 + 0.25 }}
            className='text-Grey-300 group-hover:text-Primary-50 text-sm font-medium transition-colors duration-300'
          >
            {label}
          </motion.p>
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay * 0.1 + 0.3 }}
              className='text-Grey-500 group-hover:text-Grey-400 text-xs transition-colors duration-300'
            >
              {description}
            </motion.p>
          )}
        </div>
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
    const willWatch = items.filter((item) => item.status === 'willWatch');
    const onHold = items.filter((item) => item.status === 'onHold');
    const dropped = items.filter((item) => item.status === 'dropped');
    const favorites = items.filter((item) => item.isFavorite);

    // Calculate recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentItems = items.filter((item) => new Date(item.addedToLibraryAt) > thirtyDaysAgo);

    return {
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
      recentActivity: recentItems.length,
    };
  }, [items]);

  // Build status cards from USER_MEDIA_STATUS constant
  const statusCards = USER_MEDIA_STATUS.map((status) => ({
    label: status.label,
    value: stats[status.value as keyof typeof stats],
    icon: status.icon,
    className: status.className,
    description: status.description,
    link: `/library/${status.value}`,
    ...(status.value === 'watching' ? { trend: { value: 8, isPositive: true } } : {}),
    ...(status.value === 'watched' ? { trend: { value: 15, isPositive: true } } : {}),
  }));

  const statCardsData: StatCardProps[] = [
    {
      label: 'Movies',
      value: stats.movies,
      icon: Film,
      className: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      description: 'Movies tracked',
      link: '/library/movies',
    },
    {
      label: 'TV Shows',
      value: stats.tvShows,
      icon: Tv,
      className: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      description: 'Series followed',
      link: '/library/tv',
    },
    ...statusCards,
    {
      label: 'Average Rating',
      value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A',
      icon: Star,
      className: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      description: `${stats.ratedCount} rated items`,
    },
    {
      label: 'Recent Activity',
      value: stats.recentActivity,
      icon: Calendar,
      className: 'text-Secondary-400 bg-Secondary-500/20 border-Secondary-500/30',
      description: 'Last 30 days',
      trend: { value: 25, isPositive: true },
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {statCardsData.map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index} />
        ))}
      </div>
    </motion.div>
  );
}
