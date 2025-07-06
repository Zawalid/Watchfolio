import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Providers } from '@/providers';
import { useLibrarySync } from '@/hooks/useLibrarySync';
import { useInitialAuth } from '@/hooks/useInitialAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import AuthModal from '@/components/auth/AuthModal';
import Navbar from '@/components/Navbar';

export default function Layout() {
  const location = useLocation();

  useInitialAuth();
  useLibrarySync();
  useOnboarding();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Providers>
      <div className='flex h-full min-h-dvh flex-col'>
        <Navbar />
        <main className='container flex-1 px-4 pt-16 md:pt-20 lg:px-6 lg:pt-24'>
          <Outlet />
        </main>
        <OnboardingModal />
        <AuthModal />
      </div>
    </Providers>
  );
}
