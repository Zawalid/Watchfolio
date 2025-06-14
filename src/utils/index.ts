import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
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

export const actionToast = async (
  action: () => Promise<unknown>,
  loadingMessage: string,
  successMessage: string,
  errorMessage?: string
) => {
  let id;
  try {
    id = toast.loading(loadingMessage);
    await action();
    toast.success(successMessage, { id });
  } catch (error) {
    console.log('error', error);
    if (errorMessage) toast.error(errorMessage, { id });
  }
};

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
