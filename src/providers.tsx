import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { ToastProvider } from '@heroui/toast';
import {
  MediaStatusModalProvider,
  ConfirmationModalProvider,
  NavigationProvider,
  AnimationProvider,
} from '@/contexts/providers';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnimationProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <ToastProvider
              placement='top-right'
              toastOffset={60}
              toastProps={{ classNames: { base: 'bg-blur backdrop-blur-sm border border-white/10' } }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
            <MediaStatusModalProvider>
              <NavigationProvider>
                <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
              </NavigationProvider>
            </MediaStatusModalProvider>
          </NuqsAdapter>
        </QueryClientProvider>
      </ErrorBoundary>
    </AnimationProvider>
  );
}
