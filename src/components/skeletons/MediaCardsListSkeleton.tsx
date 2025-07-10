import { placeholder } from '@/utils/shimmer-placeholder';
import { Slider } from '@/components/ui/slider';

function MediaCardSkeleton() {
  return (
    <div className='flex flex-col gap-4 backdrop-blur-xs'>
      <div
        className='h-[300px] rounded-xl'
        style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
      />
    </div>
  );
}

export default function MediaCardsListSkeleton({ length = 20, asSlider }: { length?: number; asSlider?: boolean }) {
  if (asSlider)
    return (
      <Slider>
        {Array.from({ length: 8 }).map((_, i) => (
          <Slider.Slide key={i} className='w-[160px] sm:w-[200px]!'>
            <MediaCardSkeleton />
          </Slider.Slide>
        ))}
      </Slider>
    );
  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-5'>
      {Array.from({ length }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}
