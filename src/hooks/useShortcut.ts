import { useHotkeys } from 'react-hotkeys-hook';
import { getShortcut, type ShortcutName } from '@/config/shortcuts';

/**
 * Simple wrapper around useHotkeys that uses centralized shortcuts config
 *
 * @example
 * useShortcut('toggleSidebar', () => setOpen(!open));
 *
 * @example with options
 * useShortcut('toggleFilters', handleToggle, { enabled: isModalOpen });
 */
export function useShortcut(
  shortcutName: ShortcutName,
  handler: () => void,
  options?: {
    enabled?: boolean;
  }
) {
  const shortcut = getShortcut(shortcutName);
  const isGlobal = shortcut?.scope === 'global';

  // Warn about issues but don't early return - hooks must be called unconditionally
  if (!shortcut) {
    console.warn(`Shortcut "${shortcutName}" not found in config`);
  }

  if (isGlobal && import.meta.env.DEV) {
    console.warn(`Shortcut "${shortcutName}" is global and should be handled by Tauri`);
  }

  // Always call the hook unconditionally, but disable it based on conditions
  const shouldEnable = !isGlobal && !!shortcut && (options?.enabled ?? true);

  useHotkeys(
    shortcut?.hotkey || '',
    (e) => {
      e.preventDefault();
      handler();
    },
    {
      enabled: shouldEnable,
    },
    [handler, options?.enabled]
  );
}

interface ShortcutHandler {
  name: ShortcutName;
  handler: () => void;
  enabled?: boolean;
}

/**
 * Register multiple shortcuts at once
 *
 * @example
 * useShortcuts([
 *   { name: 'toggleFilters', handler: toggleFilters },
 *   { name: 'filterMovies', handler: filterMovies, enabled: isOpen },
 *   { name: 'clearFilters', handler: clearFilters },
 * ]);
 */
export function useShortcuts(shortcuts: ShortcutHandler[]) {
  // Build comma-separated string of hotkeys and a map of handlers
  const hotkeysList: string[] = [];
  const handlersMap = new Map<string, { handler: () => void; enabled: boolean }>();

  shortcuts.forEach(({ name, handler, enabled = true }) => {
    const shortcut = getShortcut(name);
    const isGlobal = shortcut?.scope === 'global';

    if (!shortcut) {
      console.warn(`Shortcut "${name}" not found in config`);
      return;
    }

    if (isGlobal && import.meta.env.DEV) {
      console.warn(`Shortcut "${name}" is global and should be handled by Tauri`);
      return;
    }

    hotkeysList.push(shortcut.hotkey);
    handlersMap.set(shortcut.hotkey, { handler, enabled: enabled && !isGlobal });
  });

  // Join hotkeys with comma
  const hotkeysString = hotkeysList.join(',');

  useHotkeys(
    hotkeysString,
    (e, handler) => {
      e.preventDefault();

      // Reconstruct the hotkey from modifiers + keys
      const modifiers: string[] = [];
      if (handler.ctrl) modifiers.push('ctrl');
      if (handler.alt) modifiers.push('alt');
      if (handler.shift) modifiers.push('shift');
      if (handler.meta) modifiers.push('meta');

      const keys = handler.keys?.join('+') || '';
      const pressedKey = modifiers.length > 0 ? [...modifiers, keys].join('+').toLowerCase() : keys.toLowerCase();

      console.log(pressedKey)

      // Find matching handler by comparing normalized hotkeys
      for (const [hotkey, entry] of handlersMap.entries()) {
        const normalizedHotkey = hotkey.toLowerCase();
        if (normalizedHotkey === pressedKey && entry.enabled) {
          entry.handler();
          break;
        }
      }
    },
    { enabled: true, useKey: true }
  );
}
