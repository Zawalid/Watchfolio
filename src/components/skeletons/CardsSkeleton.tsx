import { placeholder } from '@/utils/shimmer-placeholder';
import Slider from '../ui/slider';

function CardSkeleton() {
  return (
    <div className='flex flex-col gap-4 backdrop-blur-xs'>
      <div
        className='h-[300px] rounded-xl'
        style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
      />
      <div className='flex animate-pulse flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <span className='bg-Grey-800 h-4 w-36 rounded-lg shadow-md'></span>
          <span className='bg-Grey-800 h-4 w-10 rounded-full shadow-md'></span>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex gap-1'>
            <span className='bg-Grey-800 h-4 w-16 rounded-lg shadow-md'></span>
            <span className='bg-Grey-800 h-4 w-14 rounded-lg shadow-md'></span>
          </div>
          <div className='flex gap-0.5'>
            <span className='bg-Grey-800 h-4 w-3 rounded-full shadow-md'></span>
            <span className='bg-Grey-800 h-4 w-4 rounded-full shadow-md'></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardsListSkeleton({ length = 20, asSlider }: { length?: number; asSlider?: boolean }) {
  if (asSlider)
    return (
      <Slider smartSlide={true}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Slider.Slide key={i} className='w-[160px] sm:w-[200px]!'>
            <CardSkeleton />
          </Slider.Slide>
        ))}
      </Slider>
    );
  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-5'>
      {Array.from({ length }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
