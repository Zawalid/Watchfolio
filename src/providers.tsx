import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { Toaster } from 'sonner';
import { LibraryModalProvider } from '@/contexts/LibraryModalContext';
import { ConfirmationModalProvider } from '@/contexts/ConfirmationModalContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ReactQueryDevtools initialIsOpen={false} />
        <LibraryModalProvider>
          <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
        </LibraryModalProvider>
      </NuqsAdapter>
      <Toaster theme='dark' />
    </QueryClientProvider>
  );
}
