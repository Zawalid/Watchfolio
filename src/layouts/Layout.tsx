import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet } from 'react-router';
import { NuqsAdapter } from 'nuqs/adapters/react'
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ReactQueryDevtools initialIsOpen={false} />
        <div className='flex relative h-full min-h-dvh flex-col'>
          <Navbar />
          <main className='flex-1 container py-4'>
            <Outlet />
          </main>
        </div>
      </NuqsAdapter>
      <Toaster theme='dark' />
    </QueryClientProvider>
  );
}
