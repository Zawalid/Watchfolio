import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { ToastProvider } from '@heroui/toast';
import { MediaStatusModalProvider, ConfirmationModalProvider } from '@/contexts/providers';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ToastProvider
          placement='top-right'
          toastOffset={40}
          toastProps={{ classNames: { base: 'bg-blur backdrop-blur-sm border border-white/10' } }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
        <MediaStatusModalProvider>
          <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
        </MediaStatusModalProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
