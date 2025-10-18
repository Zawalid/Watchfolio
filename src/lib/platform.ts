/**
 * Platform detection utilities for Watchfolio
 * Detects if running on web, desktop (Tauri), or mobile (Tauri iOS/Android)
 */

import { getCurrentWindow } from '@tauri-apps/api/window';

export type Platform = 'web' | 'desktop' | 'mobile';

/**
 * Check if the app is running in Tauri environment
 */
export function isTauri(): boolean {
  if (typeof window === 'undefined') return false;

  // Tauri v2 uses __TAURI_INTERNALS__
  return '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
}

/**
 * Check if running on desktop (Tauri on Windows, macOS, or Linux)
 */
export function isDesktop(): boolean {
  if (!isTauri()) return false;

  const platform = navigator.platform.toLowerCase();
  return platform.includes('win') || platform.includes('mac') || platform.includes('linux');
}

/**
 * Check if running on mobile (Tauri on iOS or Android)
 */
export function isMobile(): boolean {
  if (!isTauri()) return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('android') || userAgent.includes('iphone') || userAgent.includes('ipad');
}

export function getWindowLabel() {
  if (!isTauri()) return null;
  
  return getCurrentWindow().label;
}
