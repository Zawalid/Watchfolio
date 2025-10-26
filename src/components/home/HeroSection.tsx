import { useQuery } from '@tanstack/react-query';
import { getTrendingAll } from '@/lib/api/TMDB';
import { Sparkles, WifiOff } from 'lucide-react';
import HeroItem from './HeroSectionItem';
import { placeholder } from '@/utils/shimmer-placeholder';
import { Slider } from '../ui/Slider';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { isNetworkError } from '@/utils/connectivity';

export default function HeroSection() {
  const { data: featuredData, isLoading, isError, error } = useQuery({
    queryKey: ['featured-content'],
    queryFn: async () => await getTrendingAll('week', 1),
    staleTime: 1000 * 60 * 15,
  });

  const isOnline = useNetworkStatus();

  const featuredItems = (featuredData?.results as Media[])?.slice(0, 10) || [];

  // Check for offline/network error
  if (isError && (!isOnline || isNetworkError(error))) {
    return (
      <div className='from-Grey-800 to-Grey-700 absolute inset-0 flex h-screen w-screen items-center justify-center bg-gradient-to-r'>
        <div className='space-y-4 text-center'>
          <div className='mx-auto flex size-20 items-center justify-center rounded-full border border-warning/20 bg-warning/5 backdrop-blur-md'>
            <WifiOff className='h-8 w-8 text-warning' />
          </div>
          <p className='text-Grey-50 text-lg font-medium'>No Internet Connection</p>
          <p className='text-Grey-400 text-sm'>Connect to the internet to see trending content</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='from-Grey-800 to-Grey-700 absolute left-0 top-0 flex h-screen w-screen items-center bg-gradient-to-r px-6 lg:px-12'>
        <div
            className='absolute inset-0 h-full w-full object-cover object-center'
            style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
          />
        <div className='z-10 max-w-3xl animate-pulse space-y-6'>
          {/* Loading badges */}
          <div className='flex gap-3'>
            <div className='bg-Grey-600 h-8 w-24 rounded-full' />
            <div className='bg-Grey-600 h-8 w-20 rounded-full' />
            <div className='bg-Grey-600 h-8 w-16 rounded-full' />
          </div>
          {/* Loading title */}
          <div className='bg-Grey-600 h-20 w-full max-w-2xl rounded-lg' />
          {/* Loading meta */}
          <div className='flex gap-4'>
            <div className='bg-Grey-600 h-8 w-20 rounded-lg' />
            <div className='bg-Grey-600 h-8 w-16 rounded-lg' />
            <div className='bg-Grey-600 h-8 w-24 rounded-lg' />
          </div>
          {/* Loading description */}
          <div className='space-y-2'>
            <div className='bg-Grey-600 h-4 w-full rounded' />
            <div className='bg-Grey-600 h-4 w-5/6 rounded' />
            <div className='bg-Grey-600 h-4 w-3/4 rounded' />
          </div>
          {/* Loading buttons */}
          <div className='flex gap-4'>
            <div className='bg-Grey-600 h-14 w-36 rounded-xl' />
            <div className='bg-Grey-600 h-14 w-28 rounded-xl' />
            <div className='bg-Grey-600 h-14 w-32 rounded-xl' />
          </div>
        </div>
      </div>
    );
  }

  if (!featuredItems.length) {
    return (
      <div className='from-Grey-800 to-Grey-700 absolute inset-0 flex h-screen w-screen items-center justify-center bg-gradient-to-r'>
        <div className='space-y-4 text-center'>
          <div className='mx-auto flex size-20 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md'>
            <Sparkles className='text-Grey-400 h-8 w-8' />
          </div>
          <p className='text-Grey-400 text-lg'>No featured content available</p>
          <p className='text-Grey-500 text-sm'>Check back later for trending movies and shows</p>
        </div>
      </div>
    );
  }

  return (
    <div className='absolute top-0 left-0 h-screen w-screen overflow-hidden'>
      {/* Hero Items - All positioned absolutely to overlay */}
      <Slider
        className='size-full'
        freeMode={false}
        showNavigation={false}
        loop={true}
        autoplay={{ delay: 8000 }}
        creativeEffect={{ prev: { shadow: true, translate: [0, 0, -400] }, next: { translate: ['100%', 0, 0] } }}
        effect={'creative'}
        pagination={{
          enabled: true,
          clickable: true,
          bulletClass:
            'inline-block bg-white/50 cursor-pointer hover:scale-125 hover:bg-white/80 focus:ring-Primary-500/50 size-2.5 ml-2 rounded-full transition-all duration-500 focus:ring-2 focus:outline-none',
          bulletActiveClass: 'bg-Primary-400! hover:scale-100! shadow-Primary-500/50 w-8 shadow-lg',
        }}
      >
        {featuredItems.map((item, index) => (
          <Slider.Slide key={`${item.id}-${index}`} className='w-screen!'>
            <HeroItem key={`${item.id}-${index}`} item={item} />
          </Slider.Slide>
        ))}
      </Slider>
    </div>
  );
}
