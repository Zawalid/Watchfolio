/**
 * Desktop-specific features for Tauri
 * Includes native menus, system tray, global shortcuts, etc.
 */

import { isDesktop } from '@/lib/platform';

/**
 * Initialize desktop-specific features
 * Call this on app startup when running on desktop
 */
export async function initDesktopFeatures() {
  if (!isDesktop()) return;

  // Desktop features can be initialized here
  // For now, we'll keep it simple and rely on Rust-side initialization
  console.log('Desktop features initialized');
}

/**
 * Desktop capabilities helper
 */
export const desktopFeatures = {
  hasNativeMenu: () => isDesktop(),
  hasSystemTray: () => isDesktop(),
  hasGlobalShortcuts: () => isDesktop(),
  hasFileDialogs: () => isDesktop(),
  hasNotifications: () => isDesktop(),
};
