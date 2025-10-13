import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Providers } from '@/providers';
import { useInitialAuth } from '@/hooks/useInitialAuth';
import OnboardingModal from '@/components/modals/OnboardingModal';
import AuthModal from '@/components/modals/AuthModal';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import KeyboardShortcuts from '@/components/library/KeyboardShortcuts';
import BottomNavBar from '@/components/navbar/BottomNavBar';
import { isDesktop } from '@/lib/platform';
import { cn } from '@/utils';

export default function Layout() {
  const location = useLocation();
  
  useInitialAuth();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Providers>
      <div className={cn('flex h-full min-h-dvh flex-col pb-21 md:pb-0', isDesktop() && 'pt-14')}>
        <Navbar />
        <main
          className='xs:px-6 container mx-auto min-h-screen flex-1 px-3 pt-22 pb-10 max-lg:max-w-screen'
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
