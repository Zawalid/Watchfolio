import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DesktopActionsContext } from '../DesktopActionsContext';
import { useSyncStore } from '@/stores/useSyncStore';
import { useUpdater } from '@/hooks/desktop/useUpdater';
import { UpdateNotification } from '@/components/desktop/UpdateNotification';
import { isDesktop } from '@/lib/platform';
import { useUIStore } from '@/stores/useUIStore';

/**
 * Provider for desktop actions
 * Makes modals and actions accessible from anywhere in the app
 */
export function DesktopActionsProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const { startSync } = useSyncStore();
  const updater = useUpdater();
  const openImportExportModal = useUIStore((state) => state.openImportExport);
  const openAboutModal = useUIStore((state) => state.openAbout);
  const openShortcutsModal = useUIStore((state) => state.openShortcuts);
  const openQuickAddModal = useUIStore((state) => state.openQuickAdd);

  const openImportExport = useCallback(() => {
    // Navigate to library if not there
    if (!window.location.pathname.startsWith('/library')) {
      navigate('/library');
    }
    openImportExportModal();
  }, [navigate, openImportExportModal]);

  const openAbout = useCallback(() => {
    openAboutModal();
  }, [openAboutModal]);

  const openKeyboardShortcuts = useCallback(() => {
    openShortcutsModal();
  }, [openShortcutsModal]);

  const quickAdd = useCallback(() => {
    openQuickAddModal();
  }, [openQuickAddModal]);

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

  const triggerSync = useCallback(() => {
    startSync();
  }, [startSync]);

  const checkForUpdates = useCallback(() => {
    updater.checkForUpdates();
  }, [updater]);

  // Listen to Tauri menu events
  useEffect(() => {
    if (!isDesktop()) return;

    const setupTauriListeners = async () => {
      const { listen } = await import('@tauri-apps/api/event');

      const unlisten = await Promise.all([
        listen('menu:quick-add', () => quickAdd()),
        listen('menu:import', () => openImportExport()),
        listen('menu:export', () => openImportExport()),
        listen('menu:preferences', () => navigate('/settings/preferences')),
        listen('menu:keyboard-shortcuts', () => openKeyboardShortcuts()),
        listen('menu:check-updates', () => checkForUpdates()),
      ]);

      return () => {
        unlisten.forEach(fn => fn());
      };
    };

    setupTauriListeners();
  }, [quickAdd, openImportExport, navigate, openKeyboardShortcuts, checkForUpdates]);

  return (
    <DesktopActionsContext.Provider
      value={{
        openImportExport,
        openAbout,
        openKeyboardShortcuts,
        quickAdd,
        quickSearch,
        triggerSync,
        checkForUpdates,
      }}
    >
      {children}

      {/* Update notification */}
      <UpdateNotification updater={updater} />
    </DesktopActionsContext.Provider>
  );
}
