import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from '@/components/Navbar';
import { Providers } from '@/providers';


export default function Layout() {
  const location = useLocation();

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
      </div>
    </Providers>
  );
}
