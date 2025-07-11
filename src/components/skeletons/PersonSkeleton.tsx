import { placeholder } from '@/utils/shimmer-placeholder';
import MediaCardsListSkeleton from './MediaCardsListSkeleton';

const backgroundImage = { style: { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' } };

export default function PersonSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Person Info Section Skeleton - Following Info.tsx layout */}
      <div className='min-h-[500px] flex-1 py-4'>
        <div className='flex animate-pulse flex-col gap-6 lg:flex-row lg:gap-8'>
            {/* Profile Photo */}
            <div
              className='relative aspect-[2/3] w-[300px] rounded-xl shadow-2xl'
              {...backgroundImage}
            />

           

          {/* Right Column - Info */}
          <div className='flex-1'>
            {/* Title & Meta */}
            <div className='mb-6'>
              {/* Badges */}
              <div className='mb-3 flex flex-wrap items-center gap-3'>
                <div className='bg-Grey-700/50 h-8 w-20 rounded-full' />
                <div className='bg-Grey-700/50 h-8 w-28 rounded-full' />
                <div className='bg-Grey-700/50 h-8 w-24 rounded-full' />
              </div>

              {/* Name */}
              <div className='bg-Grey-500/30 mb-5 h-10 w-3/4 rounded-lg lg:h-12' />

              {/* Small pills */}
              <div className='flex flex-wrap gap-2'>
                <div className='bg-Grey-700/50 h-6 w-32 rounded-full' />
                <div className='bg-Grey-700/50 h-6 w-20 rounded-full' />
              </div>
            </div>

            {/* Biography */}
            <div className='mb-6 space-y-2'>
              <div className='bg-Grey-700/50 h-4 w-full rounded' />
              <div className='bg-Grey-700/50 h-4 w-11/12 rounded' />
              <div className='bg-Grey-700/50 h-4 w-5/6 rounded' />
              <div className='bg-Grey-700/50 h-4 w-3/4 rounded' />
              <div className='bg-Grey-700/50 h-4 w-4/5 rounded' />
            </div>

            {/* Details */}
            <div className='border-Grey-500/30 mt-4 space-y-4 border-t pt-4'>
              <div className='flex gap-12'>
                <div>
                  <div className='bg-Grey-500/30 mb-1 h-3 w-20 rounded' />
                  <div className='bg-Grey-700/50 h-5 w-24 rounded' />
                </div>
                <div>
                  <div className='bg-Grey-500/30 mb-1 h-3 w-16 rounded' />
                  <div className='bg-Grey-700/50 h-5 w-12 rounded' />
                </div>
              </div>

              <div className='flex gap-12'>
                <div>
                  <div className='bg-Grey-500/30 mb-1 h-3 w-18 rounded' />
                  <div className='bg-Grey-700/50 h-5 w-28 rounded' />
                </div>
                <div>
                  <div className='bg-Grey-500/30 mb-1 h-3 w-14 rounded' />
                  <div className='bg-Grey-700/50 h-5 w-32 rounded' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className='flex animate-pulse flex-wrap gap-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='bg-Grey-800/50 flex items-center gap-2 rounded-xl border border-Grey-700/50 px-4 py-2.5'>
            <div className='bg-Grey-600 h-4 w-4 rounded' />
            <div className='bg-Grey-600 h-4 w-16 rounded' />
          </div>
        ))}
      </div>

      {/* Results Header Skeleton */}
      <div className='border-Grey-800/50 flex animate-pulse items-center justify-between border-b pb-4'>
        <div>
          <div className='bg-Grey-500/30 h-6 w-24 rounded' />
          <div className='bg-Grey-700/50 mt-1 h-4 w-48 rounded' />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <MediaCardsListSkeleton length={12} />
    </div>
  );
}