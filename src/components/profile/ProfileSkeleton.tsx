const shimmerBg = 'bg-Grey-700/50 animate-pulse';

export default function ProfileSkeleton() {
  return (
    <div className='space-y-10'>
      {/* Header Skeleton */}
      <div className='from-Grey-800/50 to-Grey-900/50 rounded-2xl border border-white/10 bg-gradient-to-br p-8 backdrop-blur-sm'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
            {/* Avatar */}
              <div className={`size-28 rounded-full ${shimmerBg}`} />
             

            {/* Name + Bio */}
            <div className='flex-1 space-y-4'>
              <div className='space-y-2'>
                <div className={`h-6 w-48 rounded ${shimmerBg}`} />
                <div className={`h-4 w-32 rounded ${shimmerBg}`} />
              </div>
              <div className='space-y-1'>
                <div className={`h-4 w-80 rounded ${shimmerBg}`} />
                <div className={`h-4 w-75 rounded ${shimmerBg}`} />
                <div className={`h-4 w-60 rounded ${shimmerBg}`} />
                <div className={`h-4 w-48 rounded ${shimmerBg}`} />
              </div>
              <div className='flex flex-wrap gap-3'>
                <div className={`h-6 w-40 rounded ${shimmerBg}`} />
                <div className={`h-6 w-36 rounded ${shimmerBg}`} />
              </div>
              <div className='flex flex-wrap gap-3'>
                <div className={`h-6 w-60 rounded ${shimmerBg}`} />
                <div className={`h-6 w-56 rounded ${shimmerBg}`} />
              </div>
            </div>
          </div>

            <div className={`h-10 w-10 rounded ${shimmerBg}`} />
        </div>
      </div>

      {/* Tabs Header Skeleton */}
      <div className='flex gap-4'>
        {[1, 2, 3].map((_, i) => (
          <div key={i} className={`h-8 w-32 rounded-full ${shimmerBg}`} />
        ))}
      </div>

      {/* Default Tab: Viewing Taste Skeleton */}
      <div className='grid gap-6'>
        {[1, 2, 3].map((_, i) => (
          <div key={i} className='space-y-4 rounded-xl border border-white/5 bg-white/[0.015] p-4 backdrop-blur-sm'>
            <div className='flex items-center gap-3'>
              <div className={`size-10 rounded-lg  ${shimmerBg}`} />
              <div>
                <div className={`mb-1 h-4 w-32 rounded ${shimmerBg}`} />
                <div className={`h-3 w-40 rounded ${shimmerBg}`} />
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className='h-6 w-20 rounded-full bg-white/10' />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
