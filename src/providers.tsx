import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { Toaster } from 'sonner';
import { LibraryModalProvider } from '@/context/LibraryModalProvider';
import { ConfirmationModalProvider } from '@/context/ConfirmationModalProvider';

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
