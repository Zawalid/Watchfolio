import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { listen } from '@tauri-apps/api/event';
import { isDesktop } from '@/lib/platform';
import { useDesktopActions } from '@/contexts/DesktopActionsContext';

/**
 * Hook to handle desktop menu and tray events
 * Listens for events from native menus, system tray, and global shortcuts
 */
export function useDesktopIntegration() {
  const navigate = useNavigate();
  const actions = useDesktopActions();

  useEffect(() => {
    if (!isDesktop()) return;

    const setupListeners = async () => {
      // Menu Events
      const unlistenNewItem = await listen('menu:new-item', () => {
        actions.quickAdd();
      });

      const unlistenQuickAdd = await listen('menu:quick-add', () => {
        actions.quickAdd();
      });

      const unlistenImport = await listen('menu:import', () => {
        actions.openImportExport();
      });

      const unlistenExport = await listen('menu:export', () => {
        actions.openImportExport();
      });

      const unlistenPreferences = await listen('menu:preferences', () => {
        navigate('/settings');
      });

      const unlistenNavigate = await listen<string>('menu:navigate', (event) => {
        navigate(event.payload);
      });

      const unlistenDocumentation = await listen('menu:documentation', () => {
        window.open('https://docs.watchfolio.app', '_blank');
      });

      const unlistenKeyboardShortcuts = await listen('menu:keyboard-shortcuts', () => {
        actions.openKeyboardShortcuts();
      });

      const unlistenCheckUpdates = await listen('menu:check-updates', () => {
        actions.checkForUpdates();
      });

      const unlistenAbout = await listen('menu:about', () => {
        actions.openAbout();
      });

      // Tray Events
      const unlistenTrayQuickAdd = await listen('tray:quick-add', () => {
        actions.quickAdd();
      });

      const unlistenTraySearch = await listen('tray:search', () => {
        actions.quickSearch();
      });

      const unlistenTrayNavigate = await listen<string>('tray:navigate', (event) => {
        navigate(event.payload);
      });

      const unlistenTrayQuickStatus = await listen<string>('tray:quick-status', (event) => {
        window.dispatchEvent(new CustomEvent('quick-status-change', {
          detail: { status: event.payload }
        }));
      });

      const unlistenTraySyncNow = await listen('tray:sync-now', () => {
        actions.triggerSync();
      });

      // Global Shortcut Events
      const unlistenShortcutQuickAdd = await listen('shortcut:quick-add', () => {
        actions.quickAdd();
      });

      const unlistenShortcutSearch = await listen('shortcut:search', () => {
        actions.quickSearch();
      });

      const unlistenShortcutCustom = await listen<string>('shortcut:custom', (event) => {
        window.dispatchEvent(new CustomEvent('custom-shortcut', {
          detail: { action: event.payload }
        }));
      });

      // Cleanup
      return () => {
        unlistenNewItem();
        unlistenQuickAdd();
        unlistenImport();
        unlistenExport();
        unlistenPreferences();
        unlistenNavigate();
        unlistenDocumentation();
        unlistenKeyboardShortcuts();
        unlistenCheckUpdates();
        unlistenAbout();
        unlistenTrayQuickAdd();
        unlistenTraySearch();
        unlistenTrayNavigate();
        unlistenTrayQuickStatus();
        unlistenTraySyncNow();
        unlistenShortcutQuickAdd();
        unlistenShortcutSearch();
        unlistenShortcutCustom();
      };
    };

    setupListeners();
  }, [navigate, actions]);
}
