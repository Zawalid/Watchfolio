import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Button } from '@heroui/react';
import { addToast } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmEmailVerification, user } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'error' | 'pending'>('pending');

  usePageTitle('Verify your email');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    if (!userId || !secret) {
      setVerificationResult('error');
      addToast({
        title: 'Invalid verification link',
        description: 'The verification link is invalid or incomplete.',
        color: 'danger',
      });
      return;
    }

    const verifyEmail = async () => {
      setIsVerifying(true);
      try {
        await confirmEmailVerification(userId, secret);
        setVerificationResult('success');
        addToast({
          title: 'Email verified successfully!',
          description: 'Your email has been verified. You can now access all features.',
          color: 'success',
        });
      } catch (error) {
        log('ERR', 'Failed to verify email:', error);
        setVerificationResult('error');
        addToast({
          title: 'Verification failed',
          description: 'Failed to verify your email. The link may be expired or invalid.',
          color: 'danger',
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, confirmEmailVerification]);

  const handleContinue = () => {
    if (user) {
      navigate('/settings/profile');
    } else {
      navigate('/');
    }
  };

  return (
    <div className='bg-Grey-900 flex min-h-screen flex-col'>
      <nav className='bg-blur sticky top-0 z-30 mb-12 py-4 backdrop-blur-lg'>
        <div className='container flex items-center justify-between'>
          <Link to='/' className='flex items-center transition-opacity hover:opacity-80'>
            <img src='/images/logo.svg' alt='watchfolio' width={40} height={20} />
          </Link>

          <Button
            as={Link}
            to='/'
            size='sm'
            variant='flat'
            className='text-Primary-400 hover:text-Primary-300 font-medium'
            startContent={
              <svg className='size-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
              </svg>
            }
          >
            Back to App
          </Button>
        </div>
      </nav>

      <main className='container flex flex-1 items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md text-center'>
          <div className='mb-8'>
            {isVerifying && (
              <>
                <div className='border-Primary-400 mx-auto mb-6 h-8 w-8 animate-spin rounded-full border-b-2'></div>
                <h1 className='text-Primary-50 mb-2 text-2xl font-bold'>Verifying your email...</h1>
                <p className='text-Grey-300'>Please wait while we verify your email address.</p>
              </>
            )}

            {verificationResult === 'success' && <Success alreadyVerified={!!user?.emailVerification} />}

            {verificationResult === 'error' && <Error />}
          </div>

          {!isVerifying && (
            <div className='space-y-3'>
              <Button color='primary' className='w-full' onPress={handleContinue}>
                {verificationResult === 'success' ? (user ? 'Go to Profile' : 'Continue to App') : 'Go Home'}
              </Button>

              {verificationResult === 'error' && user && (
                <Link to='/settings/details'>
                  <Button variant='flat' className='w-full'>
                    Request New Verification Email
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Success({ alreadyVerified }: { alreadyVerified?: boolean }) {
  return (
    <div className='flex flex-col items-center gap-6'>
      <div className='grid size-16 place-content-center rounded-full border border-green-500/20 bg-green-500/10'>
        <svg className='size-8 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
        </svg>
      </div>
      <div className='text-center'>
        <h1 className='text-Primary-50 mb-3 text-2xl font-bold'>
          {alreadyVerified ? 'Email already verified' : 'Email verified successfully!'}
        </h1>
        <p className='text-Grey-300 max-w-sm text-center'>
          {alreadyVerified
            ? 'Your email is already verified. You can continue using all features.'
            : 'Your email has been verified successfully. You now have access to all features.'}
        </p>
      </div>
    </div>
  );
}

function Error() {
  return (
    <div className='flex flex-col items-center gap-6'>
      <div className='grid size-16 place-content-center rounded-full border border-red-500/20 bg-red-500/10'>
        <svg className='size-8 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
        </svg>
      </div>
      <div className='text-center'>
        <h1 className='text-Primary-50 mb-3 text-2xl font-bold'>Verification failed</h1>
        <p className='text-Grey-300 max-w-sm text-center'>
          We couldn't verify your email. The link may be expired or invalid. Please try requesting a new verification
          email.
        </p>
      </div>
    </div>
  );
}
