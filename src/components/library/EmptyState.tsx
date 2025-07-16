import { Film, Tv, TrendingUp, Star, Sparkles } from 'lucide-react';
import { Button } from '@heroui/button';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { Link } from 'react-router';
import { Status } from '@/components/ui/Status';
import { useFiltersParams } from '@/hooks/useFiltersParams';

const getProps = (status: LibraryFilterStatus) => {
  switch (status) {
    case 'all':
      return {
        Icon: Film,
        iconColor: 'text-Primary-400',
        title: 'Your watchlist awaits',
        message: 'Ready to start your journey? Discover amazing movies and TV shows to build your personal collection.',
        children: (
          <>
            <Button
              as={Link}
              to='/home'
              color='primary'
              size='md'
              className='font-medium'
              startContent={<Sparkles className='h-4 w-4' />}
            >
              Start Exploring
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

      const messages = {
        favorites: {
          title: 'No favorites chosen',
          message: 'Found something you absolutely love? Hit the heart button to save your all-time favorites here.',
        },
        watching: {
          title: 'Nothing on your screen yet',
          message: "When you start watching something new, it'll appear here so you can track your progress.",
        },
        completed: {
          title: 'Nothing completed yet',
          message: 'Finished watching something? Mark it as "Completed" to keep track of your completed adventures.',
        },
        willWatch: {
          title: 'Nothing planned to watch',
          message:
            'Found something interesting? Add it to your "Plan to Watch" list so you never forget the good stuff.',
        },
        onHold: {
          title: 'No shows taking a break',
          message: "Sometimes we need a pause. When you put something on hold, you'll find it here waiting for you.",
        },
        dropped: {
          title: 'No shows left behind... yet',
          message: "Not every show is meant to be. When something doesn't click, it'll land here.",
        },
      };

      return {
        Icon: statusOption.icon,
        iconColor: statusOption.className.split(' ')[0],
        title: messages[status as keyof typeof messages]?.title || 'Nothing here yet',
        message:
          messages[status as keyof typeof messages]?.message || 'This section is waiting for some content to appear.',
      };
    }
  }
};
export default function EmptyState({ status }: { status: LibraryFilterStatus }) {
  const { query, hasFilters } = useFiltersParams();
  if (query || hasFilters) return <Status.NoResults />;
  return <Status.Empty {...getProps(status)} />;
}
