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

export function formatDistanceToNow(date: Date, { addSuffix = false }: { addSuffix?: boolean } = {}) {
  const now = new Date();
  const diff = Math.max(0, now.getTime() - date.getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

  let result = '';
  if (years > 0) result = `${years} year${years > 1 ? 's' : ''}`;
  else if (months > 0) result = `${months} month${months > 1 ? 's' : ''}`;
  else if (days > 0) result = `${days} day${days > 1 ? 's' : ''}`;
  else if (hours > 0) result = `${hours} hour${hours > 1 ? 's' : ''}`;
  else if (minutes > 0) result = `${minutes} minute${minutes > 1 ? 's' : ''}`;
  else result = `${seconds} second${seconds !== 1 ? 's' : ''}`;

  if (seconds === 0) return 'Just now';
  
  if (addSuffix) result += date < now ? ' ago' : ' from now';

  return result;
}
