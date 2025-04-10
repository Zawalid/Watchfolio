import BackButton from '@/app/(auth-flow)/components/BackButton';
import Form from '@/app/(auth-flow)/components/ForgotPasswordForm';

export const metadata = {
  title: 'Forgot Password ? | Watchfolio',
  description: 'Reset your password page',
};

export default function Page() {
  return (
    <div className='grid h-full place-content-center gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <div className='grid size-14 place-content-center rounded-full bg-Grey/800'>
          <svg
            stroke='currentColor'
            fill='currentColor'
            strokeWidth={0}
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            className='size-7 text-Primary/500'
          >
            <path fill='none' d='M0 0h24v24H0z' />
            <path d='M2.81 2.81 1.39 4.22l2.59 2.59A6.012 6.012 0 0 0 1 12c0 3.31 2.69 6 6 6 2.22 0 4.15-1.21 5.19-3l7.59 7.61 1.41-1.41L2.81 2.81zM7 16c-2.21 0-4-1.79-4-4 0-1.67 1.02-3.1 2.47-3.7l1.71 1.71C7.12 10 7.06 10 7 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2c0-.06 0-.12-.01-.18l1.74 1.74C10.22 14.48 9.14 16 7 16zm10-1.83V13h-1.17L17 14.17zM13.83 11H21v2h-2v3l2 2v-3h2V9H11.83l2 2z' />
          </svg>
        </div>
        <h1 className='text-3xl font-medium text-Primary/50'>Forgot Password ?</h1>
        <p className='text-Grey/300'>
          Enter your email address below and we&apos;ll send you a link to reset your password.
        </p>
      </div>
      <Form />
      <BackButton />
    </div>
  );
}
