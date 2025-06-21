import { Button } from '@heroui/button';
import { Link, Outlet, useLocation } from 'react-router';
import { GOOGLE_ICON } from '@/components/ui/Icons';
import { useState } from 'react';

export default function AuthLayout() {
  const location = useLocation();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const isSignInPage = location.pathname === '/signin';

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      // TODO: Implement Google OAuth with Appwrite
      console.log('Google sign in not yet implemented');
      // await authService.signInWithGoogle();
    } catch (error) {
      console.error('Google sign in failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className='grid h-full items-center gap-5 md:grid-cols-2'>
      <div className='relative hidden h-full  place-content-center md:grid'>
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
