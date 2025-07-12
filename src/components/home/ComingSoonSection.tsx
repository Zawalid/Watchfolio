import { Popcorn, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@heroui/button';
import { getUpcomingContent } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import MediaCardsList from '@/components/media/MediaCardsList';

export default function ComingSoonSection() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='from-Secondary-500 to-Tertiary-500 shadow-Secondary-500/25 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Popcorn className='h-6 w-6 text-white drop-shadow-sm' />
          </div>

          <div>
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-bold text-white'>Coming Soon</h2>
              <div className='border-Success-500/30 bg-Success-500/10 text-Success-300 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm'>
                <Clock className='h-3 w-3' />
                <span>Soon</span>
              </div>
            </div>
            <p className='text-Grey-400 mt-1 text-sm'>Upcoming movies and shows to add to your watchlist</p>
          </div>
        </div>

        <Button
          as={Link}
          to='/movies?category=upcoming'
          size='sm'
          className='button-secondary! text-xs!'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          View All
        </Button>
      </div>

      <MediaCardsList
        queryOptions={{
          queryKey: [...queryKeys.category('movie', 'upcoming', 1), 'combined'],
          queryFn: () => getUpcomingContent(1),
        }}
        asSlider={true}
        slideClassName='w-[200px]! sm:w-[250px]!'
        sliderProps={{autoplay : true}}
      />
    </div>
  );
}
