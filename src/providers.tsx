import {  QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';
import {
  MediaStatusModalProvider,
  ConfirmationModalProvider,
  NavigationProvider,
  AnimationProvider,
} from '@/contexts/providers';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useHref, useNavigate } from 'react-router';
import { queryClient } from '@/lib/react-query';


export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <AnimationProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <NuqsAdapter>
              <ToastProvider
                placement='top-right'
                toastOffset={60}
                toastProps={{
                  classNames: { base: 'bg-blur backdrop-blur-sm border border-white/10', closeButton: 'hidden' },
                  timeout: 3000,
                  shouldShowTimeoutProgress: true,
                }}
              />
              <ReactQueryDevtools initialIsOpen={false} />
              <NavigationProvider>
                <MediaStatusModalProvider>
                  <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
                </MediaStatusModalProvider>
              </NavigationProvider>
            </NuqsAdapter>
          </QueryClientProvider>
        </ErrorBoundary>
      </AnimationProvider>
    </HeroUIProvider>
  );
}
