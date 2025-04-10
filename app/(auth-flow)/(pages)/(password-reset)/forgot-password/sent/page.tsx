import { cookies } from 'next/headers';
import { Button } from '@heroui/button';
import { redirect } from 'next/navigation';
import { sendPasswordResetEmail } from '@/app/(auth-flow)/actions/password-reset';
import BackButton from '@/app/(auth-flow)/components/BackButton';

export const metadata = {
  title: 'Check your email | Watchfolio',
  description: 'Password reset email sent successfully',
};

export default async function Page() {
  const email = (await cookies()).get('reset-email')?.value;
  const decodeEmail = email ? Buffer.from(email, 'base64').toString('utf-8') : '';

  if (!decodeEmail) redirect('/forgot-password');

  return (
    <div className='grid h-full place-content-center gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <div className='grid size-14 place-content-center rounded-full bg-Grey/800'>
          <svg
            stroke='currentColor'
            fill='none'
            strokeWidth={2}
            viewBox='0 0 24 24'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            className='size-7 text-Primary/500'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
            />
          </svg>
        </div>
        <h1 className='text-3xl font-medium text-Primary/50'>Check your email</h1>
        <p className='text-center text-Grey/300'>
          We&apos;ve sent an email with a link to reset your password to
          <br />
          <span className='font-bold text-Grey/200'>{decodeEmail}</span>
        </p>
      </div>
      <Button as='a' href='mailto:' color='primary'>
        Open email app
      </Button>
      <form
        action={async () => {
          'use server';
          const formData = new FormData();
          formData.append('email', decodeEmail);
          await sendPasswordResetEmail(null, formData);
        }}
      >
        <p className='text-center text-sm text-Grey/300'>
          Didn&apos;t receive the email?
          <button className='ml-1 text-Primary/400 transition-colors duration-200 hover:text-Primary/500' type='submit'>
            Click to resend
          </button>
        </p>
      </form>
      <BackButton />
    </div>
  );
}
