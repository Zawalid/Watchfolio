import { useLayoutEffect, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Providers } from '@/providers';
import { useLibrarySync } from '@/hooks/useLibrarySync';
import { useInitialAuth } from '@/hooks/useInitialAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import AuthModal from '@/components/auth/AuthModal';
import Navbar from '@/components/Navbar';
import { ResponsiveScreen } from '@/components/ui/ResponsiveScreen';
import Footer from '@/components/Footer';

export default function Layout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useInitialAuth();
  useLibrarySync();
  useOnboarding();

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
          <main className='container flex-1 mx-auto px-4 pb-10 pt-16 md:pt-20 lg:px-6 lg:pt-24 min-h-screen'>
            <Outlet />
          </main>
          <Footer />
          <OnboardingModal />
          <AuthModal />
        </div>
      )}
    </Providers>
  );
}
