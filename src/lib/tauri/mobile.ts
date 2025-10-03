/**
 * Mobile-specific features for Tauri (iOS and Android)
 * Includes mobile gestures, native features, etc.
 */

import { isMobile } from '@/lib/platform';

/**
 * Initialize mobile-specific features
 * Call this on app startup when running on mobile
 */
export async function initMobileFeatures() {
  if (!isMobile()) return;

  // Mobile features initialization
  console.log('Mobile features initialized');
}

/**
 * Mobile capabilities helper
 */
export const mobileFeatures = {
  hasBiometrics: () => isMobile(),
  hasHaptics: () => isMobile(),
  hasShareSheet: () => isMobile(),
  hasCameraAccess: () => isMobile(),
};

/**
 * Trigger haptic feedback (mobile only)
 */
export async function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (!isMobile()) return;

  // Haptic feedback implementation would go here
  // For now, use web vibration API as fallback
  if ('vibrate' in navigator) {
    const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
    navigator.vibrate(duration);
  }
}
