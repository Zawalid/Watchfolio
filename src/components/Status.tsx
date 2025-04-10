import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

export function NoResults({ children }: { children?: ReactNode }) {
  return (
    <div className='flex min-h-[500px] flex-1 flex-col items-center justify-center gap-1 text-center'>
      <div className='relative aspect-square w-[300px]'>
        <Image src='/images/empty.svg' alt='' fill />
      </div>{' '}
      <h2 className='text-xl font-semibold text-Grey/50 sm:text-2xl'>Sorry, No results found</h2>
      <p className='font-medium text-Grey/300'>There are no movies or tv shows matching your search terms.</p>
      {children}
    </div>
  );
}

export function EmptyWatchList({
  type = 'all',
  className = '',
}: {
  type?: 'all' | 'movies' | 'tv';
  className?: string;
}) {
  const heading = type === 'all' ? 'There are no items in your list' : `There are no ${type} in your list`;

  return (
    <div className={`flex min-h-[500px] flex-1 flex-col items-center justify-center gap-1 text-center ${className}`}>
      <div className='relative aspect-square w-[300px]'>
        <Image src='/images/empty.svg' alt='' fill />
      </div>
      <h2 className='text-xl font-semibold text-Grey/50 sm:text-2xl'>{heading}</h2>
      <p className='font-medium text-Grey/300'>
        Your watchlist is empty! Maybe your friends have some great suggestions?
        <br />
        Check your friends
        <Link
          href='/suggestions'
          className='mx-1 w-fit font-medium text-Primary/400 transition-colors duration-200 hover:text-Primary/500'
        >
          suggestions
        </Link>
        or
        <Link
          href='/'
          className='mx-1 w-fit font-medium text-Primary/400 transition-colors duration-200 hover:text-Primary/500'
        >
          add
        </Link>
        some {type === 'all' ? 'movies or tv shows' : type} to fill your list.
      </p>
    </div>
  );
}
