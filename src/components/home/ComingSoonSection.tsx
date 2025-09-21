import { Popcorn, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@heroui/react';
import { getUpcomingContent } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import MediaAndCelebritiesCardsList from '@/components/Media&CelebritiesCardsList';

export default function ComingSoonSection() {
  return (
    <div className='space-y-6'>
      <div className='xs:flex-row xs:items-center xs:justify-between flex flex-col gap-3'>
        <div className='flex min-w-0 flex-1 items-center gap-3'>
          <div className='from-Secondary-500 to-Tertiary-500 shadow-Secondary-500/25 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg sm:h-12 sm:w-12'>
            <Popcorn className='h-5 w-5 text-white drop-shadow-sm sm:h-6 sm:w-6' />
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='truncate text-lg font-bold text-white sm:text-2xl'>Coming Soon</h2>
              <div className='border-Success-500/30 bg-Success-500/10 text-Success-300 flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium backdrop-blur-sm'>
                <Clock className='h-3 w-3' />
                <span className='hidden sm:inline'>Soon</span>
              </div>
            </div>
            <p className='text-Grey-400 mt-1 truncate text-xs sm:text-sm'>
              Upcoming movies and shows to add to your watchlist
            </p>
          </div>
        </div>

        <Button
          as={Link}
          to='/movies?category=upcoming'
          size='sm'
          className='button-secondary! flex-shrink-0 text-xs!'
          endContent={<ArrowRight className='h-3 w-3 sm:h-4 sm:w-4' />}
        >
          <span className='hidden sm:inline'>View All</span>
          <span className='sm:hidden'>View</span>
        </Button>
      </div>

      <MediaAndCelebritiesCardsList
        queryKey={[...queryKeys.category('movie', 'upcoming'), 'combined']}
        queryFn={() => getUpcomingContent(1)}
        asSlider={true}
        sliderProps={{ autoplay: true, loop: true }}
      />
    </div>
  );
}
