import { useDesktopIntegration } from '@/hooks/useDesktopIntegration';
import { DesktopBehavior } from '@/components/desktop/DesktopBehavior';

/**
 * Provider for desktop-specific features
 * Handles menu events, tray events, shortcuts, and window behavior
 */
export function DesktopProvider({ children }: { children: React.ReactNode }) {
  // Set up desktop integration (menu, tray, shortcuts)
  useDesktopIntegration();

  return (
    <>
      <DesktopBehavior />
      {children}
    </>
  );
}
