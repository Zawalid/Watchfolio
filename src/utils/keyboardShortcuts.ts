export interface KeyboardShortcut {
  hotkey: string;
  label: string;
  description: string;
  category: ShortcutCategory;
}

export type ShortcutName = keyof typeof KEYBOARD_SHORTCUTS;
export type ShortcutCategory = 'general' | 'library' | 'cardFocus' | 'filters' | 'mediaStatus';

export const KEYBOARD_SHORTCUTS = {
  // General shortcuts
  toggleShortcutsHelp: { hotkey: '?', label: '?', description: 'Show/hide keyboard shortcuts', category: 'general' },
  toggleSidebar: { hotkey: 'ctrl+b', label: 'Ctrl B', description: 'Toggle sidebar', category: 'general' },
  focusSearch: { hotkey: '/', label: '/', description: 'Focus search input', category: 'general' },
  clearSearch: {
    hotkey: 'ctrl+backspace',
    label: 'Ctrl Backspace',
    description: 'Clear search input',
    category: 'general',
  },
  escape: { hotkey: 'escape', label: 'Esc', description: 'Close modal / clear focus', category: 'general' },

  navigate: {
    hotkey: 'up,down,left,right',
    label: '↑ ↓ ← →',
    description: 'Navigate between library cards',
    category: 'general',
  },
  goBack: { hotkey: 'alt+left', label: 'Alt ←', description: 'Go back', category: 'general' },
  goForward: { hotkey: 'alt+right', label: 'Alt →', description: 'Go forward', category: 'general' },

  // library
  toggleImportExport: {
    hotkey: 'ctrl+i',
    label: 'Ctrl I',
    description: 'Open Import/Export modal',
    category: 'library',
  },
  clearLibrary: {
    hotkey: 'shift+delete',
    label: 'Shift Delete',
    description: 'Clear entire library',
    category: 'library',
  },

  // Library card focus shortcuts
  openDetails: {
    hotkey: 'enter',
    label: 'Enter',
    description: 'Open details',
    category: 'cardFocus',
  },
  toggleFavorite: {
    hotkey: 'f',
    label: 'F',
    description: 'Mark/unmark as favorite',
    category: 'cardFocus',
  },
  editStatus: { hotkey: 'e', label: 'E', description: 'Edit status or rating', category: 'cardFocus' },
  addToLibrary: { hotkey: 'a', label: 'A', description: 'Add to library or rate', category: 'cardFocus' },

  removeFromLibrary: {
    hotkey: 'delete',
    label: 'Delete',
    description: 'Remove from library',
    category: 'cardFocus',
  },

  // Filters shortcuts
  toggleFilters: {
    hotkey: 'alt+f',
    label: 'Alt F',
    description: 'Show/hide filters',
    category: 'filters',
  },
  filterMovies: { hotkey: 'alt+1', label: 'Alt 1', description: 'Show only Movies', category: 'filters' },
  filterTvShows: { hotkey: 'alt+2', label: 'Alt 2', description: 'Show only TV shows', category: 'filters' },
  // filterAnime: { hotkey: 'alt+3', label: 'Alt 3', description: 'Show only Anime', category: 'filters' },
  clearFilters: { hotkey: 'alt+0', label: 'Alt 0', description: 'Clear all filters', category: 'filters' },
  sortByPopularity: {
    hotkey: 'alt+shift+p',
    label: 'Alt Shift P',
    description: 'Sort by popularity',
    category: 'filters',
  },
  sortByRating: { hotkey: 'alt+shift+r', label: 'Alt Shift R', description: 'Sort by rating', category: 'filters' },
  sortByDate: { hotkey: 'alt+shift+d', label: 'Alt Shift D', description: 'Sort by date', category: 'filters' },
  sortByTitle: { hotkey: 'alt+shift+t', label: 'Alt Shift T', description: 'Sort by title', category: 'filters' },

  // Modal shortcuts (when library modal is open)
  setStatusWatching: {
    hotkey: 'alt+w',
    label: 'Alt W',
    description: 'Set status to "Watching"',
    category: 'mediaStatus',
  },
  setStatusPlanToWatch: {
    hotkey: 'alt+p',
    label: 'Alt P',
    description: 'Set status to "Plan to Watch"',
    category: 'mediaStatus',
  },
  setStatusWatched: {
    hotkey: 'alt+c',
    label: 'Alt C',
    description: 'Set status to "Completed"',
    category: 'mediaStatus',
  },
  setStatusOnHold: { hotkey: 'alt+h', label: 'Alt H', description: 'Set status to "On Hold"', category: 'mediaStatus' },
  setStatusDropped: {
    hotkey: 'alt+d',
    label: 'Alt D',
    description: 'Set status to "Dropped"',
    category: 'mediaStatus',
  },
  clearStatus: {
    hotkey: 'delete',
    label: 'Delete',
    description: 'Clear status',
    category: 'mediaStatus',
  },
  rateMedia: {
    hotkey: '1,2,3,4,5,6,7,8,9',
    label: '1-10',
    description: 'Rate (1-10) stars',
    category: 'mediaStatus',
  },
  rateMedia10: { hotkey: '1+0', label: null, description: null, category: null },
  clearRating: { hotkey: 'x', label: 'X', description: 'Clear rating', category: 'mediaStatus' },
} as const;

export const getAllShortcuts = () => {
  return Object.entries(KEYBOARD_SHORTCUTS).map(([name, shortcut]) => ({ name: name as ShortcutName, ...shortcut }));
};

export const getShortcut = (name: ShortcutName) => {
  const shortcut = KEYBOARD_SHORTCUTS[name];
  if (!shortcut) return null;
  return { name, ...shortcut };
};

export const getShortcutsByCategory = (category: ShortcutCategory) => {
  return getAllShortcuts().filter((shortcut) => shortcut.category === category);
};
