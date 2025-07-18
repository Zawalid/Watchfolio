import { useQuery } from '@tanstack/react-query';
import { getTrendingAll } from '@/lib/api/TMDB';
import { Sparkles } from 'lucide-react';
import HeroItem from './HeroSectionItem';
import { placeholder } from '@/utils/shimmer-placeholder';
import { Slider } from '../ui/slider';

export default function HeroSection() {
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['featured-content'],
    queryFn: async () => await getTrendingAll('week', 1),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const featuredItems = (featuredData?.results as Media[])?.slice(0, 10) || [];

  if (isLoading) {
    return (
      <div className='from-Grey-800 to-Grey-700 absolute top-0 left-0 h-screen w-screen bg-gradient-to-r'>
        <div className='absolute inset-0 flex items-center px-6 lg:px-12'>
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
      </div>
    );
  }

  if (!featuredItems.length) {
    return (
      <div className='from-Grey-800 to-Grey-700 absolute top-0 left-0 h-screen w-screen bg-gradient-to-r'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='space-y-4 text-center'>
            <div className='mx-auto flex size-20 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md'>
              <Sparkles className='text-Grey-400 h-8 w-8' />
            </div>
            <p className='text-Grey-400 text-lg'>No featured content available</p>
            <p className='text-Grey-500 text-sm'>Check back later for trending movies and shows</p>
          </div>
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
        autoplay={{ delay: 8000, }}
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

      {/* {featuredItems.length > 1 && (
        
          )} */}
      {/* <div className='absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3'>
            {featuredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'focus:ring-Primary-500/50 h-2 w-2 rounded-full transition-all duration-500 focus:ring-2 focus:outline-none',
                  index === currentIndex
                    ? 'bg-Primary-400 shadow-Primary-500/50 w-8 shadow-lg'
                    : 'bg-white/50 hover:scale-125 hover:bg-white/80'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}
    </div>
  );
}
