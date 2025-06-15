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

export const LIBRARY_MEDIA_STATUS = [
  {
    value: 'watching',
    label: 'Currently Watching',
    descriptions: {
      modal: 'Currently enjoying this one.',
      stats: 'In progress',
    },
    icon: MonitorPlay,
    className: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    shortcut: 'setStatusWatching',
  },
  {
    value: 'willWatch',
    label: 'Plan to Watch',
    descriptions: {
      modal: 'On your watchlist for later.',
      stats: 'Saved for later',
    },
    icon: Bookmark,
    className: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    shortcut: 'setStatusPlanToWatch',
  },
  {
    value: 'watched',
    label: 'Watched',
    descriptions: {
      modal: 'Finished watching this.',
      stats: 'Completed',
    },
    icon: MonitorCheck,
    className: 'text-green-400 bg-green-500/20 border-green-500/30',
    shortcut: 'setStatusWatched',
  },
  {
    value: 'onHold',
    label: 'On Hold',
    descriptions: {
      modal: 'Paused but planning to continue.',
      stats: 'Temporarily paused',
    },
    icon: MonitorPause,
    className: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    shortcut: 'setStatusOnHold',
  },
  {
    value: 'dropped',
    label: 'Dropped',
    descriptions: {
      modal: 'Decided not to continue watching.',
      stats: 'Abandoned',
    },
    icon: MonitorX,
    className: 'text-red-400 bg-red-500/20 border-red-500/30',
    shortcut: 'setStatusDropped',
  },
  {
    value: 'favorites',
    label: 'Favorites',
    descriptions: {
      modal: 'One of your absolute favorites.',
      stats: 'Top picks',
    },
    icon: Heart,
    className: 'text-pink-400 bg-pink-500/20 border-pink-500/30',
    shortcut: 'setStatusFavorite',
  },
] as const;



export const LIBRARY_IMPORT_MAX_SIZE = 10 * 1024 * 1024 ; // 10 MB