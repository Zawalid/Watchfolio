import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@heroui/button';
import { getTrendingAll } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import MediaCardsList from '@/components/media/MediaCardsList';

export default function TrendingSection() {
  const {
    data: trendingData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.trending('all', 'week'),
    queryFn: () => getTrendingAll('week'),
    staleTime: 1000 * 60 * 30, // 30 minutes - trending data changes frequently
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='from-Success-500 to-Secondary-500 shadow-Primary-500/25 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <TrendingUp className='h-6 w-6 text-white drop-shadow-sm' />
          </div>

          <div>
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-bold text-white'>Trending This Week</h2>
              <div className='border-Error-500/30 bg-Error-500/10 text-Error-300 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm'>
                <Flame className='h-3 w-3 fill-current' />
                <span>Hot</span>
              </div>
            </div>
            <p className='text-Grey-400 mt-1 text-sm'>The most popular movies and shows everyone's talking about</p>
          </div>
        </div>

        <Button
          as={Link}
          to='/movies?category=popular'
          variant='light'
          className='text-Primary-300 hover:text-Primary-200 px-4 py-2 transition-colors duration-200'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          View All
        </Button>
      </div>

      <div className='relative'>
        {isLoading && (
          <div className='from-Grey-800 to-Grey-700 h-[400px] w-full animate-pulse rounded-2xl bg-gradient-to-r' />
        )}

        {isError && (
          <div className='from-Grey-800 to-Grey-700 flex h-[400px] w-full items-center justify-center rounded-2xl bg-gradient-to-r'>
            <div className='space-y-3 text-center'>
              <TrendingUp className='text-Grey-500 mx-auto h-12 w-12' />
              <p className='text-Grey-400 text-lg'>Unable to load trending content</p>
              <p className='text-Grey-500 text-sm'>Check back later for the hottest movies and shows</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && trendingData && (
          <MediaCardsList
            queryOptions={{
              queryKey: queryKeys.trending('all', 'week'),
              queryFn: () => getTrendingAll('week'),
            }}
            asSlider={true}
            errorMessage='Unable to load trending content. Please try again later.'
          />
        )}
      </div>
    </div>
  );
}
