# Watchfolio Desktop Features

Complete guide to all desktop-specific features in Watchfolio.

---

## Overview

Watchfolio's desktop app (Windows, macOS, Linux) includes powerful native features that make it feel like a true desktop application:

✅ **Native Menu Bar** - Full File/Edit/View/Window/Help menus
✅ **System Tray** - Always accessible from system tray with quick actions
✅ **Global Shortcuts** - Control app from anywhere on your system
✅ **Window Management** - Minimize to tray, fullscreen, zoom controls
✅ **Platform Integration** - Native notifications, dialogs, and OS integration

---

## 1. Native Menu Bar

### File Menu

| Action | Shortcut | Description |
|--------|----------|-------------|
| **New Item** | `Ctrl+N` | Add new media to library |
| **Quick Add...** | `Ctrl+Shift+A` | Open quick add dialog |
| **Import Library...** | - | Import from file |
| **Export Library...** | `Ctrl+E` | Export library |
| **Preferences...** | `Ctrl+,` | Open settings |
| **Quit Watchfolio** | `Ctrl+Q` | Exit application |

### Edit Menu

Standard editing commands that work with all text inputs:

| Action | Shortcut |
|--------|----------|
| **Undo** | `Ctrl+Z` |
| **Redo** | `Ctrl+Y` |
| **Cut** | `Ctrl+X` |
| **Copy** | `Ctrl+C` |
| **Paste** | `Ctrl+V` |
| **Select All** | `Ctrl+A` |

### View Menu

| Action | Shortcut | Description |
|--------|----------|-------------|
| **Library** | `Ctrl+1` | Navigate to library |
| **Discover** | `Ctrl+2` | Navigate to discover |
| **Statistics** | `Ctrl+3` | Navigate to statistics |
| **Recommendations** | `Ctrl+4` | Navigate to recommendations |
| **Profile** | `Ctrl+5` | Navigate to profile |
| **Reload** | `Ctrl+R` | Reload page |
| **Toggle Fullscreen** | `F11` | Enter/exit fullscreen |
| **Actual Size** | `Ctrl+0` | Reset zoom to 100% |
| **Zoom In** | `Ctrl++` | Increase zoom |
| **Zoom Out** | `Ctrl+-` | Decrease zoom |

### Window Menu

| Action | Shortcut | Description |
|--------|----------|-------------|
| **Minimize** | `Ctrl+M` | Minimize window |
| **Maximize** | - | Maximize/restore window |
| **Hide to Tray** | `Ctrl+H` | Hide window to system tray |

### Help Menu

| Action | Shortcut | Description |
|--------|----------|-------------|
| **Documentation** | `F1` | Open online documentation |
| **Keyboard Shortcuts** | `Ctrl+/` | View all shortcuts |
| **Report Issue** | - | Open GitHub issues |
| **Check for Updates** | - | Check for new version |
| **About Watchfolio** | - | About dialog |

---

## 2. System Tray

The system tray icon provides quick access to common actions without opening the main window.

### Tray Icon Behavior

**Left Click**: Show/hide main window
**Right Click**: Open tray menu

### Tray Menu

```
┌─────────────────────────────┐
│ Show Watchfolio            │
├─────────────────────────────┤
│ Quick Add...  Ctrl+Shift+A │
│ Search...     Ctrl+Shift+F │
├─────────────────────────────┤
│ Library       Ctrl+1       │
│ Discover      Ctrl+2       │
│ Statistics    Ctrl+3       │
├─────────────────────────────┤
│ Quick Status              ►│ ┌───────────────┐
│                            │ │ Watching      │
│                            │ │ Completed     │
│                            │ │ Plan to Watch │
│                            │ │ On Hold       │
│                            │ │ Dropped       │
│                            │ └───────────────┘
├─────────────────────────────┤
│ Sync Now                   │
├─────────────────────────────┤
│ Preferences...  Ctrl+,     │
├─────────────────────────────┤
│ Quit Watchfolio Ctrl+Q     │
└─────────────────────────────┘
```

### Quick Status

The **Quick Status** submenu allows you to quickly change the status of the currently selected/last viewed media item without opening the app.

---

## 3. Global Keyboard Shortcuts

Global shortcuts work **system-wide**, even when Watchfolio is minimized or in the background.

### Built-in Global Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Shift+W` | **Quick Add** | Open Watchfolio and show quick add dialog |
| `Ctrl+Shift+F` | **Global Search** | Open Watchfolio and focus search |
| `Ctrl+Shift+Space` | **Show/Hide App** | Toggle window visibility |

### Custom Global Shortcuts

You can register custom global shortcuts programmatically:

```typescript
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';

const { registerShortcut, unregisterShortcut } = useGlobalShortcuts();

// Register custom shortcut
await registerShortcut('Ctrl+Shift+L', 'open-library');

// Unregister when no longer needed
await unregisterShortcut('Ctrl+Shift+L');
```

---

## 4. Window Management

### Minimize to Tray

By default, clicking the close button (X) **minimizes the app to the system tray** instead of quitting.

**To actually quit:**
- Use `File → Quit` (Ctrl+Q)
- Right-click tray icon → Quit
- Use Task Manager (not recommended)

**To disable minimize to tray:**
This feature is currently always enabled. A setting to disable it may be added in future versions.

### Window States

- **Normal**: Default windowed mode
- **Minimized**: Hidden in taskbar
- **Maximized**: Full screen (but with window decorations)
- **Fullscreen**: True fullscreen mode (F11)
- **Hidden to Tray**: Not visible in taskbar, accessible from tray

### Zoom Controls

Zoom affects the entire app interface:

- **Zoom In**: `Ctrl++` (increases by 10%)
- **Zoom Out**: `Ctrl+-` (decreases by 10%, min 50%)
- **Reset**: `Ctrl+0` (returns to 100%)

**Note**: Zoom level is per-session and resets when you restart the app.

---

## 5. Platform-Specific Features

### Windows

- **Windows 11 Snap Layouts**: Watchfolio participates in Windows 11's snap layouts
- **Taskbar Integration**: App icon shows in taskbar
- **Windows Notifications**: Native Windows notifications
- **Jump Lists**: Recent items in taskbar context menu (planned)

### macOS

- **Native Menu**: macOS-style menu in the top menu bar
- **Dock Integration**: App shows in Dock
- **macOS Notifications**: Native notification center integration
- **Touch Bar Support**: Planned for MacBook Pro with Touch Bar

### Linux

- **Desktop Integration**: Follows system theme (light/dark)
- **.desktop File**: Proper Linux desktop entry
- **System Tray**: Works with all major desktop environments
- **Wayland Support**: Full support for Wayland

---

## 6. Keyboard Shortcut Reference

### Complete List

#### Global (work anywhere)
- `Ctrl+Shift+W` - Quick Add
- `Ctrl+Shift+F` - Global Search
- `Ctrl+Shift+Space` - Show/Hide App

#### Application (work in app)
- `Ctrl+N` - New Item
- `Ctrl+Shift+A` - Quick Add
- `Ctrl+E` - Export
- `Ctrl+,` - Preferences
- `Ctrl+Q` - Quit
- `Ctrl+R` - Reload
- `F11` - Fullscreen
- `Ctrl+0` - Actual Size
- `Ctrl++` - Zoom In
- `Ctrl+-` - Zoom Out
- `Ctrl+M` - Minimize
- `Ctrl+H` - Hide to Tray

#### Navigation
- `Ctrl+1` - Library
- `Ctrl+2` - Discover
- `Ctrl+3` - Statistics
- `Ctrl+4` - Recommendations
- `Ctrl+5` - Profile

#### Help
- `F1` - Documentation
- `Ctrl+/` - Keyboard Shortcuts

#### Editing (standard)
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+X` - Cut
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Ctrl+A` - Select All

---

## 7. Event System

### Frontend Event Listeners

The desktop integration works through custom events. You can listen to these events:

```typescript
// Quick Add triggered
window.addEventListener('open-quick-add', () => {
  // Handle quick add
});

// Status change from tray
window.addEventListener('quick-status-change', (event) => {
  const status = event.detail.status;
  // Update status
});

// Sync triggered from tray
window.addEventListener('trigger-sync', () => {
  // Trigger sync
});

// Custom shortcut
window.addEventListener('custom-shortcut', (event) => {
  const action = event.detail.action;
  // Handle custom action
});
```

### Tauri Events

For advanced use cases, you can listen to Tauri events directly:

```typescript
import { listen } from '@tauri-apps/api/event';

// Menu events
await listen('menu:navigate', (event) => {
  navigate(event.payload);
});

// Tray events
await listen('tray:quick-add', () => {
  openQuickAdd();
});

// Shortcut events
await listen('shortcut:search', () => {
  focusSearch();
});
```

---

## 8. Development & Customization

### Adding Custom Menu Items

Edit `src-tauri/src/menu.rs`:

```rust
let my_action = MenuItem::with_id(app, "my_action", "My Action", true, Some("Ctrl+M"))?;

// Add to menu
let file_menu = SubmenuBuilder::new(app, "File")
    .item(&my_action)
    // ...
    .build()?;

// Handle event
match event.id().as_ref() {
    "my_action" => {
        let _ = window.emit("menu:my-action", ());
    }
    // ...
}
```

### Adding Tray Menu Items

Edit `src-tauri/src/tray.rs`:

```rust
let my_tray_action = MenuItemBuilder::with_id("my_tray_action", "My Tray Action").build(app)?;

// Add to tray menu
let menu = MenuBuilder::new(app)
    .item(&my_tray_action)
    // ...
    .build()?;

// Handle event
match event.id().as_ref() {
    "my_tray_action" => {
        // Handle action
    }
    // ...
}
```

### Registering Custom Global Shortcuts

Edit `src-tauri/src/shortcuts.rs` or use the frontend API:

```typescript
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';

const { registerShortcut } = useGlobalShortcuts();

await registerShortcut('Ctrl+Alt+X', 'custom_action');

// Listen for the shortcut
window.addEventListener('custom-shortcut', (event) => {
  if (event.detail.action === 'custom_action') {
    // Do something
  }
});
```

---

## 9. Troubleshooting

### System Tray Icon Not Showing

**Windows:**
- Check system tray overflow area (click ^ arrow)
- Ensure app is running (check Task Manager)

**macOS:**
- App appears in menu bar (top right)
- May be hidden in Control Center overflow

**Linux:**
- Ensure tray support in desktop environment
- Some minimal DEs don't support system tray
- Try installing `libappindicator` for better support

### Global Shortcuts Not Working

**Common Issues:**
1. **Shortcut Conflict**: Another app is using the same shortcut
   - Try a different key combination
   - Check system shortcuts in OS settings

2. **Permissions**: On some systems, global shortcuts require accessibility permissions
   - macOS: System Settings → Privacy & Security → Accessibility
   - Linux: May need to grant input permissions

3. **Shortcut Not Registered**: Check console for errors
   ```bash
   # Run in dev mode to see errors
   pnpm tauri:dev
   ```

### Menu Items Disabled/Grayed Out

Some menu items are context-dependent:
- Ensure you're on the correct page
- Check if the required data is loaded
- Some items only work with an active selection

### Window Won't Show After Hiding

**Solutions:**
1. Click system tray icon
2. Use global shortcut `Ctrl+Shift+Space`
3. Right-click tray → Show Watchfolio
4. Restart app (tray → Quit, then relaunch)

---

## 10. Best Practices

### For Users

1. **Learn the shortcuts**: The app is much more efficient with keyboard shortcuts
2. **Use tray for quick actions**: Don't open the app for simple tasks
3. **Keep app in tray**: Faster access and background sync
4. **Customize shortcuts**: Make them work for your workflow

### For Developers

1. **Always check platform**: Use `isDesktop()` before calling desktop features
2. **Provide web fallbacks**: Desktop features should degrade gracefully
3. **Test on all platforms**: Windows, macOS, and Linux behave differently
4. **Handle errors**: Global shortcuts and tray might fail on some systems

---

## 11. Comparison: Web vs Desktop

| Feature | Web | Desktop |
|---------|-----|---------|
| **System Tray** | ❌ | ✅ |
| **Global Shortcuts** | ❌ | ✅ |
| **Native Menus** | ❌ | ✅ |
| **Always Running** | ❌ | ✅ (in tray) |
| **Native Notifications** | ⚠️ (limited) | ✅ (full) |
| **Offline First** | ✅ | ✅ |
| **Auto Update** | ✅ (instant) | ✅ (on restart) |
| **Cross-Device Sync** | ✅ | ✅ |
| **Startup Speed** | ✅ Faster | ⚠️ Slower (first launch) |
| **Resource Usage** | ⚠️ Higher (browser) | ✅ Lower (native) |

---

## 12. Future Desktop Features

Planned features for future releases:

- **Auto-start on login**: Launch Watchfolio automatically when you log in
- **Custom tray icon states**: Different icons for sync status
- **Notification badges**: Unread count on app icon
- **Touch Bar support**: Quick actions on MacBook Pro Touch Bar
- **Windows 11 Jump Lists**: Recent items in taskbar
- **macOS Widgets**: Home screen widgets
- **Multiple windows**: Separate windows for different views
- **Drag & drop**: Drag media from browser to app
- **System integration**: Set as default handler for TMDB/IMDb links

---

## 13. Contributing

Want to add more desktop features?

1. Check `DESKTOP_MOBILE_ROADMAP.md` for planned features
2. Follow the patterns in `src-tauri/src/` for Rust code
3. Use the event system for Rust ↔ Frontend communication
4. Test on all platforms (Windows, macOS, Linux)
5. Update this documentation

**Key Files:**
- `src-tauri/src/menu.rs` - Native menu implementation
- `src-tauri/src/tray.rs` - System tray implementation
- `src-tauri/src/shortcuts.rs` - Global shortcuts
- `src/hooks/useDesktopIntegration.ts` - Frontend integration
- `src/components/desktop/DesktopBehavior.tsx` - Window behavior

---

**Last Updated**: 2025-10-03
**Version**: 1.0.0
