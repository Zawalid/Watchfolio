import { Button } from '@heroui/button';
import { Link, Outlet, useLocation } from 'react-router';
import { addToast } from '@heroui/toast';
import { GOOGLE_ICON } from '@/components/ui/Icons';
import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthLayout() {
  const location = useLocation();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { signInWithGoogle } = useAuthStore();

  const isSignInPage = location.pathname === '/signin';

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in failed:', error);
      addToast({
        title: 'Sign in failed',
        description: 'Failed to sign in with Google. Please try again.',
        color: 'danger',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className='grid h-full items-center gap-5 md:grid-cols-2'>
      <div className='relative hidden h-full place-content-center md:grid'>
        <img src='/images/signin.svg' alt='image' />
      </div>
      <div className='flex flex-col gap-2'>
        <div className='mb-7'>
          <h1 className='text-Primary-50 text-4xl font-bold'>{isSignInPage ? 'Welcome Back' : 'Create an Account'}</h1>
          <p className='text-Grey-300'>
            {isSignInPage
              ? 'Welcome Back. Please enter your details.'
              : 'Join us today. Please fill in your information to create an account.'}
          </p>
        </div>

        <Outlet />

        <p className='text-Grey-300 text-center text-sm'>or</p>

        <Button
          className='w-full bg-white/100 text-black hover:bg-white/75'
          isLoading={isSigningIn}
          spinnerPlacement='end'
          startContent={GOOGLE_ICON}
          type='button'
          onPress={handleGoogleSignIn}
        >
          Continue with Google
        </Button>

        <p className='text-Grey-300 text-center text-sm'>
          {isSignInPage ? "Don't have an account?" : 'Already have an account?'}
          <Link
            to={isSignInPage ? '/signup' : '/signin'}
            className='text-Primary-400 hover:text-Primary-500 ml-1 transition-colors duration-200'
          >
            {isSignInPage ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}
