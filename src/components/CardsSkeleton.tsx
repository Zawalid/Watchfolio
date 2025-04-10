function CardSkeleton() {
  return (
    <div className='animate-pulse flex flex-col gap-4 backdrop-blur-sm'>
      <div className='h-[300px] rounded-xl bg-Grey/800' />
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <span className='h-4 w-36 rounded-lg bg-Grey/800 shadow-md'></span>
          <span className='h-4 w-10 rounded-full bg-Grey/800 shadow-md'></span>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex gap-1'>
            <span className='h-4 w-16 rounded-lg bg-Grey/800 shadow-md'></span>
            <span className='h-4 w-14 rounded-lg bg-Grey/800 shadow-md'></span>
          </div>
          <div className='flex gap-0.5'>
            <span className='h-4 w-3 rounded-full bg-Grey/800 shadow-md'></span>
            <span className='h-4 w-4 rounded-full bg-Grey/800 shadow-md'></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardsListSkeleton({ length = 12 }: { length?: number }) {
  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-5'>
      {Array.from({ length }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
