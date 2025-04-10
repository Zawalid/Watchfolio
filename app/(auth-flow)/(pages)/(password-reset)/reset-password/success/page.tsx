import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Form from '@/app/(auth-flow)/components/ResetSuccessForm';
import BackButton from '@/app/(auth-flow)/components/BackButton';

export const metadata = {
  title: 'Password reset | Watchfolio',
  description: 'Your password was reset successfully',
};

export default async function Page(props: { searchParams?: Promise<{ userId?: string; secret?: string }> }) {
  const searchParams = await props.searchParams;
  const { userId, secret } = searchParams || { userId: '', secret: '' };

  const reset = (await cookies()).get('rs')?.value;

  if (!userId || !secret || !reset || reset !== 'true') redirect('/forgot-password');

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
        <h1 className='text-3xl font-medium text-Primary/50'>Password reset</h1>
        <p className='text-center text-Grey/300'>
          Your password has been successfully reset.
          <br />
          Click below to log in magically.
        </p>
      </div>
      <Form userId={userId} secret={secret} />
      <BackButton />
    </div>
  );
}
