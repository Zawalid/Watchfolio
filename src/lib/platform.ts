/**
 * Platform detection utilities for Watchfolio
 * Detects if running on web, desktop (Tauri), or mobile (Tauri iOS/Android)
 */

export type Platform = 'web' | 'desktop' | 'mobile';

/**
 * Check if the app is running in Tauri environment
 */
export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

/**
 * Check if running on desktop (Tauri on Windows, macOS, or Linux)
 */
export function isDesktop(): boolean {
  if (!isTauri()) return false;

  const platform = navigator.platform.toLowerCase();
  return (
    platform.includes('win') ||
    platform.includes('mac') ||
    platform.includes('linux')
  );
}

/**
 * Check if running on mobile (Tauri on iOS or Android)
 */
export function isMobile(): boolean {
  if (!isTauri()) return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('android') || userAgent.includes('iphone') || userAgent.includes('ipad');
}

/**
 * Check if running on web (browser)
 */
export function isWeb(): boolean {
  return !isTauri();
}

/**
 * Get the current platform
 */
export function getPlatform(): Platform {
  if (isMobile()) return 'mobile';
  if (isDesktop()) return 'desktop';
  return 'web';
}

/**
 * Get platform-specific class name for styling
 */
export function getPlatformClass(): string {
  return `platform-${getPlatform()}`;
}

/**
 * Check if running on Windows
 */
export function isWindows(): boolean {
  return navigator.platform.toLowerCase().includes('win');
}

/**
 * Check if running on macOS
 */
export function isMacOS(): boolean {
  return navigator.platform.toLowerCase().includes('mac');
}

/**
 * Check if running on Linux
 */
export function isLinux(): boolean {
  return navigator.platform.toLowerCase().includes('linux');
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('iphone') || userAgent.includes('ipad');
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  return navigator.userAgent.toLowerCase().includes('android');
}

/**
 * Platform capabilities
 */
export const platformCapabilities = {
  hasNativeNotifications: () => isTauri(),
  hasDeepLinking: () => isTauri(),
  hasFileSystemAccess: () => isDesktop(),
  hasSystemTray: () => isDesktop(),
  hasBiometrics: () => isMobile(),
  hasAutoUpdate: () => isDesktop(),
};
