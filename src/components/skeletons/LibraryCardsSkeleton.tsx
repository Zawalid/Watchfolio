import { placeholder } from '@/utils/shimmer-placeholder';
import { GripVertical } from 'lucide-react';

function LibraryCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className='relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-white/[0.08] backdrop-blur-sm'>
        <div className='flex items-center gap-4 p-4'>
          {/* Drag Handle */}
          <div className='opacity-50'>
            <GripVertical className='text-Grey-400 size-4' />
          </div>

          {/* Poster */}
          <div
            className='h-20 w-14 flex-shrink-0 rounded-lg'
            style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
          />

          {/* Content */}
          <div className='min-w-0 flex-1'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0 flex-1 animate-pulse'>
                <div className='bg-Grey-700 mb-2 h-5 w-48 rounded-lg' />
                <div className='flex items-center gap-2'>
                  <div className='bg-Grey-700 h-3 w-12 rounded' />
                  <span className='text-Grey-600'>•</span>
                  <div className='bg-Grey-700 h-3 w-16 rounded' />
                  <span className='text-Grey-600'>•</span>
                  <div className='bg-Grey-700 h-3 w-24 rounded' />
                </div>
              </div>

              {/* Status & Rating placeholders */}
              <div className='flex flex-shrink-0 animate-pulse items-center gap-3'>
                <div className='bg-Grey-700 h-7 w-20 rounded-full' />
                <div className='bg-Grey-700 h-6 w-16 rounded-full' />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex animate-pulse items-center gap-2'>
            <div className='bg-Grey-700 h-8 w-8 rounded-lg' />
            <div className='bg-Grey-700 h-8 w-8 rounded-lg' />
            <div className='bg-Grey-700 h-8 w-8 rounded-lg' />
          </div>
        </div>
      </div>
    );
  }

  // Grid view skeleton
  return (
    <div className='overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.08] backdrop-blur-sm'>
      {/* Poster */}
      <div
        className='aspect-[2/3] w-full'
        style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
      />

      {/* Content */}
      <div className='animate-pulse space-y-3 p-4'>
        <div className='bg-Grey-700 h-5 w-full rounded-lg' />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='bg-Grey-700 h-4 w-8 rounded' />
            <span className='text-Grey-600'>•</span>
            <div className='bg-Grey-700 h-4 w-12 rounded' />
          </div>
          <div className='bg-Grey-700 h-4 w-16 rounded-full' />
        </div>
        <div className='flex gap-2'>
          <div className='bg-Grey-700 h-6 w-16 rounded-full' />
          <div className='bg-Grey-700 h-6 w-20 rounded-full' />
        </div>
      </div>
    </div>
  );
}

export default function LibraryCardsSkeleton({
  length = 12,
  viewMode = 'grid',
}: {
  length?: number;
  viewMode?: 'grid' | 'list';
}) {
  if (viewMode === 'list') {
    return (
      <div className='space-y-4'>
        {Array.from({ length }).map((_, i) => (
          <LibraryCardSkeleton key={i} viewMode='list' />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-6'>
      {Array.from({ length }).map((_, i) => (
        <LibraryCardSkeleton key={i} viewMode='grid' />
      ))}
    </div>
  );
}
