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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    clearTimeout(timeoutId);
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => resolve(fn(...args)), delay);
    });
  };
};
