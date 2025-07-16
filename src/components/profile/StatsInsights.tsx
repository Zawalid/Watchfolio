import { AnimatePresence, motion } from 'framer-motion';
import { Star, Film, Tv, Clock, Target, BarChart3, Activity, Info, Award, Zap } from 'lucide-react';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import StatCard, { StatCardProps } from './StatCard';
import { LazyImage } from '@/components/ui/LazyImage';
import { Status } from '@/components/ui/Status';
import { cn,  formatTimeAgo } from '@/utils';

const stats: LibraryStats = {
  totalItems: 847,
  watching: 23,
  completed: 542,
  willWatch: 156,
  onHold: 12,
  dropped: 12,
  favorites: 89,
  movies: 456,
  tvShows: 391,
  totalHoursWatched: 1247,
  averageRating: 7,
  topGenres: [
    { name: 'Drama', count: 156 },
    { name: 'Sci-Fi', count: 134 },
    { name: 'Thriller', count: 98 },
    { name: 'Comedy', count: 87 },
    { name: 'Action', count: 76 },
  ],
  recentActivity: [
    {
      id: '1',
      title: 'The Bear',
      type: 'tv',
      action: 'completed',
      date: '2025-07-16T00:00:00Z',
      rating: 5,
      posterPath: '/rBuFWNej3pMPnAivQ3k5bafz6kk.jpg',
    },
    {
      id: '2',
      title: 'Oppenheimer',
      type: 'movie',
      action: 'rated',
      date: '2024-01-08T00:00:00Z',
      rating: 4,
      posterPath: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    },
    {
      id: '3',
      title: 'House of the Dragon',
      type: 'tv',
      action: 'added',
      date: '2024-01-05T00:00:00Z',
      posterPath: '/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg',
    },
    {
      id: '4',
      title: 'Dune: Part Two',
      type: 'movie',
      action: 'added',
      date: '2024-01-03T00:00:00Z',
      posterPath: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    },
  ],
};

const getStats = (stats: LibraryStats) => {
  const statusCards: StatCardProps[] = LIBRARY_MEDIA_STATUS.map((status) => ({
    label: status.label,
    value: stats[status.value],
    icon: status.icon,
    className: status.className,
    description: status.descriptions.stats,
  }));

  return [
    {
      label: 'Movies',
      value: stats.movies,
      icon: Film,
      className: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      description: 'Movies tracked',
    },
    {
      label: 'TV Shows',
      value: stats.tvShows,
      icon: Tv,
      className: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      description: 'Series followed',
    },
    ...statusCards,
  ];
};

const getActionIcon = (action: string) => {
  switch (action) {
    case 'completed':
      return <Award className='text-Success-400 h-3 w-3' />;
    case 'rated':
      return <Star className='text-Warning-400 h-3 w-3' />;
    case 'added':
      return <Zap className='text-Primary-400 h-3 w-3' />;
    default:
      return <Activity className='text-Grey-400 h-3 w-3' />;
  }
};

export default function StatsInsights({ isOwnProfile }: { isOwnProfile: boolean }) {
  const hasNoData = stats.totalItems === 0;
  const hasNoGenres = !stats.topGenres || stats.topGenres.length === 0;
  const hasNoActivity = !stats.recentActivity || stats.recentActivity.length === 0;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {getStats(stats).map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index} />
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {hasNoData ? (
          <Status.Empty
            Icon={BarChart3}
            iconColor='text-Primary-400'
            title={isOwnProfile ? 'No stats yet' : 'No data to show'}
            message={
              isOwnProfile
                ? 'Track movies and shows to see your watch stats here.'
                : 'This user hasn’t added enough titles to generate stats yet.'
            }
            className='rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 min-h-[500px]'
          />
        ) : (
          <Overview stats={stats} isOwnProfile={isOwnProfile} />
        )}

        {hasNoGenres ? (
          <Status.Empty
            Icon={Star}
            iconColor='text-Tertiary-400'
            title={isOwnProfile ? 'No genres tracked' : 'No genres to show'}
            message={
              isOwnProfile
                ? 'Your top genres will show here as you rate and complete more content.'
                : 'Not enough data to determine this user’s top genres.'
            }
               className='rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 min-h-[500px]'
          />
        ) : (
          <TopGenres stats={stats} isOwnProfile={isOwnProfile} />
        )}

        {hasNoActivity ? (
          <Status.Empty
            Icon={Activity}
            iconColor='text-Secondary-400'
            title={isOwnProfile ? 'No recent activity' : 'Nothing recent to show'}
            message={
              isOwnProfile
                ? 'Start watching or rating content and it’ll appear here.'
                : 'This user hasn’t been active lately.'
            }
               className='rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 min-h-[500px]'
          />
        ) : (
          <RecentActivity stats={stats} isOwnProfile={isOwnProfile} />
        )}
      </div>
    </div>
  );
}

function Overview({ stats, isOwnProfile }: { stats: LibraryStats; isOwnProfile: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className='rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20'
    >
      <div className='mb-5 flex items-center justify-between'>
        <h3 className='flex items-center gap-2.5 text-lg font-semibold text-white'>
          <div className='bg-Primary-500/20 flex h-8 w-8 items-center justify-center rounded-lg'>
            <BarChart3 className='text-Primary-400 h-4 w-4' />
          </div>
          Overview
        </h3>
        <button className='flex h-6 w-6 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10'>
          <Info className='text-Grey-400 h-3 w-3' />
        </button>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between rounded-lg bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]'>
          <div className='flex items-center gap-3'>
            <Target className='text-Secondary-400 h-4 w-4' />
            <span className='text-Grey-300 text-sm font-medium'>Total Items</span>
          </div>
          <span className='text-lg font-bold text-white'>{stats.totalItems.toLocaleString()}</span>
        </div>

        <div className='flex items-center justify-between rounded-lg bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]'>
          <div className='flex items-center gap-3'>
            <Clock className='text-Warning-400 h-4 w-4' />
            <span className='text-Grey-300 text-sm font-medium'>
              {isOwnProfile ? 'Your Watch Time' : 'Total Watch Time'}
            </span>
          </div>
          <span className='text-lg font-bold text-white'>{`${stats.totalHoursWatched}h`}</span>
        </div>

        {/* Completion Rate */}
        <div className='rounded-lg bg-white/[0.02] p-3'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-Grey-300 text-sm font-medium'>
              {isOwnProfile ? 'Your Completion Rate' : 'Completion Rate'}
            </span>
            <span className='text-Success-400 text-sm font-bold'>
              {Math.round((stats.completed / stats.totalItems) * 100)}%
            </span>
          </div>
          <div className='bg-Grey-800 h-2 overflow-hidden rounded-full'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.completed / stats.totalItems) * 100}%` }}
              transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
              className='from-Success-500 to-Success-400 h-full rounded-full bg-gradient-to-r'
            />
          </div>
        </div>

        <div className='flex items-center justify-between rounded-lg bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]'>
          <div className='flex flex-col gap-3'>
            <span className='text-Grey-300 text-sm font-medium'>Average Rating</span>
            <div className='flex items-center gap-1'>
              {Array.from({ length: 10 }).map((_, i) => (
                <Star key={i} className={i === 9 ? 'text-Grey-600 size-4' : 'text-Warning-400 size-4 fill-current'} />
              ))}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-lg font-bold text-white'>{stats.averageRating}</span>
            <span className='text-Grey-500 text-sm'>/10</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TopGenres({ stats, isOwnProfile }: { stats: LibraryStats; isOwnProfile: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className='rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20'
    >
      <div className='mb-5 flex items-center justify-between'>
        <h3 className='flex items-center gap-2.5 text-lg font-semibold text-white'>
          <div className='bg-Tertiary-500/20 flex h-8 w-8 items-center justify-center rounded-lg'>
            <Star className='text-Tertiary-400 h-4 w-4' />
          </div>
          {isOwnProfile ? 'Your Top Genres' : 'Top Genres'}
        </h3>
      </div>

      <div className='space-y-4'>
        {stats.topGenres.slice(0, 5).map((genre, index) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className='group cursor-pointer rounded-lg p-2 transition-colors hover:bg-white/[0.02]'
          >
            <div className='mb-2 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    index === 0 && 'bg-Primary-400',
                    index === 1 && 'bg-Secondary-400',
                    index === 2 && 'bg-Tertiary-400',
                    index === 3 && 'bg-Warning-400',
                    index === 4 && 'bg-Success-400'
                  )}
                />
                <span className='text-Grey-300 text-sm font-medium transition-colors group-hover:text-white'>
                  {genre.name}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-Grey-400 text-xs font-medium'>{genre.count} items</span>
                <span className='text-Grey-500 text-xs'>({Math.round((genre.count / stats.totalItems) * 100)}%)</span>
              </div>
            </div>

            <div className='bg-Grey-800 h-1.5 overflow-hidden rounded-full'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(genre.count / stats.topGenres[0].count) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.9 + index * 0.1, ease: 'easeOut' }}
                className={cn(
                  'h-full rounded-full',
                  index === 0 && 'from-Primary-500 to-Primary-400 bg-gradient-to-r',
                  index === 1 && 'from-Secondary-500 to-Secondary-400 bg-gradient-to-r',
                  index === 2 && 'from-Tertiary-500 to-Tertiary-400 bg-gradient-to-r',
                  index === 3 && 'from-Warning-500 to-Warning-400 bg-gradient-to-r',
                  index === 4 && 'from-Success-500 to-Success-400 bg-gradient-to-r'
                )}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RecentActivity({ stats, isOwnProfile }: { stats: LibraryStats; isOwnProfile: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className='rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20'
    >
      <div className='mb-5 flex items-center justify-between'>
        <h3 className='flex items-center gap-2.5 text-lg font-semibold text-white'>
          <div className='bg-Secondary-500/20 flex h-8 w-8 items-center justify-center rounded-lg'>
            <Activity className='text-Secondary-400 h-4 w-4' />
          </div>
          {isOwnProfile ? 'Your Recent Activity' : 'Recent Activity'}
        </h3>
      </div>

      <div className='space-y-4'>
        <AnimatePresence>
          {stats.recentActivity.slice(0, 4).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className='group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-white/[0.02]'
            >
              <div className='relative'>
                <div className='bg-Grey-800 h-14 w-10 overflow-hidden rounded-md border border-white/10'>
                  <LazyImage
                    src={
                      activity.posterPath
                        ? `https://image.tmdb.org/t/p/w200${activity.posterPath}`
                        : '/images/placeholder.png'
                    }
                    alt={activity.title}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='bg-Grey-900 absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border border-white/20'>
                  {activity.type === 'movie' ? (
                    <Film className='h-2 w-2 text-blue-400' />
                  ) : (
                    <Tv className='h-2 w-2 text-purple-400' />
                  )}
                </div>
              </div>

              <div className='min-w-0 flex-1'>
                <p className='group-hover:text-Primary-300 truncate text-sm font-medium text-white transition-colors'>
                  {activity.title}
                </p>
                <div className='text-Grey-400 mt-1 flex items-center gap-2 text-xs'>
                  <span className='font-medium capitalize'>{activity.action}</span>
                  {activity.rating && (
                    <>
                      <span className='text-Grey-600'>•</span>
                      <div className='flex items-center gap-1'>
                        <Star className='fill-Warning-400 text-Warning-400 h-3 w-3' />
                        <span className='text-Warning-400 font-medium'>{activity.rating}</span>
                      </div>
                    </>
                  )}
                  <span className='text-Grey-600'>•</span>
                  <span>{formatTimeAgo(activity.date)}</span>
                </div>
              </div>

              <div className='mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-white/10'>
                {getActionIcon(activity.action)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
