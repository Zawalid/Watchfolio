import { TrendingUp, ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@heroui/react';
import { getTrendingAll } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import MediaAndCelebritiesCardsList from '@/components/Media&CelebritiesCardsList';

export default function TrendingSection() {
  return (
    <div className='space-y-6'>
      <div className='xs:flex-row flex flex-col xs:items-center xs:justify-between gap-3'>
        <div className='flex min-w-0 flex-1 items-center gap-3'>
          <div className='from-Success-500 to-Secondary-500 shadow-Primary-500/25 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg sm:h-12 sm:w-12'>
            <TrendingUp className='h-5 w-5 text-white drop-shadow-sm sm:h-6 sm:w-6' />
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='truncate text-lg font-bold text-white sm:text-2xl'>Trending This Week</h2>
              <div className='border-Error-500/30 bg-Error-500/10 text-Error-300 flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium backdrop-blur-sm'>
                <Flame className='h-3 w-3 fill-current' />
                <span className='hidden sm:inline'>Hot</span>
              </div>
            </div>
            <p className='text-Grey-400 mt-1 truncate text-xs sm:text-sm'>
              The most popular movies and shows everyone's talking about
            </p>
          </div>
        </div>

        <Button
          as={Link}
          to='/movies?category=popular'
          size='sm'
          className='button-secondary! flex-shrink-0 text-xs!'
          endContent={<ArrowRight className='h-3 w-3 sm:h-4 sm:w-4' />}
        >
          View All
        </Button>
      </div>

      <MediaAndCelebritiesCardsList
        queryKey={queryKeys.trending('all', 'week')}
        queryFn={() => getTrendingAll('week')}
        asSlider={true}
        sliderProps={{ autoplay: true, loop: true }}
      />
    </div>
  );
}
