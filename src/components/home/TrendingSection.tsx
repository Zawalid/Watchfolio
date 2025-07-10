import { TrendingUp, ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@heroui/button';
import { getTrendingAll } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import MediaCardsList from '@/components/media/MediaCardsList';

export default function TrendingSection() {
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
          size='sm'
          className='button-secondary! text-xs!'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          View All
        </Button>
      </div>

      <MediaCardsList
        queryOptions={{
          queryKey: queryKeys.trending('all', 'week'),
          queryFn: () => getTrendingAll('week'),
        }}
        asSlider={true}
        errorMessage='Unable to load trending content. Please try again later.'
        slideClassName='w-[200px]! sm:w-[250px]!'
        sliderProps={{ autoplay: true }}
      />
    </div>
  );
}
