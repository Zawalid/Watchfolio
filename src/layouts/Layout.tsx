import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Providers } from '@/providers';
import { useInitialAuth } from '@/hooks/useInitialAuth';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import AuthModal from '@/components/auth/AuthModal';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import KeyboardShortcuts from '@/components/library/KeyboardShortcuts';
import BottomNavBar from '@/components/navbar/BottomNavBar';

export default function Layout() {
  const location = useLocation();

  useInitialAuth();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Providers>
      <div className='flex h-full min-h-dvh flex-col pb-21 md:pb-0'>
        <Navbar />
        <main
          className='container mx-auto max-w-screen min-h-screen flex-1 px-4 lg:px-6 py-20'
          role='main'
          aria-label='Main content'
          style={{ '--container-padding': 'max(1rem, calc((100vw - 100%) / 2))' } as React.CSSProperties}
        >
          <Outlet />
        </main>
        <BottomNavBar />
        <Footer />
        <OnboardingModal />
        <AuthModal />
        <ScrollToTopButton />
        <KeyboardShortcuts />
      </div>
    </Providers>
  );
}
