import { createContext, useContext } from 'react';

export interface DesktopActionsContextType {
  // Modals
  openImportExport: () => void;
  openAbout: () => void;
  openKeyboardShortcuts: () => void;

  // Quick actions
  quickAdd: () => void;
  quickSearch: () => void;

  // UI Toggles
  toggleSidebar: () => void;
  toggleFilters: () => void;

  // Library
  clearLibrary: () => void;

  // Sync
  triggerSync: () => void;

  // Updates
  checkForUpdates: () => void;
}

export const DesktopActionsContext = createContext<DesktopActionsContextType | null>(null);

export const useDesktopActions = () => {
  const context = useContext(DesktopActionsContext);
  if (!context) {
    throw new Error('useDesktopActions must be used within DesktopActionsProvider');
  }
  return context;
};
