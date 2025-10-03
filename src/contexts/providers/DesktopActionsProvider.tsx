import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useDisclosure } from '@heroui/react';
import { DesktopActionsContext } from '../DesktopActionsContext';
import ImportExportModal from '@/components/library/ImportExportModal';
import { AboutModal } from '@/components/desktop/AboutModal';
import { KeyboardShortcutsModal } from '@/components/desktop/KeyboardShortcutsModal';
import { useSyncStore } from '@/stores/useSyncStore';

/**
 * Provider for desktop actions
 * Makes modals and actions accessible from anywhere in the app
 */
export function DesktopActionsProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const importExportDisclosure = useDisclosure();
  const aboutDisclosure = useDisclosure();
  const keyboardShortcutsDisclosure = useDisclosure();

  const { startSync } = useSyncStore();

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
    // Navigate to discover/search page for quick add
    navigate('/movies');
    // Focus search after navigation
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }, [navigate]);

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
    // TODO: Implement auto-update check
    console.log('Checking for updates...');
  }, []);

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
      <ImportExportModal disclosure={importExportDisclosure} />
      <AboutModal disclosure={aboutDisclosure} />
      <KeyboardShortcutsModal disclosure={keyboardShortcutsDisclosure} />
    </DesktopActionsContext.Provider>
  );
}
