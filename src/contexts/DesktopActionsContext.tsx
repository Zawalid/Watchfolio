import { createContext, useContext } from 'react';

export interface UpdaterState {
  checking: boolean;
  updateAvailable: boolean;
  updateInfo: {
    version: string;
    currentVersion: string;
    date?: string;
    body?: string;
  } | null;
  downloading: boolean;
  downloadProgress: number;
  readyToInstall: boolean;
  checkForUpdates: (showToast?: boolean) => Promise<void>;
  downloadAndInstall: () => Promise<void>;
  dismissUpdate: () => void;
}

export interface DesktopActionsContextType {
  // Modals
  openImportExport: () => void;
  openAbout: () => void;
  openKeyboardShortcuts: () => void;

  // Quick actions
  quickAdd: () => void;

  // UI Toggles
  toggleSidebar: () => void;
  toggleFilters: () => void;

  // Library
  clearLibrary: () => void;

  // Sync
  triggerSync: () => void;

  // Updates
  checkForUpdates: () => void;
  updater: UpdaterState;
}

export const DesktopActionsContext = createContext<DesktopActionsContextType | null>(null);

export const useDesktopActions = () => {
  const context = useContext(DesktopActionsContext);
  if (!context) {
    throw new Error('useDesktopActions must be used within DesktopActionsProvider');
  }
  return context;
};
