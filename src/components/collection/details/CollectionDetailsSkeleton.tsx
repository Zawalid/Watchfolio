import MediaCardsListSkeleton from '@/components/media/MediaCardsListSkeleton';
import { placeholder } from '@/utils/shimmer-placeholder';

const backgroundImage = { style: { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' } };

export default function CollectionDetailsSkeleton() {
  return (
    <div className='space-y-8'>
      {/* Header Skeleton */}
      <div className='relative min-h-[400px] rounded-xl overflow-hidden p-8 flex flex-col justify-end' {...backgroundImage}>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent' />
        <div className='relative z-10 animate-pulse space-y-4'>
          <div className='bg-Grey-700/50 h-12 w-3/4 rounded-lg' />
          <div className='space-y-2'>
            <div className='bg-Grey-700/50 h-4 w-full rounded' />
            <div className='bg-Grey-700/50 h-4 w-5/6 rounded' />
          </div>
          <div className='flex gap-4'>
            <div className='bg-Grey-700/50 h-8 w-24 rounded-full' />
            <div className='bg-Grey-700/50 h-8 w-32 rounded-full' />
          </div>
        </div>
      </div>

      {/* Movies List Skeleton */}
      <div className='space-y-4'>
        <div className='bg-Grey-700/50 h-8 w-48 rounded-lg animate-pulse' />
        <MediaCardsListSkeleton length={8} />
      </div>
    </div>
  );
}