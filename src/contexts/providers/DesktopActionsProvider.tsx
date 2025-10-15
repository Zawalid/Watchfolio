import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDisclosure } from '@heroui/react';
import { DesktopActionsContext } from '../DesktopActionsContext';
import ImportExportModal from '@/components/modals/ImportExportModal';
import { AboutModal } from '@/components/modals/AboutModal';
import QuickAddModal from '@/components/modals/QuickAddModal';
import { useSyncStore } from '@/stores/useSyncStore';
import { useUpdater } from '@/hooks/desktop/useUpdater';
import { UpdateNotification } from '@/components/desktop/UpdateNotification';
import KeyboardShortcuts from '@/components/library/KeyboardShortcuts';
import { isDesktop } from '@/lib/platform';
import { useShortcut } from '@/hooks/useShortcut';

/**
 * Provider for desktop actions
 * Makes modals and actions accessible from anywhere in the app
 */
export function DesktopActionsProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const importExportDisclosure = useDisclosure();
  const aboutDisclosure = useDisclosure();
  const keyboardShortcutsDisclosure = useDisclosure();
  const quickAddDisclosure = useDisclosure();

  const { startSync } = useSyncStore();
  const updater = useUpdater();

  const openImportExport = useCallback(() => {
    // Navigate to library if not there
    if (!window.location.pathname.startsWith('/library')) {
      navigate('/library');
    }
    importExportDisclosure.onOpen();
  }, [navigate, importExportDisclosure]);

  const openAbout = useCallback(() => {
    aboutDisclosure.onOpen();
  }, [aboutDisclosure]);

  const openKeyboardShortcuts = useCallback(() => {
    keyboardShortcutsDisclosure.onOpen();
  }, [keyboardShortcutsDisclosure]);

  const quickAdd = useCallback(() => {
    quickAddDisclosure.onOpen();
  }, [quickAddDisclosure]);

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

  // Keyboard shortcuts - Available on all platforms
  useShortcut('toggleCommandPalette', quickSearch);

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

      {/* Global modals */}
      <QuickAddModal disclosure={quickAddDisclosure} />
      <ImportExportModal disclosure={importExportDisclosure} />
      <AboutModal disclosure={aboutDisclosure} />
      <KeyboardShortcuts extDisclosure={keyboardShortcutsDisclosure} />

      {/* Update notification */}
      <UpdateNotification updater={updater} />
    </DesktopActionsContext.Provider>
  );
}
