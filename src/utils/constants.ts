import { MonitorPlay, Bookmark, MonitorCheck, MonitorPause, MonitorX, Heart } from 'lucide-react';

export const RATING_LABELS = {
  1: 'Terrible',
  2: 'Poor',
  3: 'Below Average',
  4: 'Disappointing',
  5: 'Average',
  6: 'Good',
  7: 'Very Good',
  8: 'Great',
  9: 'Excellent',
  10: 'Masterpiece',
} as const;

export const USER_MEDIA_STATUS = [
  {
    value: 'watching',
    label: 'Currently Watching',
    description: 'Track your progress',
    icon: MonitorPlay,
    className: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  },
  {
    value: 'willWatch',
    label: 'Plan to Watch',
    description: 'Add to your watchlist',
    icon: Bookmark,
    className: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
  },
  {
    value: 'watched',
    label: 'Watched',
    description: 'Mark as finished',
    icon: MonitorCheck,
    className: 'text-green-400 bg-green-500/20 border-green-500/30',
  },
  {
    value: 'onHold',
    label: 'On Hold',
    description: 'Taking a break',
    icon: MonitorPause,
    className: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  },
  {
    value: 'dropped',
    label: 'Dropped',
    description: 'Not for you',
    icon: MonitorX,
    className: 'text-red-400 bg-red-500/20 border-red-500/30',
  },
  {
    value: 'favorites',
    label: 'Favorites',
    description: 'Your top picks',
    icon: Heart,
    className: 'text-red-400 bg-red-500/20 border-red-500/30',
  },
] as const;
