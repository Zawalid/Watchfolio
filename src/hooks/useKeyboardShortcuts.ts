import { useEffect, useRef } from 'react';

type Shortcut = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  description?: string;
  preventOnInput?: boolean;
};

type ShortcutOptions = {
  enabled?: boolean;
};

function useKeyboardShortcuts(shortcuts: Shortcut[], options: ShortcutOptions = {}) {
  const { enabled = true } = options;

  // Store shortcuts in a ref for updates without re-registering
  const shortcutsRef = useRef<Shortcut[]>(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if target is an input element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Try to match by key AND modifiers exactly
      let matchedShortcut = shortcutsRef.current.find(
        (shortcut) =>
          shortcut.key.toLowerCase() === e.key.toLowerCase() &&
          !!shortcut.ctrlKey === e.ctrlKey &&
          !!shortcut.altKey === e.altKey &&
          !!shortcut.shiftKey === e.shiftKey &&
          !!shortcut.metaKey === e.metaKey
      );

      // If no match found, try key-only match
      if (!matchedShortcut) {
        // Try to find a shortcut by key only (ignoring modifiers)
        matchedShortcut = shortcutsRef.current.find(
          (shortcut) =>
            shortcut.key.toLowerCase() === e.key.toLowerCase() &&
            shortcut.shiftKey === undefined && // Only if shiftKey wasn't explicitly defined
            !shortcut.ctrlKey &&
            !shortcut.altKey &&
            !shortcut.metaKey
        );
      }

      if (matchedShortcut) {
        e.preventDefault();
        matchedShortcut.callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  // Helper function to create a unique ID for a shortcut
  const getShortcutId = (shortcut: Shortcut): string => {
    const modifiers = [
      shortcut.ctrlKey && 'Ctrl',
      shortcut.altKey && 'Alt',
      shortcut.shiftKey && 'Shift',
      shortcut.metaKey && 'Meta',
    ]
      .filter(Boolean)
      .join('+');

    return modifiers ? `${modifiers}+${shortcut.key}` : shortcut.key;
  };

  // Return the list of shortcuts for documentation/UI purposes
  const getShortcutsList = () => {
    return shortcutsRef.current.map((shortcut) => ({
      id: getShortcutId(shortcut),
      key: shortcut.key,
      ctrlKey: shortcut.ctrlKey,
      altKey: shortcut.altKey,
      shiftKey: shortcut.shiftKey,
      metaKey: shortcut.metaKey,
      description: shortcut.description || '',
    }));
  };

  return {
    getShortcutsList,
  };
}

export default useKeyboardShortcuts;
