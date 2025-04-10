import Link from 'next/link';

export default function BackButton() {
  return (
    <Link
      href='/signin'
      className='flex items-center justify-center gap-2 text-center text-Secondary/400 transition-colors duration-200 hover:text-Secondary/600'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='size-6'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18' />
      </svg>
      Back to Sign In
    </Link>
  );
}
