export interface KeyboardShortcut {
  hotkey: string;
  label: string;
  description: string;
  category: ShortcutCategory;
  scope: 'app' | 'global' | 'both';
  platform?: 'web' | 'desktop' | 'both';
}

export type ShortcutName = keyof typeof KEYBOARD_SHORTCUTS;
export type ShortcutCategory = 'general' | 'navigation' | 'library' | 'cardFocus' | 'filters' | 'mediaStatus';

export const KEYBOARD_SHORTCUTS = {
  // General shortcuts (app-level)
  toggleShortcutsHelp: {
    hotkey: '?',
    label: '?',
    description: 'Show/hide keyboard shortcuts',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },
  toggleSidebar: {
    hotkey: 'ctrl+b',
    label: 'Ctrl+B',
    description: 'Toggle sidebar',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },
  focusSearch: {
    hotkey: '/',
    label: '/',
    description: 'Focus search input',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },
  clearSearch: {
    hotkey: 'ctrl+backspace',
    label: 'Ctrl+Backspace',
    description: 'Clear search input',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },
  escape: {
    hotkey: 'escape',
    label: 'Esc',
    description: 'Close modal / clear focus',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },

  // Navigation shortcuts
  navigate: {
    hotkey: 'up,down,left,right',
    label: '↑ ↓ ← →',
    description: 'Navigate between library cards',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },
  goBack: {
    hotkey: 'alt+left',
    label: 'Alt+←',
    description: 'Go back',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },
  goForward: {
    hotkey: 'alt+right',
    label: 'Alt+→',
    description: 'Go forward',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },

  // Library shortcuts
  openImport: {
    hotkey: 'ctrl+i',
    label: 'Ctrl+I',
    description: 'Open Import modal',
    category: 'library',
    scope: 'app',
    platform: 'both',
  },
  openExport: {
    hotkey: 'ctrl+e',
    label: 'Ctrl+E',
    description: 'Open Export modal',
    category: 'library',
    scope: 'app',
    platform: 'both',
  },
  clearLibrary: {
    hotkey: 'shift+delete',
    label: 'Shift+Delete',
    description: 'Clear entire library',
    category: 'library',
    scope: 'app',
    platform: 'both',
  },

  // Library card focus shortcuts
  openDetails: {
    hotkey: 'enter',
    label: 'Enter',
    description: 'Open details',
    category: 'cardFocus',
    scope: 'app',
    platform: 'both',
  },
  toggleFavorite: {
    hotkey: 'f',
    label: 'F',
    description: 'Mark/unmark as favorite',
    category: 'cardFocus',
    scope: 'app',
    platform: 'both',
  },
  editStatus: {
    hotkey: 'e',
    label: 'E',
    description: 'Edit status or rating',
    category: 'cardFocus',
    scope: 'app',
    platform: 'both',
  },
  addToLibrary: {
    hotkey: 'a',
    label: 'A',
    description: 'Add to library or rate',
    category: 'cardFocus',
    scope: 'app',
    platform: 'both',
  },
  removeFromLibrary: {
    hotkey: 'delete',
    label: 'Delete',
    description: 'Remove from library',
    category: 'cardFocus',
    scope: 'app',
    platform: 'both',
  },

  // Filters shortcuts
  toggleFilters: {
    hotkey: 'alt+f',
    label: 'Alt+F',
    description: 'Show/hide filters',
    category: 'filters',
    scope: 'app',
    platform: 'both',
  },
  filterMovies: {
    hotkey: 'alt+1',
    label: 'Alt+1',
    description: 'Show only Movies',
    category: 'filters',
    scope: 'app',
    platform: 'both',
  },
  filterTvShows: {
    hotkey: 'alt+2',
    label: 'Alt+2',
    description: 'Show only TV shows',
    category: 'filters',
    scope: 'app',
    platform: 'both',
  },
  clearFilters: {
    hotkey: 'alt+0',
    label: 'Alt+0',
    description: 'Clear all filters',
    category: 'filters',
    scope: 'app',
    platform: 'both',
  },
  sortByPopularity: {
    hotkey: 'alt+shift+p',
    label: 'Alt+Shift+P',
    description: 'Sort by popularity',
    category: 'filters',
    scope: 'app',
    platform: 'both',
  },
  sortByRating: {
    hotkey: 'alt+shift+r',
    label: 'Alt+Shift+R',
    description: 'Sort by rating',
    category: 'filters',
    scope: 'app',
    platform: 'both',
  },
  sortByDate: {
    hotkey: 'alt+shift+d',
    label: 'Alt+Shift+D',
    description: 'Sort by date',
    category: 'filters',
    scope: 'app',
    platform: 'both',
  },
  sortByTitle: {
    hotkey: 'alt+shift+t',
    label: 'Alt+Shift+T',
    description: 'Sort by title',
    category: 'filters',
    scope: 'app',
    platform: 'both',
  },

  // Media Status shortcuts (when modal is open)
  setStatusWatching: {
    hotkey: 'alt+w',
    label: 'Alt+W',
    description: 'Set status to "Watching"',
    category: 'mediaStatus',
    scope: 'app',
    platform: 'both',
  },
  setStatusPlanToWatch: {
    hotkey: 'alt+p',
    label: 'Alt+P',
    description: 'Set status to "Plan to Watch"',
    category: 'mediaStatus',
    scope: 'app',
    platform: 'both',
  },
  setStatusWatched: {
    hotkey: 'alt+c',
    label: 'Alt+C',
    description: 'Set status to "Completed"',
    category: 'mediaStatus',
    scope: 'app',
    platform: 'both',
  },
  setStatusOnHold: {
    hotkey: 'alt+h',
    label: 'Alt+H',
    description: 'Set status to "On Hold"',
    category: 'mediaStatus',
    scope: 'app',
    platform: 'both',
  },
  setStatusDropped: {
    hotkey: 'alt+d',
    label: 'Alt+D',
    description: 'Set status to "Dropped"',
    category: 'mediaStatus',
    scope: 'app',
    platform: 'both',
  },
  clearStatus: {
    hotkey: 'delete',
    label: 'Delete',
    description: 'Clear status',
    category: 'mediaStatus',
    scope: 'app',
    platform: 'both',
  },
  rateMedia: {
    hotkey: '1,2,3,4,5,6,7,8,9',
    label: '1-10',
    description: 'Rate (1-10) stars',
    category: 'mediaStatus',
    scope: 'app',
    platform: 'both',
  },
  rateMedia10: {
    hotkey: '1+0',
    label: '1+0',
    description: 'Rate 10 stars',
    category: 'mediaStatus',
    scope: 'app',
    platform: 'both',
  },
  clearRating: {
    hotkey: 'x',
    label: 'X',
    description: 'Clear rating',
    category: 'mediaStatus',
    scope: 'app',
    platform: 'both',
  },

  // NEW GENERAL SHORTCUTS
  toggleCommandPalette: {
    hotkey: 'ctrl+k',
    label: 'Ctrl+K',
    description: 'Command palette',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },
  refreshCurrentView: {
    hotkey: 'r',
    label: 'R',
    description: 'Refresh current view',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },
  playTrailer: {
    hotkey: 'space',
    label: 'Space',
    description: 'Play trailer',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },

  // NEW NAVIGATION SHORTCUTS
  goToHome: {
    hotkey: 'g+h',
    label: 'G then H',
    description: 'Go to Home',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },
  goToLibrary: {
    hotkey: 'g+l',
    label: 'G then L',
    description: 'Go to Library',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },
  goToMovies: {
    hotkey: 'g+m',
    label: 'G then M',
    description: 'Go to Movies',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },
  goToTvShows: {
    hotkey: 'g+t',
    label: 'G then T',
    description: 'Go to TV Shows',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },
  goToSearch: {
    hotkey: 'g+s',
    label: 'G then S',
    description: 'Go to Search',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },
  goToSettings: {
    hotkey: 'ctrl+,',
    label: 'Ctrl+,',
    description: 'Open Settings',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },
  goToPreviousView: {
    hotkey: 'ctrl+[',
    label: 'Ctrl+[',
    description: 'Go to previous view',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },
  goToNextView: {
    hotkey: 'ctrl+]',
    label: 'Ctrl+]',
    description: 'Go to next view',
    category: 'navigation',
    scope: 'app',
    platform: 'both',
  },

  // Global shortcuts (system-wide, desktop only)
  toggleQuickAdd: {
    hotkey: 'ctrl+shift+a',
    label: 'Ctrl+Shift+A',
    description: 'Quick Add (works anywhere)',
    category: 'general',
    scope: 'both',
    platform: 'desktop',
  },
  showHideApp: {
    hotkey: 'ctrl+shift+w',
    label: 'Ctrl+Shift+W',
    description: 'Show/Hide app window',
    category: 'general',
    scope: 'global',
    platform: 'desktop',
  },
} as const;

// Helper functions
export const getAllShortcuts = () => {
  return Object.entries(KEYBOARD_SHORTCUTS).map(([name, shortcut]) => ({
    name: name as ShortcutName,
    ...shortcut,
  }));
};

export const getShortcut = (name: ShortcutName) => {
  const shortcut = KEYBOARD_SHORTCUTS[name];
  if (!shortcut) return null;
  return { name, ...shortcut };
};

export const getShortcutsByCategory = (category: ShortcutCategory) => {
  return getAllShortcuts().filter((shortcut) => shortcut.category === category);
};

// NEW: Get only app-level shortcuts (for React)
export const getAppShortcuts = () => {
  return getAllShortcuts().filter((s) => {
    const scope = s.scope as 'app' | 'global' | 'both';
    return scope === 'app' || scope === 'both';
  });
};

// NEW: Get only global shortcuts (for Tauri)
export const getGlobalShortcuts = () => {
  return getAllShortcuts().filter((s) => {
    const scope = s.scope as 'app' | 'global' | 'both';
    return scope === 'global' || scope === 'both';
  });
};

// Platform-aware shortcut getter
export const getPlatformShortcut = (name: ShortcutName) => {
  return getShortcut(name);
};
