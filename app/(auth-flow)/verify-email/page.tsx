import { redirect } from 'next/navigation';
import { Button } from '@heroui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Email verification | Watchfolio',
  description: 'Your email was verified successfully',
};

export default async function Page(props: { searchParams?: Promise<{ userId?: string; secret?: string }> }) {
  // const searchParams = await props.searchParams;
  // const { userId, secret } = searchParams || { userId: '', secret: '' };
  // const user = await getUser();

  // if (user?.emailVerification) return <Success alreadyVerified />;

  // if (!userId || !secret || !account) redirect('/');

  // try {
  //    await account.updateVerification(userId, secret);
  //   return <Success />;
  // } catch (error) {
  //   console.error(error);
  //   return <Error />;
  // }
  return null;
}

function Success({ alreadyVerified }: { alreadyVerified?: boolean }) {
  return (
    <div className='grid h-full place-content-center gap-8'>
      <div className='flex min-w-80 flex-col items-center gap-2'>
        <div className='grid size-14 place-content-center rounded-full bg-Grey/800'>
          <svg
            stroke='currentColor'
            fill='currentColor'
            strokeWidth={0}
            viewBox='0 0 16 16'
            xmlns='http://www.w3.org/2000/svg'
            className='size-8 text-Success/500'
          >
            <path d='M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0' />
            <path d='M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z' />
          </svg>
        </div>
        <h1 className='text-3xl font-medium text-Primary/50'>
          {alreadyVerified ? 'Email already verified' : 'Email verified'}
        </h1>
        <p className='text-center text-Grey/300'>
          {alreadyVerified ? 'Your email is already verified.' : 'Your email has been verified successfully.'}
          <br />
          You can now go back to your watchlist.
        </p>
      </div>
      <Link href='/watchlist'>
        <Button color='primary' className='w-full'>
          Take Me
        </Button>
      </Link>
    </div>
  );
}

function Error() {
  return (
    <div className='grid h-full place-content-center gap-8'>
      <div className='flex min-w-80 flex-col items-center gap-2'>
        <div className='grid size-14 place-content-center rounded-full bg-Grey/800'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-8 text-Error/500'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
            />
          </svg>
        </div>
        <h1 className='text-3xl font-medium text-Primary/50'>Verification failed</h1>
        <p className='text-center text-Grey/300'>
          There was an error verifying your email.
          <br />
          Please try again later.
        </p>
      </div>
      <Link href='/'>
        <Button color='primary' className='w-full'>
          Go Home
        </Button>
      </Link>
    </div>
  );
}
