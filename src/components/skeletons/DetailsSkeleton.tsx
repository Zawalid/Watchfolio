import { placeholder } from '@/utils/shimmer-placeholder';
import CardsListSkeleton from './CardsSkeleton';
import Slider from '@/components/ui/slider';

const backgroundImage = { style: { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' } };

export default function DetailsSkeleton({ type }: { type: 'movie' | 'tv' }) {
  return (
    <div className='min-h-screen '>
        {/* Info Skeleton */}
        <div className='container mx-auto min-h-[700px] flex-1 py-4 pt-16'>
        <div className='flex animate-pulse flex-col gap-6 lg:flex-row lg:gap-8'>
          <div className='flex flex-col items-center gap-3 lg:items-start'>
            <div
              className='relative aspect-[2/3] h-80 w-full max-w-[280px] rounded-xl shadow-2xl'
              {...backgroundImage}
            />
            <div className='mt-1 w-full max-w-[280px] space-y-2'>
              <div className='h-10 w-full rounded-lg bg-Grey-500/30' />
              <div className='h-10 w-full rounded-lg bg-Grey-700/50' />
              <div className='flex gap-2'>
                <div className='h-9 flex-1 rounded-lg bg-Grey-700/50' />
                <div className='h-9 flex-1 rounded-lg bg-Grey-700/50' />
              </div>
            </div>
          </div>
          
          <div className='flex-1'>
            <div className='mb-6'>
              <div className='mb-3 flex flex-wrap items-center gap-3'>
                <div className='h-8 w-20 rounded-full bg-Grey-700/50' />
                <div className='h-8 w-28 rounded-full bg-Grey-700/50' />
                <div className='h-8 w-24 rounded-full bg-Grey-700/50' />
              </div>
              <div className='mb-5 h-10 w-3/4 rounded-lg bg-Grey-500/30 lg:h-12' />
              <div className='flex flex-wrap gap-2'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className='h-7 w-24 rounded-md bg-Grey-700/50' />
                ))}
              </div>
            </div>
            
            <div className='mb-4 space-y-2'>
              <div className='h-4 w-full rounded bg-Grey-700/50' />
              <div className='h-4 w-11/12 rounded bg-Grey-700/50' />
              <div className='h-4 w-5/6 rounded bg-Grey-700/50' />
              <div className='h-4 w-2/3 rounded bg-Grey-700/50' />
            </div>
            
            <div className='mt-4 space-y-4 border-t border-Grey-500/30 pt-4'>
              <div className='flex gap-6'>
                <div>
                  <div className='mb-1 h-3 w-12 rounded bg-Grey-500/30' />
                  <div className='h-7 w-24 rounded-md bg-Grey-700/50' />
                </div>
                <div>
                  <div className='mb-1 h-3 w-16 rounded bg-Grey-500/30' />
                  <div className='h-7 w-20 rounded-md bg-Grey-700/50' />
                </div>
              </div>
              
              <div className='flex flex-col gap-4 md:flex-row md:justify-between md:gap-6'>
                <div className='flex-1'>
                  <div className='mb-1 h-3 w-32 rounded bg-Grey-500/30' />
                  <div className='flex flex-wrap gap-2'>
                    <div className='h-7 w-28 rounded-md bg-Grey-700/50' />
                    <div className='h-7 w-24 rounded-md bg-Grey-700/50' />
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='mb-1 h-3 w-36 rounded bg-Grey-500/30' />
                  <div className='flex flex-wrap gap-2'>
                    <div className='h-7 w-32 rounded-md bg-Grey-700/50' />
                    <div className='h-7 w-28 rounded-md bg-Grey-700/50' />
                  </div>
                </div>
              </div>
              
              <div>
                <div className='mb-1 h-3 w-20 rounded bg-Grey-500/30' />
                <div className='flex w-fit items-center gap-1.5 rounded-md bg-Grey-700/50 p-1 pr-3'>
                  <div className='size-8 rounded-full bg-Grey-500/30' />
                  <div className='h-4 w-28 rounded bg-Grey-500/30' />
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
            <div className='inline-block h-8 w-48 animate-pulse rounded-lg bg-Grey-700/50' />
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
                      <div className='mx-auto h-4 w-24 animate-pulse rounded bg-Grey-700/50' />
                      <div className='mx-auto mt-1 h-3 w-20 animate-pulse rounded bg-Grey-700/50' />
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
            <div className='mb-6 h-8 w-32 animate-pulse rounded-lg bg-Grey-700/50' />
            <div className='relative'>
              <Slider smartSlide={true}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Slider.Slide key={i} className='w-[180px]!'>
                    <div className='relative overflow-hidden rounded-lg'>
                      <div className='aspect-[2/3]' {...backgroundImage} />
                      <div className='absolute bottom-0 left-0 w-full space-y-2 p-3'>
                        <div className='h-4 w-3/4 animate-pulse rounded bg-Grey-700/50' />
                        <div className='h-4 w-1/2 animate-pulse rounded bg-Grey-700/50' />
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
      <section className=' py-12'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-6 h-8 w-40 animate-pulse rounded-lg bg-Grey-700/50' />
          <Slider smartSlide={true}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Slider.Slide key={i} className='w-[430px]!'>
                <div className='aspect-video rounded-lg' {...backgroundImage} />
                <div className='mt-2'>
                  <div className='h-4 w-56 animate-pulse rounded bg-Grey-700/50' />
                  <div className='mt-1 h-3 w-32 animate-pulse rounded bg-Grey-700/50' />
                </div>
              </Slider.Slide>
            ))}
          </Slider>
        </div>
      </section>

      {/* Recommendations & Similar Sections Skeletons */}
      {[1, 2].map((i) => (
        <section key={i} className=' py-12'>
          <div className='mx-auto max-w-7xl px-6'>
            <div className='mb-6 h-8 w-56 animate-pulse rounded-lg bg-Grey-700/50' />
            <CardsListSkeleton asSlider={true} />
          </div>
        </section>
      ))}
    </div>
  );
}
