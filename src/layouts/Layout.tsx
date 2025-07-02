import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from '@/components/Navbar';
import { Providers } from '@/providers';
import { useLibrarySync } from '@/hooks/useLibrarySync';
import { useInitialAuth } from '@/hooks/useInitialAuth';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function Layout() {
  const location = useLocation();

  useInitialAuth();
  useLibrarySync();
  useOnboarding(); // Auto-trigger onboarding for first-time users

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Providers>
      <div className='flex h-full min-h-dvh flex-col'>
        <Navbar />
        <main className='container flex-1'>
          <Outlet />
        </main>
        <OnboardingModal />
      </div>
    </Providers>
  );
}
