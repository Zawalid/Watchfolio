import { placeholder } from '@/utils/shimmer-placeholder';


function CelebrityCardSkeleton() {
  return (
    <div className='group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] shadow-lg backdrop-blur-sm'>
      {/* Top left badge */}
      <div className='absolute top-3 left-3 z-20'>
        <div className='animate-pulse rounded-full border border-white/25 bg-white/10 px-2.5 py-1 backdrop-blur-md'>
          <div className='bg-Grey-600 h-3 w-16 rounded' />
        </div>
      </div>

      {/* Photo content */}
      <div className='relative block aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'>
        <div
          className='size-full'
          style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
        />

        {/* Gradients */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent' />

        {/* Content overlay */}
        <div className='absolute inset-x-0 bottom-0 space-y-3 p-4'>
          {/* Name */}
          <div className='animate-pulse space-y-2'>
            <div className='bg-Grey-500/50 h-5 w-3/4 rounded' />
            <div className='bg-Grey-600/50 h-4 w-1/2 rounded' />
          </div>

          {/* Department and year */}
          <div className='flex animate-pulse items-center gap-2.5'>
            <div className='flex items-center gap-1'>
              <div className='bg-Grey-600 h-3.5 w-3.5 rounded' />
              <div className='bg-Grey-600 h-4 w-12 rounded' />
            </div>
            <div className='flex items-center gap-1'>
              <div className='bg-Grey-600 h-3.5 w-3.5 rounded' />
              <div className='bg-Grey-600 h-4 w-8 rounded' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CelebritiesCardsListSkeleton({ length = 20,noContainer }: {
  length?: number;
  noContainer?: boolean;
}) {
  if (noContainer) {
    return (
      <>
        {Array.from({ length }).map((_, index) => (
          <CelebrityCardSkeleton key={index} />
        ))}
      </>
    );
  }

  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5'>
      {Array.from({ length }).map((_, index) => (
        <CelebrityCardSkeleton key={index} />
      ))}
    </div>
  );
}
