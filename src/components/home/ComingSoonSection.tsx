import { useQuery } from '@tanstack/react-query';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@heroui/button';
import { getUpcomingContent } from '@/lib/api/TMDB/upcoming';
import { queryKeys } from '@/lib/react-query';
import MediaCardsList from '@/components/media/MediaCardsList';

export default function ComingSoonSection() {
  const {
    data: upcomingData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [...queryKeys.category('movie', 'upcoming', 1), 'combined'],
    queryFn: () => getUpcomingContent(1),
    staleTime: 1000 * 60 * 60, // 1 hour - upcoming content doesn't change frequently
  });

  return (
    <div className='space-y-6'>
      {/* Section Header - Inspired by streaming sites */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {/* Icon with gradient background */}
          <div className='from-Secondary-500 to-Tertiary-500 shadow-Secondary-500/25 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Calendar className='h-6 w-6 text-white drop-shadow-sm' />
          </div>

          {/* Title and subtitle */}
          <div>
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-bold text-white'>Coming Soon</h2>
              {/* Coming Soon indicator pill */}
              <div className='border-Success-500/30 bg-Success-500/10 text-Success-300 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm'>
                <Clock className='h-3 w-3' />
                <span>Soon</span>
              </div>
            </div>
            <p className='text-Grey-400 mt-1 text-sm'>Upcoming movies and shows to add to your watchlist</p>
          </div>
        </div>

        {/* View All Button */}
        <Button
          as={Link}
          to='/movies?category=upcoming'
          variant='light'
          className='text-Primary-300 hover:text-Primary-200 px-4 py-2 transition-colors duration-200'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          View All
        </Button>
      </div>

      {/* Content */}
      <div className='relative'>
        {isLoading && (
          <div className='from-Grey-800 to-Grey-700 h-[400px] w-full animate-pulse rounded-2xl bg-gradient-to-r' />
        )}

        {isError && (
          <div className='from-Grey-800 to-Grey-700 flex h-[400px] w-full items-center justify-center rounded-2xl bg-gradient-to-r'>
            <div className='space-y-3 text-center'>
              <Calendar className='text-Grey-500 mx-auto h-12 w-12' />
              <p className='text-Grey-400 text-lg'>Unable to load upcoming content</p>
              <p className='text-Grey-500 text-sm'>Check back later for the latest releases</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && upcomingData && (
          <MediaCardsList
            queryOptions={{
              queryKey: [...queryKeys.category('movie', 'upcoming', 1), 'combined'],
              queryFn: () => getUpcomingContent(1),
            }}
            asSlider={true}
            errorMessage='Unable to load upcoming content. Please try again later.'
          />
        )}
      </div>
    </div>
  );
}
