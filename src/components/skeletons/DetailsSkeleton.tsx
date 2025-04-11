import { placeholder } from '@/utils/shimmer-placeholder';
import CardsListSkeleton from './CardsSkeleton';
import Slider from '@/components/ui/slider';

const backgroundImage = { style: { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' } };

export default function DetailsSkeleton({ type }: { type: 'movie' | 'tv' }) {
  return (
    <div className='min-h-screen bg-black'>
      {/* Hero Section Skeleton */}
      <div className='h-screen'>
        {/* Backdrop Skeleton */}
        <div className='absolute inset-0'>
          <div className='size-full' {...backgroundImage} />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black' />
        </div>

        {/* Content Skeleton */}
        <div className='relative z-10 flex h-full items-end'>
          <div className='mx-auto w-full max-w-7xl px-6 pb-20'>
            <div className='flex flex-col-reverse gap-6 md:flex-row md:gap-8'>
              {/* Poster Skeleton */}
              <div className='relative aspect-[2/3] w-full max-w-[250px] rounded-lg shadow-xl' {...backgroundImage} />

              {/* Details Skeleton */}
              <div className='flex flex-1 flex-col gap-6'>
                {/* Title Skeleton */}
                <div className='space-y-4'>
                  <div className='h-12 w-2/3 animate-pulse rounded-lg bg-gray-800' />

                  <div className='flex flex-wrap items-center gap-x-2 gap-y-2'>
                    <div className='h-5 w-20 animate-pulse rounded-lg bg-gray-800' />
                    <span className='text-gray-800'>●</span>
                    <div className='h-5 w-24 animate-pulse rounded-lg bg-gray-800' />
                    <span className='text-gray-800'>●</span>
                    <div className='h-5 w-16 animate-pulse rounded-lg bg-gray-800' />
                  </div>
                </div>

                {/* Genres Skeleton */}
                <div className='flex flex-wrap gap-2'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='h-8 w-24 animate-pulse rounded-full bg-gray-800' />
                  ))}
                </div>

                {/* Overview Skeleton */}
                <div className='max-w-prose space-y-2'>
                  <div className='h-4 w-full animate-pulse rounded bg-gray-800' />
                  <div className='h-4 w-5/6 animate-pulse rounded bg-gray-800' />
                  <div className='h-4 w-4/6 animate-pulse rounded bg-gray-800' />
                  <div className='h-4 w-2/3 animate-pulse rounded bg-gray-800' />
                  <div className='h-4 w-1/2 animate-pulse rounded bg-gray-800' />
                </div>

                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2'>
                    <div className='h-4 w-20 animate-pulse rounded-full bg-gray-800' />
                    <div className='h-4 w-28 animate-pulse rounded-full bg-gray-800' />
                  </div>
                  <div className='flex gap-2'>
                    <div className='h-4 w-32 animate-pulse rounded-full bg-gray-800' />
                    <div className='h-4 w-16 animate-pulse rounded-full bg-gray-800' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cast Section Skeleton */}
      <section className='py-6'>
        <div className='mx-auto max-w-7xl px-6'>
          <h2 className='mb-4 text-2xl font-semibold text-white'>
            <div className='inline-block h-8 w-48 animate-pulse rounded-lg bg-gray-800' />
          </h2>
          <div className='relative'>
            <Slider smartSlide={true}>
              {Array.from({ length: 15 }).map((_, i) => (
                <Slider.Slide key={i} className='w-[100px]!'>
                  <div>
                    <div className='aspect-square overflow-hidden rounded-full'>
                      <div className='size-full' {...backgroundImage} />
                    </div>
                    <div className='mt-2 text-center'>
                      <div className='mx-auto h-4 w-24 animate-pulse rounded bg-gray-800' />
                      <div className='mx-auto mt-1 h-3 w-20 animate-pulse rounded bg-gray-800/50' />
                    </div>
                  </div>
                </Slider.Slide>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Seasons Section Skeleton */}
      {type === 'tv' && (
        <section className='py-12'>
          <div className='mx-auto max-w-7xl px-6'>
            <div className='mb-6 h-8 w-32 animate-pulse rounded-lg bg-gray-800' />
            <div className='relative'>
              <Slider smartSlide={true}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Slider.Slide key={i} className='w-[180px]!'>
                    <div className='relative overflow-hidden rounded-lg'>
                      <div className='aspect-[2/3]' {...backgroundImage} />
                      <div className='absolute bottom-0 left-0 w-full space-y-2 p-3'>
                        <div className='h-4 w-3/4 animate-pulse rounded bg-gray-800' />
                        <div className='h-4 w-1/2 animate-pulse rounded bg-gray-800' />
                      </div>
                    </div>
                  </Slider.Slide>
                ))}
              </Slider>
            </div>
          </div>
        </section>
      )}

      {/* Trailers Section Skeleton */}
      <section className='bg-black/50 py-12'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-6 h-8 w-40 animate-pulse rounded-lg bg-gray-800' />
          <Slider smartSlide={true}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Slider.Slide key={i} className='w-[430px]!'>
                <div className='aspect-video rounded-lg' {...backgroundImage} />
                <div className='mt-2'>
                  <div className='h-4 w-56 animate-pulse rounded bg-gray-800' />
                  <div className='mt-1 h-3 w-32 animate-pulse rounded bg-gray-800/50' />
                </div>
              </Slider.Slide>
            ))}
          </Slider>
        </div>
      </section>

      {/* Recommendations & Similar Sections Skeletons */}
      {[1, 2].map((i) => (
        <section key={i} className='bg-black/50 py-12'>
          <div className='mx-auto max-w-7xl px-6'>
            <div className='mb-6 h-8 w-56 animate-pulse rounded-lg bg-gray-800' />
            <CardsListSkeleton asSlider={true} />
          </div>
        </section>
      ))}
    </div>
  );
}
