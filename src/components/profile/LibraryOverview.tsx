import { motion } from 'framer-motion';
import { Star, Film, Tv, type LucideIcon, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/utils';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className: string;
  layoutClassName?: string;
  delay?: number;
}

function StatCard({ label, value, icon: Icon, className, layoutClassName, delay = 0 }: StatCardProps) {
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
        'group relative overflow-hidden rounded-xl border px-4 py-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        className,
        layoutClassName
      )}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay * 0.1 + 0.2 }}
            className='mb-1 text-xl leading-tight font-bold text-white/80'
          >
            {value}
          </motion.div>
          <div className='mb-1 flex items-center gap-2'>
            <Icon className='size-4' />
            <span className='text-Grey-200 text-sm font-medium'>{label}</span>
          </div>
        </div>
      </div>

      {/* Simple background pattern */}
      <div className='absolute -top-4 -right-4 opacity-5'>
        <Icon className='size-16' />
      </div>
    </motion.div>
  );
}

const getStats = (stats: LibraryStats) => {
  const statusCards: StatCardProps[] = LIBRARY_MEDIA_STATUS.map((status) => ({
    label: status.label,
    value: stats[status.value],
    icon: status.icon,
    className: status.className,
  }));

  return [
    {
      label: 'Movies',
      value: stats.movies,
      icon: Film,
      className: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    },
    {
      label: 'TV Shows',
      value: stats.tvShows,
      icon: Tv,
      className: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    },
    ...statusCards,
  ];
};

const formatHours = (hours: number) => {
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

export default function LibraryOverview({ stats }: { stats: LibraryStats }) {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {getStats(stats).map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index} />
        ))}
      </div>

      {/* Additional Stats */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Total Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='rounded-xl border border-white/5 bg-white/[0.015] p-4 backdrop-blur-sm'
        >
          <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
            <TrendingUp className='text-Primary-400 h-5 w-5' />
            Overview
          </h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-Grey-400 text-sm'>Total Items</span>
              <span className='font-semibold text-white'>{stats.totalItems}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-Grey-400 text-sm'>Total Watch Time</span>
              <span className='font-semibold text-white'>{formatHours(stats.totalHoursWatched)}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-Grey-400 text-sm'>Average Rating</span>
              <div className='flex items-center gap-1'>
                <Star className='fill-Warning-400 text-Warning-400 h-4 w-4' />
                <span className='font-semibold text-white'>{stats.averageRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Genres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className='rounded-xl border border-white/5 bg-white/[0.015] p-4 backdrop-blur-sm'
        >
          <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
            <Star className='text-Primary-400 h-5 w-5' />
            Top Genres
          </h3>
          <div className='space-y-3'>
            {stats.topGenres.slice(0, 5).map((genre) => (
              <div key={genre.name} className='flex items-center justify-between'>
                <span className='text-Grey-300 text-sm'>{genre.name}</span>
                <div className='flex items-center gap-2'>
                  <div className='bg-Grey-700 h-2 w-16 overflow-hidden rounded-full'>
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: `${(genre.count / stats.topGenres[0].count) * 100}%`, opacity: 1 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], type: 'spring', stiffness: 100 }}
                      className='from-Primary-500 to-Secondary-500 h-full bg-gradient-to-r'
                      style={{}}
                    />
                  </div>
                  <span className='text-Grey-400 w-8 text-right text-xs'>{genre.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='rounded-xl border border-white/5 bg-white/[0.015] p-4  backdrop-blur-sm'
        >
          <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
            <Calendar className='text-Secondary-400 h-5 w-5' />
            Recent Activity
          </h3>
          <div className='space-y-3'>
            {stats.recentActivity.slice(0, 4).map((activity) => (
              <div key={activity.id} className='flex items-start gap-3'>
                <div className='bg-Primary-400 mt-1 h-2 w-2 rounded-full' />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm text-white'>{activity.title}</p>
                  <div className='text-Grey-400 flex items-center gap-2 text-xs'>
                    <span className='capitalize'>{activity.action}</span>
                    {activity.rating && (
                      <>
                        <span>•</span>
                        <div className='flex items-center gap-1'>
                          <Star className='fill-Warning-400 text-Warning-400 h-3 w-3' />
                          <span>{activity.rating}</span>
                        </div>
                      </>
                    )}
                    <span>•</span>
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
