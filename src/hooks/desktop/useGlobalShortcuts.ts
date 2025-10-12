import { invoke } from '@tauri-apps/api/core';
import { isDesktop } from '@/lib/platform';

export interface GlobalShortcut {
  id: string;
  name: string;
  description: string;
  defaultShortcut: string;
  currentShortcut: string;
}

/**
 * Hook for managing global keyboard shortcuts
 */
export function useGlobalShortcuts() {
  /**
   * Register a custom global shortcut
   */
  const registerShortcut = async (shortcut: string, action: string): Promise<void> => {
    if (!isDesktop()) {
      console.warn('Global shortcuts are only available on desktop');
      return;
    }

    try {
      await invoke('register_custom_shortcut', { shortcut, action });
    } catch (error) {
      console.error('Failed to register shortcut:', error);
      throw error;
    }
  };

  /**
   * Unregister a global shortcut
   */
  const unregisterShortcut = async (shortcut: string): Promise<void> => {
    if (!isDesktop()) return;

    try {
      await invoke('unregister_shortcut', { shortcut });
    } catch (error) {
      console.error('Failed to unregister shortcut:', error);
      throw error;
    }
  };

  /**
   * Check if a shortcut is already registered
   */
  const isShortcutRegistered = async (shortcut: string): Promise<boolean> => {
    if (!isDesktop()) return false;

    try {
      return await invoke('is_shortcut_registered', { shortcut });
    } catch (error) {
      console.error('Failed to check shortcut:', error);
      return false;
    }
  };

  /**
   * Get all available global shortcuts
   */
  const getAvailableShortcuts = (): GlobalShortcut[] => {
    return [
      {
        id: 'quick_add',
        name: 'Quick Add',
        description: 'Open quick add dialog from anywhere',
        defaultShortcut: 'Ctrl+Shift+W',
        currentShortcut: 'Ctrl+Shift+W',
      },
      {
        id: 'global_search',
        name: 'Global Search',
        description: 'Open and focus search from anywhere',
        defaultShortcut: 'Ctrl+Shift+F',
        currentShortcut: 'Ctrl+Shift+F',
      },
      {
        id: 'show_hide',
        name: 'Show/Hide App',
        description: 'Toggle app visibility',
        defaultShortcut: 'Ctrl+Shift+Space',
        currentShortcut: 'Ctrl+Shift+Space',
      },
    ];
  };

  return {
    registerShortcut,
    unregisterShortcut,
    isShortcutRegistered,
    getAvailableShortcuts,
    isAvailable: isDesktop(),
  };
}
