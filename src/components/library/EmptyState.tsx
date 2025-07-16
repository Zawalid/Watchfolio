import { Film, Tv, TrendingUp, Star, Sparkles } from 'lucide-react';
import { Button } from '@heroui/button';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { Link } from 'react-router';
import { Status } from '@/components/ui/Status';
import { useFiltersParams } from '@/hooks/useFiltersParams';

const getProps = (status: LibraryFilterStatus, isOwnProfile?: boolean) => {
  switch (status) {
    case 'all':
      return {
        Icon: Film,
        iconColor: 'text-Primary-400',
        title: isOwnProfile ? 'Your watchlist awaits' : 'Nothing to see yet',
        message: isOwnProfile
          ? 'Ready to start your journey? Discover amazing movies and TV shows to build your personal collection.'
          : "This user's watchlist is still empty. Check back later or recommend something great!",
        children: (
          <>
            {' '}
            <Button
              as={Link}
              to='/home'
              color='primary'
              size='md'
              className='font-medium'
              startContent={<Sparkles className='h-4 w-4' />}
            >
              {' '}
              Start Exploring{' '}
            </Button>
            <div className='mt-8 flex flex-wrap justify-center gap-2'>
              {[
                { to: '/movies', icon: Film, text: 'Movies', iconColor: 'text-Primary-400' },
                { to: '/tv', icon: Tv, text: 'TV Shows', iconColor: 'text-Secondary-400' },
                { to: '/home#trending', icon: TrendingUp, text: 'Trending', iconColor: 'text-Warning-400' },
                { to: '/home#top-rated', icon: Star, text: 'Top Rated', iconColor: 'text-Success-400' },
              ].map(({ to, icon: Icon, text, iconColor }) => (
                <Link
                  key={to}
                  to={to}
                  className='pill-bg flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:bg-white/10'
                >
                  <Icon className={`${iconColor} h-4 w-4`} />
                  <span className='text-Grey-300 text-sm'>{text}</span>
                </Link>
              ))}
            </div>
          </>
        ),
      };

    default: {
      const statusOption = LIBRARY_MEDIA_STATUS.find((s) => s.value === status);
      if (!statusOption) return;

      const shared = {
        favorites: {
          title: 'No favorites chosen',
          message: isOwnProfile
            ? 'Found something you absolutely love? Hit the heart button to save your all-time favorites here.'
            : "This user hasn't marked any favorites yet.",
        },
        watching: {
          title: isOwnProfile ? 'Nothing on your screen yet' : 'Not watching anything currently',
          message: isOwnProfile
            ? "When you start watching something new, it'll appear here so you can track your progress."
            : 'This user hasn’t started watching anything yet.',
        },
        completed: {
          title: isOwnProfile ? 'Nothing completed yet' : 'No titles completed yet',
          message: isOwnProfile
            ? 'Finished watching something? Mark it as "Completed" to keep track of your completed adventures.'
            : 'Looks like they haven’t finished anything yet.',
        },
        willWatch: {
          title: isOwnProfile ? 'Nothing planned to watch' : 'No watchlist plans yet',
          message: isOwnProfile
            ? 'Found something interesting? Add it to your "Plan to Watch" list so you never forget the good stuff.'
            : 'They haven’t added anything to their watch plans yet.',
        },
        onHold: {
          title: 'No shows taking a break',
          message: isOwnProfile
            ? "Sometimes we need a pause. When you put something on hold, you'll find it here waiting for you."
            : 'This user hasn’t put anything on hold. That’s commitment!',
        },
        dropped: {
          title: 'No shows left behind... yet',
          message: isOwnProfile
            ? "Not every show is meant to be. When something doesn't click, it'll land here."
            : "Nothing dropped so far. They're sticking with everything!",
        },
      };

      return {
        Icon: statusOption.icon,
        iconColor: statusOption.className.split(' ')[0],
        title: shared[status as keyof typeof shared]?.title || 'Nothing here yet',
        message:
          shared[status as keyof typeof shared]?.message || 'This section is waiting for some content to appear.',
      };
    }
  }
};

export default function EmptyState({ status, isOwnProfile }: { status: LibraryFilterStatus; isOwnProfile?: boolean }) {
  const { query, hasFilters } = useFiltersParams();
  if (query || hasFilters) return <Status.NoResults />;
  return <Status.Empty {...getProps(status, isOwnProfile)} />;
}
  
  