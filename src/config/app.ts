import { CreateUserPreferencesInput } from '@/lib/appwrite/types';

/**
 * Application Configuration
 * Central location for app-wide settings, limits, and defaults
 */

// ============================================
// Storage & Caching
// ============================================

/** Prefix for all localStorage keys to avoid conflicts */
export const LOCAL_STORAGE_PREFIX = 'watchfolio-';

// ============================================
// Library & Sync Configuration
// ============================================

/** Maximum file size for library imports (10 MB) */
export const LIBRARY_IMPORT_MAX_SIZE = 10 * 1024 * 1024;

/**
 * Debounce time for batching sync operations (60 seconds)
 * Balances network efficiency with data safety
 */
export const LIBRARY_SYNC_DEBOUNCE_MS = 60000;

/**
 * Periodic safety flush interval (60 seconds)
 * Ensures data is synced even during continuous editing
 */
export const LIBRARY_SYNC_SAFETY_FLUSH_INTERVAL_MS = 60000;

// ============================================
// Pagination & Limits
// ============================================

/** Number of items displayed per page in lists */
export const ITEMS_PER_PAGE = 20;

/** Maximum number of pages TMDB API allows */
export const MAX_TMDB_PAGES = 500;

/** Maximum number of favorite genres a user can select */
export const FAVORITE_GENRES_LIMIT = 5;

/** Maximum number of favorite networks a user can select */
export const FAVORITE_NETWORKS_LIMIT = 5;

// ============================================
// User Preferences Defaults
// ============================================

/** Default preferences for new users */
export const DEFAULT_USER_PREFERENCES: CreateUserPreferencesInput = {
  signOutConfirmation: 'enabled',
  removeFromLibraryConfirmation: 'enabled',
  clearLibraryConfirmation: 'enabled',
  enableAnimations: 'enabled',
  defaultMediaStatus: 'none',
  theme: 'system',
  language: 'en',
  autoSync: true,
};

// ============================================
// Profile Visibility
// ============================================

/** Profile sections that can be hidden from public view */
export const HIDDEN_PROFILE_SECTIONS = [
  'stats',
  'stats.statistics',
  'stats.overview',
  'stats.topGenres',
  'stats.recentActivity',
  'taste',
  'library',
  'library.watching',
  'library.completed',
  'library.willWatch',
  'library.onHold',
  'library.dropped',
  'library.favorites',
] as const;
