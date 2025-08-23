import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getQueryString = (params: Record<string, string>): string => {
  const cleaned: Record<string, string> = {};
  for (const key in params) {
    if (params[key]) cleaned[key] = params[key];
  }
  const query = new URLSearchParams(cleaned).toString();
  return query ? `?${query}` : '';
};

export const slugify = (text: string, options: { reverse?: boolean; reverseType?: 'camelCase' | 'spaced' } = {}) => {
  const { reverse = false, reverseType = 'spaced' } = options;

  if (!text) return '';

  if (reverse) {
    const words = text.split('-');

    if (reverseType === 'camelCase') {
      return words
        .map((word, index) =>
          index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
    }

    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

export function getUrl() {
  const host =
    process.env.NODE_ENV === 'development'
      ? 'localhost:3000'
      : process.env.VERCEL_ENV === 'production'
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL
        : process.env.VERCEL_BRANCH_URL;

  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  return `${protocol}://${host}`;
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Unknown date';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return 'Invalid date';
  }
}

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (seconds < 10) {
    return 'just now';
  }
  if (seconds < minute) {
    return rtf.format(-seconds, 'second');
  }
  if (seconds < hour) {
    return rtf.format(-Math.floor(seconds / minute), 'minute');
  }
  if (seconds < day) {
    return rtf.format(-Math.floor(seconds / hour), 'hour');
  }
  if (seconds < week) {
    return rtf.format(-Math.floor(seconds / day), 'day');
  }
  // If older than a week, show the actual date
  if (now.getFullYear() === date.getFullYear()) {
    // If it's the same year, omit the year for clarity
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  // If it's a different year, include the year
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};


// ========== Object Utilities ==========

/**
 * Performs a deep equality check between two values.
 * Supports primitives, arrays, objects, dates, and handles edge cases.
 * Does not support functions or circular references.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns boolean indicating if the values are deeply equal
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  // Handle null and undefined
  if (a == null || b == null) return a === b;

  // Handle Date objects
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Handle objects (but not arrays or null)
  if (typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) return false;
    }
    return true;
  }

  // Fallback for all other cases (including functions)
  return false;
}


export const renameObjectProperty = <T extends object, K extends keyof T>(
  obj: T,
  oldKey: K,
  newKey: string
): Omit<T, K> & { [key: string]: unknown } => {
  const { [oldKey]: value, ...rest } = obj;
  return { ...rest, [newKey]: value };
};

export const filterObject = <T>(
  obj: T,
  keys: (keyof T)[],
  keysType: "include" | "exclude"
): T => {
  const filtered: T = {} as T;
  for (const key in obj) {
    if (keysType === "include" && keys.includes(key)) filtered[key] = obj[key];
    if (keysType === "exclude" && !keys.includes(key)) filtered[key] = obj[key];
  }
  return filtered;
};