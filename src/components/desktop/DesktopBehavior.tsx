import { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { isDesktop } from '@/lib/platform';

/**
 * Component to handle desktop-specific window behavior
 * - Minimize to tray on close
 * - Window state management
 * - Platform-specific UI adjustments
 */
export function DesktopBehavior() {
  useEffect(() => {
    if (!isDesktop()) return;

    const setupWindowBehavior = async () => {
      const window = getCurrentWindow();

      // Minimize to tray instead of closing (can be made configurable)
      const unlisten = await window.onCloseRequested(async (event) => {
        // Prevent default close behavior
        event.preventDefault();

        // Hide window to tray
        await window.hide();
      });

      return unlisten;
    };

    let cleanup: (() => void) | undefined;
    setupWindowBehavior().then((unlisten) => {
      cleanup = unlisten;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // This component doesn't render anything
  return null;
}
