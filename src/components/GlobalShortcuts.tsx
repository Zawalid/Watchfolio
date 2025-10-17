import { useNavigate } from 'react-router';
import { useShortcuts } from '@/hooks/useShortcut';
import { useUIStore } from '@/stores/useUIStore';
import { useFiltersParams } from '@/hooks/useFiltersParams';
import { useClearLibrary } from '@/hooks/library/useLibraryMutations';

/**
 * Global keyboard shortcuts registration
 * Centralized location for all app-wide keyboard shortcuts
 *
 * Note: Some shortcuts like focusSearch/clearSearch remain in local components
 * when they need direct access to component state/refs
 */
export function GlobalShortcuts() {
  const navigate = useNavigate();
  const { selectedTypes, setSelectedTypes, clearAllFilters } = useFiltersParams();
  const { clearLibrary } = useClearLibrary();

  // UI Store actions
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

    // Library
    { name: 'clearLibrary', handler: clearLibrary },

    // Navigation - Browser history
    { name: 'goBack', handler: () => navigate(-1) },
    { name: 'goForward', handler: () => navigate(1) },

    // Navigation - Routes
    { name: 'goToHome', handler: () => navigate('/home') },
    { name: 'goToLibrary', handler: () => navigate('/library/all') },
    { name: 'goToMovies', handler: () => navigate('/movies') },
    { name: 'goToTvShows', handler: () => navigate('/tv-shows') },
    { name: 'goToSettings', handler: () => navigate('/settings/preferences') },

    // Global escape
    { name: 'escape', handler: closeAllModals },
  ]);

  return null;
}
