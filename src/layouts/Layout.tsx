import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, useLocation } from 'react-router';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import { useLayoutEffect } from 'react';
import { LibraryModalProvider } from '@/context/LibraryModal';

const queryClient = new QueryClient();

export default function Layout() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ReactQueryDevtools initialIsOpen={false} />
        <LibraryModalProvider>

        <div className='flex h-full min-h-dvh flex-col'>
          <Navbar />
          <main className='flex-1 container'>
            <Outlet />
          </main>
        </div>
        </LibraryModalProvider>
      </NuqsAdapter>
      <Toaster theme='dark' />
    </QueryClientProvider>
  );
}
