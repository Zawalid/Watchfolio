import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedContent } from '@/lib/api/TMDB';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import HeroItem from './HeroSectionItem';
import { cn } from '@/utils';

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['featured-content'],
    queryFn: getFeaturedContent,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const featuredItems = (featuredData?.results as Media[])?.slice(0, 6) || [];

  // Auto-advance hero items
  useEffect(() => {
    if (!isPlaying || featuredItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 8000); // Change every 8 seconds (slightly longer for better UX)

    return () => clearInterval(interval);
  }, [featuredItems.length, isPlaying]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  }, [featuredItems.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  }, [featuredItems.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (featuredItems.length <= 1) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case ' ':
          event.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'Escape':
          event.preventDefault();
          setIsPlaying(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [featuredItems.length, goToNext, goToPrevious]);

  if (isLoading) {
    return (
      <div className='from-Grey-800 to-Grey-700 relative h-[75vh] min-h-[600px] w-full animate-pulse rounded-2xl bg-gradient-to-r'>
        <div className='absolute inset-0 flex items-center px-6 lg:px-12'>
          <div className='max-w-3xl space-y-6'>
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
      <div className='from-Grey-800 to-Grey-700 relative h-[75vh] min-h-[600px] w-full rounded-2xl bg-gradient-to-r'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='space-y-4 text-center'>
            <div className='bg-Grey-600 mx-auto flex h-16 w-16 items-center justify-center rounded-full'>
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
    <div
      className='relative h-[75vh] min-h-[600px] w-full overflow-hidden rounded-2xl'
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Hero Items - All positioned absolutely to overlay */}
      {featuredItems.map((item, index) => (
        <HeroItem key={`${item.id}-${index}`} item={item} isActive={index === currentIndex} />
      ))}

      {featuredItems.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className='focus:ring-Primary-500/50 absolute top-1/2 left-3 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/60 focus:ring-2 focus:outline-none'
            aria-label='Previous slide'
          >
            <ChevronLeft className='h-6 w-6' />
          </button>

          <button
            onClick={goToNext}
            className='focus:ring-Primary-500/50 absolute top-1/2 right-3 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/60 focus:ring-2 focus:outline-none'
            aria-label='Next slide'
          >
            <ChevronRight className='h-6 w-6' />
          </button>

          <div className='absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3'>
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
          </div>
        </>
      )}

      {featuredItems.length > 1 && (
        <div className='absolute top-8 right-8 z-20'>
          <div
            className={cn(
              'rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm',
              isPlaying ? 'text-Success-400 border-Success-400/30' : 'text-Grey-400 border-Grey-400/30'
            )}
          >
            <div className='flex items-center gap-2'>
              <div className={cn('h-2 w-2 rounded-full', isPlaying ? 'bg-Success-400 animate-pulse' : 'bg-Grey-400')} />
              {isPlaying ? 'Auto-playing' : 'Paused'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
