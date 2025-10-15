import { useNavigate } from 'react-router';
import { useShortcuts } from '@/hooks/useShortcut';
import { useUIStore } from '@/stores/useUIStore';
import { useFiltersParams } from '@/hooks/useFiltersParams';

/**
 * Global keyboard shortcuts registration
 * Centralized location for all app-wide keyboard shortcuts
 */
export function GlobalShortcuts() {
  const navigate = useNavigate();
  const { selectedTypes, setSelectedTypes, clearAllFilters } = useFiltersParams();

  // UI Store actions
  const focusSearch = useUIStore((state) => state.focusSearch);
  const blurSearch = useUIStore((state) => state.blurSearch);
  const toggleFilters = useUIStore((state) => state.toggleFilters);
  const toggleImportExport = useUIStore((state) => state.toggleImportExport);
  const toggleShortcuts = useUIStore((state) => state.toggleShortcuts);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleCommandPalette = useUIStore((state) => state.toggleCommandPalette);
  const closeAllModals = useUIStore((state) => state.closeAllModals);

  // Helper: Toggle media type filter
  const toggleMediaTypeFilter = (type: 'movie' | 'tv') => {
    const current = selectedTypes || [];

    if (current.length && current.length === 1) {
      setSelectedTypes(current.includes(type) ? null : [type]);
    } else {
      setSelectedTypes(current.includes(type) ? current.filter((t) => t !== type) : [...current, type]);
    }
  };

  useShortcuts([
    // Search
    { name: 'focusSearch', handler: focusSearch },
    { name: 'clearSearch', handler: blurSearch },

    // Modals
    { name: 'toggleShortcutsHelp', handler: toggleShortcuts },
    { name: 'toggleImportExport', handler: toggleImportExport },
    { name: 'toggleFilters', handler: toggleFilters },

    // Sidebar & Command Palette
    { name: 'toggleSidebar', handler: toggleSidebar },
    { name: 'toggleCommandPalette', handler: toggleCommandPalette },

    // Filters
    { name: 'filterMovies', handler: () => toggleMediaTypeFilter('movie') },
    { name: 'filterTvShows', handler: () => toggleMediaTypeFilter('tv') },
    { name: 'clearFilters', handler: clearAllFilters },

    // Navigation
    { name: 'goBack', handler: () => navigate(-1) },
    { name: 'goForward', handler: () => navigate(1) },

    // Global escape
    { name: 'escape', handler: closeAllModals },
  ]);

  return null;
}
