'use client';

import { Button } from '@heroui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className='flex h-full flex-col items-center justify-center gap-6'>
      <div className='relative h-60 w-1/2'>
        <Image src='/images/404.svg' alt='' fill />
      </div>
      <div className='flex flex-col items-center gap-1 text-center'>
        <h2 className='text-xl font-semibold text-Grey/50 sm:text-3xl'>
          Sorry, {pathname.includes('/movies') ? 'Movie' : 'TV Show'} not found
        </h2>
        <p className='font-medium text-Grey/300'>
          The {pathname.includes('/movies') ? 'movie' : 'TV show'} you are looking for could not be found.
          <br />
          Please check the URL or go back.
        </p>
        <Link href={pathname.includes('/movies') ? '/movies' : '/tv'}>
          <Button className='mt-6' color='primary' size='lg'>
            Go Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
