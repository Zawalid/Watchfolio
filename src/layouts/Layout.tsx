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
      <div className='flex h-full min-h-dvh flex-col'>
        <Navbar />
        <main
          className='container mx-auto min-h-screen flex-1 px-4 pt-14 pb-20 sm:px-6 sm:pt-16 md:pt-18 md:pb-8 lg:px-8 lg:pt-20 xl:px-12'
          role='main'
          aria-label='Main content'
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
