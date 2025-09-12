import { placeholder } from '@/utils/shimmer-placeholder';
import MediaCardsListSkeleton from '../MediaCardsListSkeleton';
import { Slider } from '@/components/ui/Slider';

const backgroundImage = { style: { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' } };

export default function DetailsSkeleton({ type }: { type: MediaType }) {
  return (
    <div className='min-h-screen'>
      {/* Mobile Hero Section */}
      <div className='relative lg:hidden'>
        {/* Backdrop */}
        <div className='relative h-[70vh] w-full overflow-hidden'>
          <div 
            className='absolute inset-0 scale-110 animate-pulse opacity-70'
            {...backgroundImage}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-Grey-900 via-Grey-900/60 to-Grey-900/30' />
          <div className='absolute inset-0 bg-gradient-to-t from-Grey-900 via-transparent to-transparent' />
        </div>

        {/* Content Overlay */}
        <div className='absolute inset-0 flex flex-col justify-end p-6 pb-8'>
          <div className='animate-pulse space-y-4'>
            {/* Tags */}
            <div className='flex flex-wrap gap-2'>
              <div className='bg-Grey-700/50 h-6 w-16 rounded-full' />
              <div className='bg-Grey-700/50 h-6 w-20 rounded-full' />
              <div className='bg-Grey-700/50 h-6 w-18 rounded-full' />
            </div>
            
            {/* Title */}
            <div className='bg-Grey-500/30 h-8 w-4/5 rounded-lg' />
            
            {/* Genres */}
            <div className='flex flex-wrap gap-2'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='bg-Grey-700/50 h-6 w-20 rounded-md' />
              ))}
            </div>
            
            {/* Description */}
            <div className='space-y-2'>
              <div className='bg-Grey-700/50 h-3 w-full rounded' />
              <div className='bg-Grey-700/50 h-3 w-11/12 rounded' />
              <div className='bg-Grey-700/50 h-3 w-3/4 rounded' />
            </div>
            
            {/* Action Buttons */}
            <div className='space-y-2 pt-2'>
              <div className='bg-Grey-500/30 h-12 w-full rounded-lg' />
              <div className='bg-Grey-700/50 h-12 w-full rounded-lg' />
              <div className='flex gap-2'>
                <div className='bg-Grey-700/50 h-11 flex-1 rounded-lg' />
                <div className='bg-Grey-700/50 h-11 flex-1 rounded-lg' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className='relative hidden lg:block'>
        {/* Backdrop */}
        <div className='absolute inset-0 h-[100vh] w-screen overflow-hidden -mx-6'>
          <div 
            className='absolute inset-0 scale-110 animate-pulse opacity-30'
            {...backgroundImage}
          />
          <div className='absolute inset-0 bg-gradient-to-r from-Grey-900 via-Grey-900/95 to-Grey-900/60' />
          <div className='absolute inset-0 bg-gradient-to-t from-Grey-900 via-transparent to-transparent' />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-Grey-900' />
        </div>

        {/* Content */}
        <div className='relative z-10 mx-auto max-w-7xl px-6 pt-24'>
          <div className='flex animate-pulse gap-12'>
            {/* Floating Poster */}
            <div className='flex-shrink-0'>
              <div className='relative aspect-[2/3] w-[320px] rounded-xl shadow-2xl' {...backgroundImage} />
              <div className='mt-4 space-y-2'>
                <div className='bg-Grey-500/30 h-12 w-full rounded-lg' />
                <div className='bg-Grey-700/50 h-12 w-full rounded-lg' />
                <div className='flex gap-2'>
                  <div className='bg-Grey-700/50 h-11 flex-1 rounded-lg' />
                  <div className='bg-Grey-700/50 h-11 flex-1 rounded-lg' />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className='flex-1 pt-8'>
              <div className='mb-8'>
                <div className='mb-4 flex flex-wrap items-center gap-3'>
                  <div className='bg-Grey-700/50 h-8 w-20 rounded-full' />
                  <div className='bg-Grey-700/50 h-8 w-28 rounded-full' />
                  <div className='bg-Grey-700/50 h-8 w-24 rounded-full' />
                </div>
                <div className='bg-Grey-500/30 mb-6 h-12 w-4/5 rounded-lg' />
                <div className='flex flex-wrap gap-2'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='bg-Grey-700/50 h-7 w-24 rounded-md' />
                  ))}
                </div>
              </div>

              <div className='mb-6 space-y-3'>
                <div className='bg-Grey-700/50 h-4 w-full rounded' />
                <div className='bg-Grey-700/50 h-4 w-11/12 rounded' />
                <div className='bg-Grey-700/50 h-4 w-5/6 rounded' />
                <div className='bg-Grey-700/50 h-4 w-2/3 rounded' />
              </div>

              <div className='border-Grey-500/30 space-y-6 border-t pt-6'>
                <div className='flex gap-8'>
                  <div>
                    <div className='bg-Grey-500/30 mb-2 h-3 w-12 rounded' />
                    <div className='bg-Grey-700/50 h-7 w-28 rounded-md' />
                  </div>
                  <div>
                    <div className='bg-Grey-500/30 mb-2 h-3 w-16 rounded' />
                    <div className='bg-Grey-700/50 h-7 w-24 rounded-md' />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-8'>
                  <div>
                    <div className='bg-Grey-500/30 mb-2 h-3 w-32 rounded' />
                    <div className='flex flex-wrap gap-2'>
                      <div className='bg-Grey-700/50 h-7 w-28 rounded-md' />
                      <div className='bg-Grey-700/50 h-7 w-24 rounded-md' />
                    </div>
                  </div>
                  <div>
                    <div className='bg-Grey-500/30 mb-2 h-3 w-36 rounded' />
                    <div className='flex flex-wrap gap-2'>
                      <div className='bg-Grey-700/50 h-7 w-32 rounded-md' />
                      <div className='bg-Grey-700/50 h-7 w-28 rounded-md' />
                    </div>
                  </div>
                </div>

                <div>
                  <div className='bg-Grey-500/30 mb-2 h-3 w-20 rounded' />
                  <div className='bg-Grey-700/50 flex w-fit items-center gap-2 rounded-md p-2 pr-4'>
                    <div className='bg-Grey-500/30 size-8 rounded-full' />
                    <div className='bg-Grey-500/30 h-4 w-32 rounded' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cast Section Skeleton */}
      <section className='py-8 lg:py-12'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <div className='bg-Grey-700/50 mb-6 inline-block h-7 w-40 animate-pulse rounded-lg sm:h-8 sm:w-48' />
          <div className='relative'>
            <Slider>
              {Array.from({ length: 15 }).map((_, i) => (
                <Slider.Slide key={i} className='w-[80px] sm:w-[100px]!'>
                  <div>
                    <div className='aspect-square overflow-hidden rounded-full'>
                      <div className='size-full' {...backgroundImage} />
                    </div>
                    <div className='mt-2 text-center'>
                      <div className='bg-Grey-700/50 mx-auto h-3 w-16 animate-pulse rounded sm:h-4 sm:w-20' />
                      <div className='bg-Grey-700/50 mx-auto mt-1 h-2.5 w-12 animate-pulse rounded sm:h-3 sm:w-16' />
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
        <section className='py-8 lg:py-12'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6'>
            <div className='bg-Grey-700/50 mb-6 h-7 w-24 animate-pulse rounded-lg sm:h-8 sm:w-32' />
            <div className='relative'>
              <Slider>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Slider.Slide key={i} className='w-[140px] sm:w-[180px]!'>
                    <div className='relative overflow-hidden rounded-lg'>
                      <div className='aspect-[2/3]' {...backgroundImage} />
                      <div className='absolute bottom-0 left-0 w-full space-y-1.5 p-2 sm:space-y-2 sm:p-3'>
                        <div className='bg-Grey-700/50 h-3 w-3/4 animate-pulse rounded sm:h-4' />
                        <div className='bg-Grey-700/50 h-3 w-1/2 animate-pulse rounded sm:h-4' />
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
      <section className='py-8 lg:py-12'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <div className='bg-Grey-700/50 mb-6 h-7 w-32 animate-pulse rounded-lg sm:h-8 sm:w-40' />
          <Slider>
            {Array.from({ length: 4 }).map((_, i) => (
              <Slider.Slide key={i} className='w-[280px] sm:w-[360px] lg:w-[430px]!'>
                <div className='aspect-video rounded-lg' {...backgroundImage} />
                <div className='mt-2'>
                  <div className='bg-Grey-700/50 h-3 w-48 animate-pulse rounded sm:h-4 sm:w-56' />
                  <div className='bg-Grey-700/50 mt-1 h-2.5 w-24 animate-pulse rounded sm:h-3 sm:w-32' />
                </div>
              </Slider.Slide>
            ))}
          </Slider>
        </div>
      </section>

      {/* Recommendations & Similar Sections Skeletons */}
      {[1, 2].map((i) => (
        <section key={i} className='py-8 lg:py-12'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6'>
            <div className='bg-Grey-700/50 mb-6 h-7 w-44 animate-pulse rounded-lg sm:h-8 sm:w-56' />
            <MediaCardsListSkeleton asSlider={true} />
          </div>
        </section>
      ))}
    </div>
  );
}
