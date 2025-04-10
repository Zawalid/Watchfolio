import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Form from '@/app/(auth-flow)/components/ResetPasswordForm';
import BackButton from '@/app/(auth-flow)/components/BackButton';

export const metadata = {
  title: 'Set new password | Watchfolio',
  description: 'Set a new password for your account',
};

export default async function Page(props: { searchParams?: Promise<{ userId?: string; secret?: string }> }) {
  const searchParams = await props.searchParams;
  const { userId, secret } = searchParams || { userId: '', secret: '' };

  const email = (await cookies()).get('reset-email')?.value;
  const decodeEmail = email ? Buffer.from(email, 'base64').toString('utf-8') : '';

  if (!userId || !secret || !decodeEmail) redirect('/forgot-password');

  return (
    <div className='grid h-full place-content-center gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <div className='grid size-14 place-content-center rounded-full bg-Grey/800'>
          <svg
            stroke='currentColor'
            fill='none'
            strokeWidth={2}
            viewBox='0 0 24 24'
            strokeLinecap='round'
            strokeLinejoin='round'
            xmlns='http://www.w3.org/2000/svg'
            className='size-7 text-Primary/500'
          >
            <path d='M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4' />
          </svg>
        </div>
        <h1 className='text-3xl font-medium text-Primary/50'>Set new password</h1>
        <p className='text-center text-Grey/300'>Your new password must be different from previously used passwords.</p>
      </div>
      <Form userId={userId} secret={secret} />
      <BackButton />
    </div>
  );
}
