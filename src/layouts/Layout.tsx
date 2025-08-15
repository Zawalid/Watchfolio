import { useLayoutEffect, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Providers } from '@/providers';
import { useInitialAuth } from '@/hooks/useInitialAuth';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import AuthModal from '@/components/auth/AuthModal';
import Navbar from '@/components/Navbar';
import { ResponsiveScreen } from '@/components/ui/ResponsiveGuardScreen';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import KeyboardShortcuts from '@/components/library/KeyboardShortcuts';

export default function Layout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useInitialAuth();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Providers>
      {isMobile ? (
        <ResponsiveScreen />
      ) : (
        <div className='flex h-full min-h-dvh flex-col'>
          <Navbar />
          <main className='container mx-auto min-h-screen flex-1 px-4 pt-16 pb-10 md:pt-20 lg:px-6 lg:pt-24'>
            <Outlet />
          </main>
          <Footer />
          <OnboardingModal />
          <AuthModal />
          <ScrollToTopButton />
          <KeyboardShortcuts />
        </div>
      )}
    </Providers>
  );
}
