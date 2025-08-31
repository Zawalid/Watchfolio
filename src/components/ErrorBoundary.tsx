import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ErrorScreen } from '@/components/ui/ErrorScreen';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorScreen}
      onError={(error, errorInfo) => {
        // Log error to console in development
        if (import.meta.env.DEV) {
          console.group('🚨 Error Boundary Caught An Error');
          log('ERR', 'Error:', error);
          log('ERR', 'Error Info:', errorInfo);
          console.groupEnd();
        }

        // TODO: Send error to your error reporting service (e.g., Sentry, LogRocket)
        // Example: errorReportingService.captureException(error, { extra: errorInfo });
      }}
      onReset={() => {
        // Optional: Clear any state that might have caused the error
        window.location.hash = '';
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
