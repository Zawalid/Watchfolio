'use client';

import { Button } from '@heroui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GOOGLE_ICON } from '@/components/ui/Icons';
import { useState } from 'react';
import { signIn } from '@/lib/auth/client';

export default function AuthPrompt() {
  const pathname = usePathname();
  const [isSigningIn, setIsSigningIn] = useState(false);

  return (
    <>
      <div className='mb-7'>
        <h1 className='text-4xl font-bold text-Primary/50'>
          {pathname === '/signin' ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p className='text-Grey/300'>
          {pathname === '/signin'
            ? 'Welcome Back. Please enter your details.'
            : 'Join us today. Please fill in your information to create an account.'}
        </p>
      </div>

      <p className='order-3 text-center text-sm text-Grey/300'>
        {pathname === '/signin' ? "Don't have an account?" : 'Already have an account?'}
        <Link
          href={pathname === '/signin' ? '/signup' : '/signin'}
          className='ml-1 text-Primary/400 transition-colors duration-200 hover:text-Primary/500'
        >
          {pathname === '/signin' ? 'Sign Up' : 'Sign In'}
        </Link>
      </p>

      <p className='order-2 text-center text-sm text-Grey/300'>or</p>
      <Button
        className='order-2 w-full bg-White/100 text-black hover:bg-White/75'
        isLoading={isSigningIn}
        spinnerPlacement='end'
        startContent={GOOGLE_ICON}
        type='button'
        onPress={async () => {
          await signIn.social(
            { provider: 'google', callbackURL: '/' },
            { onRequest: () => setIsSigningIn(true), onResponse: () => setIsSigningIn(false) }
          );
        }}
      >
        Continue with Google
      </Button>
    </>
  );
}
