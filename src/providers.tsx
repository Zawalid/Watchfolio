import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/react';
import {
  MediaStatusModalProvider,
  ConfirmationModalProvider,
  NavigationProvider,
  AnimationProvider,
} from '@/contexts/providers';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useHref, useNavigate } from 'react-router';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <AnimationProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <HeroUIProvider navigate={navigate} useHref={useHref}>
              <ToastProvider
                placement='top-right'
                toastOffset={60}
                toastProps={{
                  classNames: { base: 'bg-blur backdrop-blur-sm border border-white/10', closeButton: 'hidden' },
                }}
              />
              <ReactQueryDevtools initialIsOpen={false} />
              <MediaStatusModalProvider>
                <NavigationProvider>
                  <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
                </NavigationProvider>
              </MediaStatusModalProvider>
            </HeroUIProvider>
          </NuqsAdapter>
        </QueryClientProvider>
      </ErrorBoundary>
    </AnimationProvider>
  );
}
