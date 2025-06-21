import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-6'>
      <div className='relative h-60 w-1/2'>
        <img src='/images/404.svg' alt='' className='size-full object-contain' />
      </div>
      <div className='flex flex-col items-center gap-1 text-center'>
        <h2 className='text-Grey-50 text-2xl font-semibold sm:text-3xl'>Lost your way?</h2>
        <p className='text-Grey-300 font-medium'>
          Oops! This is awkward. You are looking for something that doesn&apos;t <br />
          actually exist.
        </p>
        <Link to='/'>
          <button className='mt-6 rounded-md bg-blue-600 px-4 py-2 text-white'>Go Home</button>
        </Link>
      </div>
    </div>
  );
}
