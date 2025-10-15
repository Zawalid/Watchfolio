# Watchfolio Keyboard Shortcuts - System Overview

## Understanding Scope vs Platform

### What is `scope`? (WHERE the shortcut works)

| Scope | Meaning | Example | Who handles it? |
|-------|---------|---------|-----------------|
| `'app'` | Only works **inside the app** (when window is focused) | `Ctrl+B` toggle sidebar | React (`useHotkeys`) |
| `'global'` | Works **anywhere** (even when app is hidden/minimized) | `Ctrl+Shift+W` Quick Add | Tauri (system-wide) |
| `'both'` | Works **both** inside app AND globally | `Ctrl+N` Quick Add | Both React + Tauri |

### What is `platform`? (WHICH version of the app)

| Platform | Meaning | Example |
|----------|---------|---------|
| `'web'` | Only on web version (browser) | Web-specific features |
| `'desktop'` | Only on Tauri desktop app | Desktop-only features |
| `'both'` | Works on web AND desktop | Most shortcuts |

### Quick Decision Guide

```
Scope:
  'app'    → Most shortcuts (90%) - navigation, filters, etc.
  'global' → 2-3 shortcuts - wake app from anywhere
  'both'   → Global + enhanced in-app behavior

Platform:
  'both'    → 99% of shortcuts
  'desktop' → Window management, system-wide features
  'web'     → Rare, web-specific features
```

---

## Optimal File Structure

```
watchfolio/
├── src/
│   ├── config/
│   │   └── shortcuts.ts                 # ⭐ SINGLE SOURCE OF TRUTH
│   │
│   ├── hooks/
│   │   └── useShortcut.ts               # Optional: wrapper around useHotkeys
│   │
│   └── components/
│       └── library/KeyboardShortcuts.tsx # Existing help modal
│
└── src-tauri/src/
    ├── shortcuts.rs                     # Global shortcuts only (2-3 shortcuts)
    └── menu.rs                          # Menu (reads labels from shortcuts.ts)
```

### What Changes?

1. **Enhance existing file** → `src/utils/keyboardShortcuts.ts` → `src/config/shortcuts.ts`
   - Add `scope: 'app' | 'global' | 'both'`
   - Add `platform: 'web' | 'desktop' | 'both'`

2. **Optional**: Create `src/hooks/useShortcut.ts` (cleaner API)

3. **Tauri**: Keep minimal (only 2-3 global shortcuts in `shortcuts.rs`)

---

## File Contents

### `src/config/shortcuts.ts`

```typescript
export interface KeyboardShortcut {
  hotkey: string;
  label: string;
  description: string;
  category: ShortcutCategory;
  scope: 'app' | 'global' | 'both';
  platform?: 'web' | 'desktop' | 'both';
}

export type ShortcutCategory =
  | 'general'
  | 'navigation'
  | 'library'
  | 'cardFocus'
  | 'filters'
  | 'mediaStatus';

export const KEYBOARD_SHORTCUTS = {
  // App-level shortcuts (most common)
  toggleSidebar: {
    hotkey: 'ctrl+b',
    label: 'Ctrl+B',
    description: 'Toggle sidebar',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },

  focusSearch: {
    hotkey: '/',
    label: '/',
    description: 'Focus search input',
    category: 'general',
    scope: 'app',
    platform: 'both',
  },

  // Global shortcuts (desktop only, 2-3 max)
  quickAddGlobal: {
    hotkey: 'ctrl+shift+w',
    label: 'Ctrl+Shift+W',
    description: 'Quick Add (works anywhere)',
    category: 'general',
    scope: 'global',
    platform: 'desktop',
  },

  showHideApp: {
    hotkey: 'ctrl+shift+space',
    label: 'Ctrl+Shift+Space',
    description: 'Show/Hide app window',
    category: 'general',
    scope: 'global',
    platform: 'desktop',
  },

  // ... rest of shortcuts with scope and platform fields
} as const;

export type ShortcutName = keyof typeof KEYBOARD_SHORTCUTS;

// Helper functions
export function getShortcut(name: ShortcutName) {
  return KEYBOARD_SHORTCUTS[name];
}

export function getAppShortcuts() {
  return getAllShortcuts().filter(s => s.scope === 'app' || s.scope === 'both');
}

export function getGlobalShortcuts() {
  return getAllShortcuts().filter(s => s.scope === 'global' || s.scope === 'both');
}
```

### `src/hooks/useShortcut.ts` (Optional)

```typescript
import { useHotkeys } from 'react-hotkeys-hook';
import { getShortcut, type ShortcutName } from '@/config/shortcuts';

export function useShortcut(
  shortcutName: ShortcutName,
  handler: () => void,
  options?: { enabled?: boolean }
) {
  const shortcut = getShortcut(shortcutName);

  if (shortcut.scope === 'global') {
    console.warn(`"${shortcutName}" is global, handled by Tauri`);
    return;
  }

  useHotkeys(shortcut.hotkey, handler, {
    enabled: options?.enabled ?? true,
  });
}
```

### `src-tauri/src/shortcuts.rs`

```rust
use tauri::{AppHandle, Manager};
use tauri_plugin_global_shortcut::GlobalShortcutExt;

pub fn register_global_shortcuts(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let manager = app.global_shortcut();

    // Only 2-3 global shortcuts here!

    // 1. Quick Add (Ctrl+Shift+W)
    let app_handle = app.clone();
    manager.on_shortcut("Ctrl+Shift+W", move || {
        if let Some(window) = app_handle.get_webview_window("main") {
            let _ = window.show();
            let _ = window.set_focus();
        }
        let _ = app_handle.emit("shortcut:quick-add", ());
    })?;

    // 2. Show/Hide App (Ctrl+Shift+Space)
    let app_handle2 = app.clone();
    manager.on_shortcut("Ctrl+Shift+Space", move || {
        if let Some(window) = app_handle2.get_webview_window("main") {
            if window.is_visible().unwrap_or(false) {
                let _ = window.hide();
            } else {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
    })?;

    Ok(())
}
```

---

## Centralizing Registration

### The Problem

Currently, shortcuts are registered in **dozens of different components**:

```typescript
// LibraryViewLayout.tsx
useHotkeys('/', () => focusSearch());

// FiltersModal.tsx
useHotkeys('alt+f', () => toggleFilters());

// MediaStatusModal.tsx
useHotkeys('alt+w', () => setStatus('watching'));

// ... 30+ more components
```

**Issues:**
- ❌ Scattered across codebase
- ❌ Hard to see what's registered where
- ❌ Can't easily disable/enable shortcuts globally
- ❌ No conflict detection

---

### The Solution: Central Registration Hook

Create a **single hook** that auto-registers shortcuts based on context:

```typescript
// src/hooks/useShortcutRegistry.ts

import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { getShortcut, type ShortcutName } from '@/config/shortcuts';

interface ShortcutHandler {
  name: ShortcutName;
  handler: () => void;
  enabled?: boolean;
}

/**
 * Central shortcut registry - registers multiple shortcuts at once
 */
export function useShortcuts(shortcuts: ShortcutHandler[]) {
  shortcuts.forEach(({ name, handler, enabled = true }) => {
    const shortcut = getShortcut(name);

    // Skip global shortcuts (handled by Tauri)
    if (shortcut.scope === 'global') return;

    useHotkeys(
      shortcut.hotkey,
      (e) => {
        e.preventDefault();
        handler();
      },
      {
        enabled,
        // Add scopes to prevent conflicts
        scopes: [name],
      }
    );
  });
}

// Alternative: Single shortcut registration
export function useShortcut(
  name: ShortcutName,
  handler: () => void,
  options?: { enabled?: boolean }
) {
  const shortcut = getShortcut(name);

  if (shortcut.scope === 'global') return;

  useHotkeys(
    shortcut.hotkey,
    (e) => {
      e.preventDefault();
      handler();
    },
    {
      enabled: options?.enabled ?? true,
      scopes: [name],
    }
  );
}
```

---

### Usage Examples

#### Before (Scattered)

```typescript
// FiltersModal.tsx
function FiltersModal() {
  useHotkeys('alt+f', () => toggleFilters());
  useHotkeys('alt+1', () => filterMovies());
  useHotkeys('alt+2', () => filterTv());
  useHotkeys('alt+0', () => clearFilters());
  useHotkeys('escape', () => onClose());
}
```

#### After (Centralized)

```typescript
// FiltersModal.tsx
import { useShortcuts } from '@/hooks/useShortcutRegistry';

function FiltersModal({ isOpen, onClose }) {
  useShortcuts([
    { name: 'toggleFilters', handler: () => isOpen ? onClose() : onOpen() },
    { name: 'filterMovies', handler: filterMovies, enabled: isOpen },
    { name: 'filterTvShows', handler: filterTv, enabled: isOpen },
    { name: 'clearFilters', handler: clearFilters, enabled: isOpen },
    { name: 'escape', handler: onClose, enabled: isOpen },
  ]);
}
```

---

### Advanced: Provider-Based Registration

For even more centralization, use a provider:

```typescript
// src/contexts/ShortcutsProvider.tsx

import { createContext, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router';
import { useShortcuts } from '@/hooks/useShortcutRegistry';
import { useDesktopActions } from '@/contexts/DesktopActionsContext';

export function ShortcutsProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { quickAdd, openImportExport, quickSearch } = useDesktopActions();

  // Register GLOBAL app shortcuts (work everywhere)
  useShortcuts([
    { name: 'quickAdd', handler: quickAdd },
    { name: 'toggleShortcutsHelp', handler: () => showHelp() },
    { name: 'focusSearch', handler: () => focusSearchInput() },
    { name: 'escape', handler: () => handleEscape() },
  ]);

  // Register page-specific shortcuts based on route
  useEffect(() => {
    if (location.pathname.startsWith('/library')) {
      // Library-specific shortcuts
    } else if (location.pathname.startsWith('/movies')) {
      // Movies-specific shortcuts
    }
  }, [location]);

  return <>{children}</>;
}

// Usage in app
function App() {
  return (
    <ShortcutsProvider>
      {/* Your app */}
    </ShortcutsProvider>
  );
}
```

---

### Benefits of Centralized Registration

| Benefit | Description |
|---------|-------------|
| ✅ **Single source** | See all shortcuts in one place |
| ✅ **Type safety** | Autocomplete for shortcut names |
| ✅ **Conflict detection** | TypeScript errors if duplicate keys |
| ✅ **Easy disable** | Disable all shortcuts with one flag |
| ✅ **Context-aware** | Automatically enable/disable based on state |
| ✅ **No duplication** | DRY - no hardcoded keys |
| ✅ **Better testing** | Mock the registry, not individual hooks |

---

### Recommended Approach

**Hybrid approach** (best of both worlds):

1. **Global shortcuts** → `ShortcutsProvider` (app-wide, always active)
2. **Component shortcuts** → `useShortcut` or `useShortcuts` hook
3. **Modal shortcuts** → `useShortcuts` with `enabled` based on modal state

```typescript
// App-level (Provider)
<ShortcutsProvider>  {/* Handles: Ctrl+N, ?, / */}
  <Routes>
    {/* Component-level */}
    <LibraryPage />  {/* Handles: Ctrl+B, Ctrl+I */}

    {/* Modal-level */}
    <FiltersModal />  {/* Handles: Alt+F, Alt+1, Alt+2 when open */}
  </Routes>
</ShortcutsProvider>
```

---

### Migration Strategy

1. **Phase 1**: Create `useShortcut` hook, keep existing `useHotkeys` calls
2. **Phase 2**: Gradually replace `useHotkeys` with `useShortcut`
3. **Phase 3**: Add `ShortcutsProvider` for global shortcuts
4. **Phase 4**: Move component shortcuts to provider when appropriate

**No breaking changes** - migrate gradually!

---

## Complete Shortcuts Tables

### Legend
- 🔴 **Critical** - Must implement (core functionality)
- 🟡 **High Priority** - Should implement (high user value)
- 🟢 **Medium Priority** - Nice to have (improves UX)
- 🔵 **Low Priority** - Advanced features (power users)
- 🟣 **Accessibility** - A11y compliance

---

## Shortcuts to Implement

| Priority | Shortcut | Action | Category | Scope | Platform | Status | Notes |
|----------|----------|--------|----------|-------|----------|--------|-------|
| 🔴 | `Ctrl+K` | Command palette | General | App | Both | ❌ Missing | Industry standard, VSCode-like |
| 🔴 | `G then H` | Go to Home | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🔴 | `G then L` | Go to Library | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🔴 | `G then M` | Go to Movies | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🔴 | `G then T` | Go to TV Shows | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🔴 | `G then S` | Go to Search | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🔴 | `Ctrl+Shift+F` | Global search | System | Global | Desktop | ⚠️ Disabled | Restore commented code |
| 🟡 | `Ctrl+[` | Go to previous view | Navigation | App | Both | ❌ Missing | Browser-like navigation |
| 🟡 | `Ctrl+]` | Go to next view | Navigation | App | Both | ❌ Missing | Browser-like navigation |
| 🟡 | `R` | Refresh current view | General | App | Both | ❌ Missing | Quick refresh without F5 |
| 🟡 | `G then H` | Go to Home | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🟡 | `G then L` | Go to Library | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🟡 | `G then M` | Go to Movies | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🟡 | `G then T` | Go to TV Shows | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🟡 | `G then S` | Go to Search | Navigation | App | Both | ❌ Missing | Vim-style navigation |
| 🟢 | `Space` | Play trailer | Media | App | Both | ❌ Missing | When on details page |
---

## Currently Implemented Shortcuts

| Shortcut | Action | Category | Scope | Platform | Location |
|----------|--------|----------|-------|----------|----------|
| `?` | Show shortcuts help | General | App | Both | All pages |
| `Escape` | Close modal | General | App | Both | All modals |
| `/` | Focus search | General | App | Both | Library/Media pages |
| `Ctrl+Backspace` | Clear search | General | App | Both | Library/Media pages |
| `Ctrl+B` | Toggle sidebar | General | App | Both | Library pages |
| `Alt+Left` | Go back | Navigation | App | Both | All pages |
| `Alt+Right` | Go forward | Navigation | App | Both | All pages |
| `Ctrl+N` | Quick Add | General | App | Both | Global |
| `Ctrl+Shift+W` | Quick Add (global) | System | Global | Desktop | System-wide |
| `Ctrl+Shift+Space` | Show/Hide app | System | Global | Desktop | System-wide |
| `Ctrl+I` | Import/Export | Library | App | Both | Library page |
| `Shift+Delete` | Clear library | Library | App | Both | Library page |
| `Alt+F` | Toggle filters | Filters | App | Both | Media/Library pages |
| `Alt+1` | Filter: Movies | Filters | App | Both | Filter modal |
| `Alt+2` | Filter: TV Shows | Filters | App | Both | Filter modal |
| `Alt+0` | Clear filters | Filters | App | Both | Filter modal |
| `Alt+Shift+P` | Sort by popularity | Filters | App | Both | Media pages |
| `Alt+Shift+R` | Sort by rating | Filters | App | Both | Media pages |
| `Alt+Shift+D` | Sort by date | Filters | App | Both | Media pages |
| `Alt+Shift+T` | Sort by title | Filters | App | Both | Media pages |
| `Alt+W` | Status: Watching | Media Status | App | Both | Status modal |
| `Alt+P` | Status: Plan to Watch | Media Status | App | Both | Status modal |
| `Alt+C` | Status: Completed | Media Status | App | Both | Status modal |
| `Alt+H` | Status: On Hold | Media Status | App | Both | Status modal |
| `Alt+D` | Status: Dropped | Media Status | App | Both | Status modal |
| `1-9` | Rate 1-9 stars | Media Status | App | Both | Status modal |
| `1 then 0` | Rate 10 stars | Media Status | App | Both | Status modal |
| `X` | Clear rating | Media Status | App | Both | Status modal |
| `Delete` | Clear status/Remove | General | App | Both | Various |
| `F` | Toggle favorite | Media | App | Both | Media cards (focused) |
| `E` | Edit status | Media | App | Both | Media cards (focused) |
| `A` | Add to library | Media | App | Both | Media cards (focused) |
| `Up/Down/Left/Right` | Navigate grid | Navigation | App | Both | Media grids |
| `Home` | First item | Navigation | App | Both | Media grids |
| `End` | Last item | Navigation | App | Both | Media grids |
| `Enter` | Select/Open | General | App | Both | Various |
| `Ctrl+R` | Reload page | System | App | Desktop | Desktop menu |
| `F11` | Toggle fullscreen | System | App | Desktop | Desktop menu |
| `Ctrl+M` | Minimize window | System | App | Desktop | Desktop menu |
| `Ctrl+H` | Hide to tray | System | App | Desktop | Desktop menu |
| `Ctrl+Q` | Quit app | System | App | Desktop | Desktop menu |
| `Ctrl+,` | Preferences | General | App | Desktop | Desktop menu |
| `F1` | Documentation | General | App | Desktop | Desktop menu |

---

## Summary Statistics

| Category | Count | Notes |
|----------|-------|-------|
| **Currently Implemented** | 47 shortcuts | Working and tested |
| **Critical (Must Add)** | 7 shortcuts | Core functionality gaps |
| **High Priority** | 11 shortcuts | High user value |
| **Medium Priority** | 15 shortcuts | Nice to have features |
| **Low Priority** | 18 shortcuts | Advanced/power user |
| **Accessibility** | 8 shortcuts | A11y compliance |
| **Total Existing + Recommended** | **106 shortcuts** | Comprehensive coverage |

---

## Implementation Priority

1. **Phase 1 (Week 1-2)**: Critical shortcuts (7) - Fix menu navigation, add command palette
2. **Phase 2 (Week 3-4)**: High priority (11) - Navigation improvements, vim-style
3. **Phase 3 (Week 5-6)**: Medium priority (15) - UX enhancements
4. **Phase 4 (Future)**: Low priority (18) - Power user features
5. **Ongoing**: Accessibility (8) - Continuous improvement
