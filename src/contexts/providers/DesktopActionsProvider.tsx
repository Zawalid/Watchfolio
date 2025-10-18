import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DesktopActionsContext } from '../DesktopActionsContext';
import { useSyncStore } from '@/stores/useSyncStore';
import { useUpdater } from '@/hooks/desktop/useUpdater';
import { UpdateNotification } from '@/components/desktop/UpdateNotification';
import { isDesktop } from '@/lib/platform';
import { useUIStore } from '@/stores/useUIStore';
import { useClearLibrary } from '@/hooks/library/useLibraryMutations';

/**
 * Provider for desktop actions
 * Makes modals and actions accessible from anywhere in the app
 */
export function DesktopActionsProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  // Direct store/hook access
  const { startSync } = useSyncStore();
  const updater = useUpdater();
  const { clearLibrary } = useClearLibrary();
  const openQuickAdd = useUIStore((state) => state.openQuickAdd);
  const openShortcuts = useUIStore((state) => state.openShortcuts);
  const openAbout = useUIStore((state) => state.openAbout);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleFilters = useUIStore((state) => state.toggleFilters);
  const openImportExportModal = useUIStore((state) => state.openImportExport);

  // Only create wrappers when there's actual additional logic
  const openImportExport = useCallback((tab?: 'import' | 'export') => {
    // Navigate to library if not there
    if (!window.location.pathname.startsWith('/library')) {
      navigate('/library');
    }
    openImportExportModal(tab);
  }, [navigate, openImportExportModal]);

  const quickSearch = useCallback(() => {
    // Navigate to search and focus input
    navigate('/movies');
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }, [navigate]);

  const checkForUpdates = useCallback(() => {
    updater.checkForUpdates();
  }, [updater]);

  // Listen to Tauri menu events
  useEffect(() => {
    if (!isDesktop()) return;

    const setupTauriListeners = async () => {
      const { listen } = await import('@tauri-apps/api/event');
      type Event<T> = { payload: T };

      const unlisten = await Promise.all([
        // File menu
        listen('menu:quick-add', openQuickAdd),
        listen<string>('menu:import-export', (event: Event<string>) =>
          openImportExport(event.payload as 'import' | 'export')
        ),
        listen('menu:sync', startSync),
        listen('menu:preferences', () => navigate('/settings/preferences')),

        // View menu
        listen('menu:toggle-sidebar', toggleSidebar),
        listen('menu:toggle-filters', toggleFilters),

        // Library menu
        listen<string>('menu:navigate', (event: Event<string>) => navigate(event.payload)),
        listen('menu:library-stats', () => navigate('/u/stats')),
        listen('menu:library-clear', clearLibrary),

        // Go menu
        listen('menu:go-back', () => navigate(-1)),
        listen('menu:go-forward', () => navigate(1)),

        // Help menu
        listen('menu:keyboard-shortcuts', openShortcuts),
        listen('menu:check-updates', checkForUpdates),
        listen('menu:about', openAbout),

        // Tray menu events
        listen('tray:quick-add', openQuickAdd),
        listen('tray:search', quickSearch),
        listen<string>('tray:navigate', (event: Event<string>) => navigate(event.payload)),
        listen('tray:sync-now', startSync),
        // Note: tray:quick-status is not handled yet - would need media selection context

        // Global keyboard shortcuts (from shortcuts.rs)
        listen('shortcut:quick-add', openQuickAdd),
      ]);

      return () => {
        unlisten.forEach(fn => fn());
      };
    };

    setupTauriListeners();
  }, [
    openQuickAdd,
    openImportExport,
    startSync,
    navigate,
    openShortcuts,
    checkForUpdates,
    openAbout,
    toggleSidebar,
    toggleFilters,
    clearLibrary,
    quickSearch,
  ]);

  return (
    <DesktopActionsContext.Provider
      value={{
        openImportExport,
        openAbout,
        openKeyboardShortcuts: openShortcuts,
        quickAdd: openQuickAdd,
        quickSearch,
        toggleSidebar,
        toggleFilters,
        clearLibrary,
        triggerSync: startSync,
        checkForUpdates,
      }}
    >
      {children}

      {/* Update notification */}
      <UpdateNotification updater={updater} />
    </DesktopActionsContext.Provider>
  );
}
