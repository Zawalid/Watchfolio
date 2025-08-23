import { AnimatePresence, motion } from 'framer-motion';
import { Star, Film, Tv, Clock, Target, BarChart3, Activity as ActivityIcon, Award, Zap } from 'lucide-react';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import StatCard, { StatCardProps } from './StatCard';
import { LazyImage } from '@/components/ui/LazyImage';
import { EmptyProps, Status } from '@/components/ui/Status';
import { cn, formatTimeAgo } from '@/utils';
import { Link } from 'react-router';
import { generateMediaLink, getTmdbImage } from '@/utils/media';
import { Activity, HiddenSection, Profile } from '@/lib/appwrite/types';
import { useAuthStore } from '@/stores/useAuthStore';

const getStats = (stats: LibraryStats) => {
  const statusCards: StatCardProps[] = LIBRARY_MEDIA_STATUS.map((status) => ({
    label: status.label,
    value: stats[status.value],
    icon: status.icon,
    className: status.className,
    description: status.descriptions.stats,
    percentage: Math.round((stats[status.value] / stats.all) * 100),
  }));

  return [
    {
      label: 'Movies',
      value: stats.movies,
      icon: Film,
      className: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      description: 'Movies tracked',
      percentage: Math.round((stats.movies / stats.all) * 100),
    },
    {
      label: 'TV Shows',
      value: stats.tvShows,
      icon: Tv,
      className: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      description: 'Series followed',
      percentage: Math.round((stats.tvShows / stats.all) * 100),
    },
    ...statusCards,
  ];
};

const renderEmptyState = (props: EmptyProps) => {
  return (
    <Status.Empty
      Icon={props.Icon}
      iconColor={props.iconColor}
      title={props.title}
      message={props.message}
      className='min-h-[400px] rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20'
    />
  );
};

export default function StatsInsights({ profile, stats }: { profile: Profile; stats: LibraryStats }) {
  const { checkIsOwnProfile } = useAuthStore();

  const isOwnProfile = checkIsOwnProfile(profile.username);
  const recentActivity = profile.recentActivity || [];
  const hiddenProfileSections = profile?.hiddenProfileSections || [];
  const visibleSectionsButStatistics = ['stats.overview', 'stats.topGenres', 'stats.recentActivity'].filter(
    (section) => !hiddenProfileSections.includes(section as HiddenSection)
  );

  const hasNoGenres = !stats.topGenres || stats.topGenres.length === 0;
  const hasNoActivity = !recentActivity || recentActivity.length === 0;

  return (
    <div className='space-y-6'>
      {!hiddenProfileSections.includes('stats.statistics') && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {getStats(stats).map((stat, index) => (
            <StatCard key={stat.label} {...stat} delay={index} />
          ))}
        </div>
      )}
      <div className={cn('grid gap-6', `lg:grid-cols-${visibleSectionsButStatistics.length}`)}>
        {hiddenProfileSections.includes('stats.overview') ? null : stats.all === 0 ? (
          renderEmptyState({
            Icon: BarChart3,
            iconColor: 'text-Primary-400',
            title: isOwnProfile ? 'No stats yet' : 'No data to show',
            message: isOwnProfile
              ? 'Track movies and shows to see your watch stats here.'
              : "This user hasn't added enough titles to generate stats yet.",
          })
        ) : (
          <Overview stats={stats} isOwnProfile={isOwnProfile} />
        )}

        {hiddenProfileSections.includes('stats.topGenres') ? null : hasNoGenres ? (
          renderEmptyState({
            Icon: Star,
            iconColor: 'text-Tertiary-400',
            title: isOwnProfile ? 'No genres tracked' : 'No genres to show',
            message: isOwnProfile
              ? 'Your top genres will show here as you rate and complete more content.'
              : "Not enough data to determine this user's top genres.",
          })
        ) : (
          <TopGenres stats={stats} isOwnProfile={isOwnProfile} />
        )}

        {hiddenProfileSections.includes('stats.recentActivity') ? null : hasNoActivity ? (
          renderEmptyState({
            Icon: ActivityIcon,
            iconColor: 'text-Secondary-400',
            title: isOwnProfile ? 'No recent activity' : 'Nothing recent to show',
            message: isOwnProfile
              ? "Start watching or rating content and it'll appear here."
              : "This user hasn't been active lately.",
          })
        ) : (
          <RecentActivity recentActivity={recentActivity} isOwnProfile={isOwnProfile} />
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
      <h3 className='mb-5 flex items-center gap-2.5 text-lg font-semibold text-white'>
        <div className='bg-Primary-500/20 flex h-8 w-8 items-center justify-center rounded-lg'>
          <BarChart3 className='text-Primary-400 h-4 w-4' />
        </div>
        Overview
      </h3>

      <div className='space-y-4'>
        <div className='flex items-center justify-between rounded-lg bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]'>
          <div className='flex items-center gap-3'>
            <Target className='text-Secondary-400 h-4 w-4' />
            <span className='text-Grey-300 text-sm font-medium'>Total Items</span>
          </div>
          <span className='text-lg font-bold text-white'>{stats.all.toLocaleString()}</span>
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

        <ContentTypeRatio movies={stats.movies} tvShows={stats.tvShows} />

        {/* Completion Rate */}
        <div className='rounded-lg bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-Grey-300 text-sm font-medium'>
              {isOwnProfile ? 'Your Completion Rate' : 'Completion Rate'}
            </span>
            <span className='text-Success-400 text-sm font-bold'>
              {Math.round((stats.completed / stats.all) * 100)}%
            </span>
          </div>
          <div className='bg-Grey-800 h-2 overflow-hidden rounded-full'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.completed / stats.all) * 100}%` }}
              transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
              className='from-Success-500 to-Success-400 h-full rounded-full bg-gradient-to-r'
            />
          </div>
        </div>

        <AverageRating averageRating={stats.averageRating} isOwnProfile={isOwnProfile} />
      </div>
    </motion.div>
  );
}

function ContentTypeRatio({ movies, tvShows }: { movies: number; tvShows: number }) {
  const totalContent = movies + tvShows;
  const moviePercentage = totalContent > 0 ? (movies / totalContent) * 100 : 50;
  const tvShowPercentage = totalContent > 0 ? 100 - moviePercentage : 50;

  const getTitle = () => {
    if (totalContent === 0) return 'Movies vs. Shows';
    if (moviePercentage > 60) return 'Movie Enthusiast';
    if (moviePercentage < 40) return 'Series Binger';
    return 'Balanced Viewer';
  };

  // A small helper to prevent NaN if total is 0
  const formatPercent = (percent: number) => (totalContent > 0 ? `${Math.round(percent)}%` : '-');

  return (
    <div className='rounded-lg bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]'>
      <div className='mb-2 flex items-center justify-between'>
        <span className='text-Grey-300 text-sm font-medium'>{getTitle()}</span>
      </div>

      {/* Split Progress Bar */}
      <div className='bg-Grey-800 flex h-2 overflow-hidden rounded-full'>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${moviePercentage}%` }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          className='to-Secondary-400 from-Secondary-500 bg-gradient-to-r'
          title={`${formatPercent(moviePercentage)} Movies`}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${tvShowPercentage}%` }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          className='from-Primary-400 to-Primary-500 bg-gradient-to-r'
          title={`${formatPercent(tvShowPercentage)} TV Shows`}
        />
      </div>

      {/* Percentage Labels */}
      <div className='text-Grey-400 mt-2 flex justify-between text-xs'>
        <div className='flex items-center gap-1.5'>
          <Film className='text-Secondary-400 size-3' />
          <span>{formatPercent(moviePercentage)}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <span>{formatPercent(tvShowPercentage)}</span>
          <Tv className='text-Primary-400 size-3' />
        </div>
      </div>
    </div>
  );
}

function AverageRating({ averageRating, isOwnProfile }: { averageRating: number; isOwnProfile: boolean }) {
  const rating = Math.round(averageRating);
  return (
    <div className='rounded-lg bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]'>
      {averageRating > 0 ? (
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-2'>
            <span className='text-Grey-300 text-sm font-medium'>Average Rating</span>
            <div className='flex items-center gap-1'>
              {Array.from({ length: 10 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn('size-4', i < rating ? 'text-Warning-400 fill-Warning-400' : 'text-Grey-600')}
                />
              ))}
            </div>
          </div>
          <div className='flex items-center gap-0.5'>
            <span className='text-lg font-bold text-white'>{rating}</span>
            <span className='text-Grey-500 text-sm'>/10</span>
          </div>
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          <div className='flex flex-1 flex-col gap-1'>
            <span className='text-Grey-300 text-sm font-medium'>
              {isOwnProfile ? 'Rate Your First Title' : 'No Ratings Yet'}
            </span>
            <span className='text-Grey-400 text-xs'>
              {isOwnProfile ? 'Your average rating will appear here.' : 'This user hasn’t rated any titles.'}
            </span>
          </div>
        </div>
      )}
    </div>
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
        {stats.topGenres.slice(0, 6).map((genre, index) => (
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
                    index === 4 && 'bg-Success-400',
                    index === 5 && 'bg-green-400'
                  )}
                />
                <span className='text-Grey-300 text-sm font-medium transition-colors group-hover:text-white'>
                  {genre.name}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-Grey-400 text-xs font-medium'>{genre.count} items</span>
                <span className='text-Grey-500 text-xs'>({Math.round((genre.count / stats.all) * 100)}%)</span>
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
                  index === 4 && 'from-Success-500 to-Success-400 bg-gradient-to-r',
                  index === 5 && 'bg-gradient-to-r from-green-500 to-green-400'
                )}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const getActionDetails = (action: Activity['action']) => {
  switch (action) {
    case 'completed':
      return { Icon: Award, className: 'text-Success-400' };
    case 'rated':
      return { Icon: Star, className: 'text-Warning-400' };
    case 'added':
    default:
      return { Icon: Zap, className: 'text-Primary-400' };
  }
};

function RecentActivity({ recentActivity, isOwnProfile }: { recentActivity: Activity[]; isOwnProfile: boolean }) {
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
            <ActivityIcon className='text-Secondary-400 h-4 w-4' />
          </div>
          {isOwnProfile ? 'Your Recent Activity' : 'Recent Activity'}
        </h3>
      </div>

      {/* Timeline Container */}
      <div className='relative flow-root'>
        <div className='absolute top-3 left-3 -ml-px h-[calc(100%-16px)] w-0.5 bg-white/10'></div>
        <ul className='-mb-4'>
          <AnimatePresence>
            {recentActivity.slice(0, 5).map((activity, index) => {
              const { Icon, className } = getActionDetails(activity.action);
              const { action, mediaId, mediaTitle, mediaType, timestamp, posterPath, rating } = activity;

              return (
                <motion.li
                  key={timestamp}
                  className='relative mb-5'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <div className='relative flex items-start gap-4'>
                    {/* Timeline Dot/Icon */}
                    <div className='bg-blur absolute top-0 -left-1 flex size-8 items-center justify-center rounded-full border border-white/15'>
                      <Icon className={cn('size-4', className)} />
                    </div>

                    {/* Timeline Content */}
                    <div className='min-w-0 flex-1 pl-10'>
                      <div className='flex items-start gap-3'>
                        <div className='bg-Grey-800 h-16 w-11 flex-shrink-0 overflow-hidden rounded-md border border-white/10'>
                          <LazyImage
                            src={getTmdbImage({ poster_path: posterPath } as Media, 'w200')}
                            alt={mediaTitle}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <Link
                            to={generateMediaLink({ id: mediaId, media_type: mediaType, title: mediaTitle } as Media)}
                            className='hover:text-Secondary-500 truncate text-sm font-semibold text-white transition-colors'
                            title={mediaTitle}
                          >
                            {mediaTitle}
                          </Link>

                          <div className='mt-1.5 flex items-center gap-2'>
                            {/* Rated Action */}
                            {action === 'rated' && (
                              <div className='text-Warning-400 flex items-center gap-1.5 text-xs'>
                                <Star className='size-3.5' />
                                <span className='font-semibold'>{rating} / 10</span>
                              </div>
                            )}

                            {/* Completed Action */}
                            {action === 'completed' && (
                              <span className='text-Success-400 text-xs font-semibold'>Completed</span>
                            )}

                            {/* Added Action */}
                            {action === 'added' && (
                              <span className='text-Secondary-400 text-xs font-semibold'>Added to library</span>
                            )}
                          </div>

                          <p className='text-Grey-500 mt-1.5 text-xs'>{formatTimeAgo(timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </motion.div>
  );
}
