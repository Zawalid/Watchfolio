'use client';

import { useMemo } from 'react';
import { Star, Film, Tv, type LucideIcon, TrendingUp, Calendar, SquareArrowOutUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { cn } from '@/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className: string;
  layoutClassName?: string;
  description?: string;
  delay?: number;
  link?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  className,
  layoutClassName,
  description,
  delay = 0,
  trend,
  link,
}: StatCardProps) => {
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
      className={cn(
        'group relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        className,
        layoutClassName
      )}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='mb-1 flex items-center gap-2'>
            <Icon className='size-4' />
            <span className='text-Grey-200 text-sm font-medium'>{label}</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay * 0.1 + 0.2 }}
            className='mb-1 text-2xl leading-tight font-bold'
          >
            {value}
          </motion.div>
          
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay * 0.1 + 0.3 }}
              className='text-Grey-400 text-xs leading-tight'
            >
              {description}
            </motion.p>
          )}
        </div>

        <div className='flex flex-col items-end gap-2'>
          {link && (
            <Link
              to={link}
              className={cn(
                'flex relative z-10 h-8 w-8 items-center justify-center rounded-full opacity-80 transition-all duration-300 hover:opacity-100',
                className
              )}
              aria-label={`View all ${label.toLowerCase()}`}
            >
              <SquareArrowOutUpRight className='size-3' />
            </Link>
          )}
          
          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay * 0.1 + 0.3 }}
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                trend.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              )}
            >
              <TrendingUp className={cn('size-3', trend.isPositive ? '' : 'rotate-180')} />
              {Math.abs(trend.value)}%
            </motion.div>
          )}
        </div>
      </div>

      {/* Simple background pattern */}
      <div className='absolute -top-4 -right-4 opacity-5'>
        <Icon className='size-16' />
      </div>
    </motion.div>
  );
};;

interface LibraryStatsProps {
  items: LibraryMedia[];
}

export default function LibraryStats({ items }: LibraryStatsProps) {
  const stats = useMemo(() => {
    const ratedItems = items.filter((item) => item.userRating && item.userRating > 0);
    const avgRating =
      ratedItems.length > 0 ? ratedItems.reduce((sum, item) => sum + (item.userRating || 0), 0) / ratedItems.length : 0;

    const movies = items.filter((item) => item.media_type === 'movie');
    const tvShows = items.filter((item) => item.media_type === 'tv');

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

  const statusCards = LIBRARY_MEDIA_STATUS.map((status) => ({
    label: status.label,
    value: stats[status.value as keyof typeof stats],
    icon: status.icon,
    className: status.className,
    description: status.descriptions.stats,
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
      layoutClassName: 'xl:col-span-2 2xl:col-span-1',
      description: `${stats.ratedCount} rated items`,
    },
    {
      label: 'Recent Activity',
      value: stats.recentActivity,
      icon: Calendar,
      className: 'text-Secondary-400 bg-Secondary-500/20 border-Secondary-500/30',
      layoutClassName: 'lg:col-span-3 xl:col-span-2 2xl:col-span-1',
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
