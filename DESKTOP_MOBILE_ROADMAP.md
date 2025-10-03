# Watchfolio Desktop & Mobile Implementation Roadmap

## Table of Contents
1. [Current Status](#current-status)
2. [Project Vision](#project-vision)
3. [Phase 1: Desktop Enhancement](#phase-1-desktop-enhancement)
4. [Phase 2: Mobile Implementation](#phase-2-mobile-implementation)
5. [Phase 3: Platform-Specific Features](#phase-3-platform-specific-features)
6. [Phase 4: Distribution & Deployment](#phase-4-distribution--deployment)
7. [Phase 5: Maintenance & Updates](#phase-5-maintenance--updates)
8. [Technical Architecture](#technical-architecture)
9. [Testing Strategy](#testing-strategy)
10. [Success Metrics](#success-metrics)

---

## Current Status

### ✅ Completed
- [x] Tauri 2.x initialized and configured
- [x] Desktop dev environment working (`pnpm tauri:dev`)
- [x] Platform detection utilities created
- [x] React hooks for platform awareness
- [x] Rust backend with basic commands
- [x] Desktop plugins configured (OS, Dialog, Notification, Deep Link, Global Shortcuts)
- [x] Vite configuration optimized for Tauri
- [x] CSP configured for all APIs (TMDB, Appwrite, Gemini)
- [x] Build scripts added to package.json
- [x] Rust updated to 1.90.0

### 🔄 In Progress
- [ ] Production build testing
- [ ] Platform-specific UI optimizations

### ⏳ Pending
- [ ] Desktop-specific features (system tray, native menus, etc.)
- [ ] Mobile initialization and development
- [ ] App icons and branding
- [ ] Code signing and distribution
- [ ] Auto-update mechanism
- [ ] CI/CD pipeline

---

## Project Vision

### Why Desktop & Mobile Apps?

**1. Enhanced User Experience**
- **Native Performance**: Faster than web, especially for RxDB operations
- **Better Offline**: True offline capability with local storage
- **System Integration**: Native notifications, file system access, deep linking
- **Keyboard-First**: Better keyboard shortcut support (desktop)
- **Touch-Optimized**: Native gestures and haptics (mobile)

**2. User Benefits**
- **Desktop Users**: Power users who want a dedicated app, better multitasking
- **Mobile Users**: On-the-go access, native mobile experience
- **Privacy-Conscious**: Local-first data with full control
- **Cross-Platform Sync**: Seamless sync between web, desktop, and mobile

**3. Competitive Advantage**
- Most competitors are web-only or iOS-only
- Unified codebase reduces maintenance
- Professional desktop app presence
- Native app store visibility

**4. Technical Benefits**
- **Shared Codebase**: 95% code reuse from web app
- **Tauri**: Smaller bundle size than Electron (~600KB vs ~100MB)
- **Performance**: Rust backend for heavy operations
- **Security**: Sandboxed execution, secure IPC

---

## Phase 1: Desktop Enhancement

**Timeline**: 2-3 weeks
**Priority**: High
**Platforms**: Windows, macOS, Linux

### 1.1 System Tray Integration

#### Use Case
Users want the app to run in the background without cluttering the taskbar. System tray allows:
- Quick access from anywhere
- Background sync notifications
- Minimize instead of close
- Quick actions (add media, search)

#### Implementation Plan

**Step 1: Install Tauri System Tray Plugin**
```bash
# Add to Cargo.toml dependencies
pnpm add @tauri-apps/plugin-system-tray
```

**Step 2: Configure in Rust** (`src-tauri/src/lib.rs`)
```rust
use tauri_plugin_system_tray::{SystemTray, SystemTrayMenu, SystemTrayMenuItem};

// In builder setup
.plugin(tauri_plugin_system_tray::init())
.setup(|app| {
    // Create tray menu
    let tray_menu = SystemTrayMenu::new()
        .add_item(SystemTrayMenuItem::new("Open Watchfolio", "open"))
        .add_item(SystemTrayMenuItem::new("Quick Add", "quick_add"))
        .add_separator()
        .add_item(SystemTrayMenuItem::new("Quit", "quit"));

    // Create system tray
    SystemTray::new()
        .with_menu(tray_menu)
        .build(app)?;

    Ok(())
})
```

**Step 3: Handle Tray Events**
```rust
.on_system_tray_event(|app, event| {
    match event.menu_item_id() {
        "open" => {
            let window = app.get_window("main").unwrap();
            window.show().unwrap();
            window.set_focus().unwrap();
        }
        "quick_add" => {
            // Open quick add dialog
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
})
```

**Step 4: Frontend Integration** (`src/lib/tauri/tray.ts`)
```typescript
import { invoke } from '@tauri-apps/api/core';

export async function updateTrayIcon(unreadCount: number) {
  await invoke('update_tray_badge', { count: unreadCount });
}

export async function showTrayNotification(message: string) {
  await invoke('show_tray_notification', { message });
}
```

**Step 5: Window Behavior**
```typescript
// src/hooks/useWindowBehavior.ts
import { getCurrentWindow } from '@tauri-apps/api/window';

export function useWindowBehavior() {
  useEffect(() => {
    const window = getCurrentWindow();

    // Minimize to tray instead of taskbar
    window.onCloseRequested(async (event) => {
      event.preventDefault();
      await window.hide();
    });
  }, []);
}
```

**Testing Checklist**
- [ ] Tray icon appears in system tray
- [ ] Click tray icon shows/hides window
- [ ] Right-click shows context menu
- [ ] Menu items trigger correct actions
- [ ] Minimize to tray works
- [ ] Quit from tray closes app
- [ ] Badge/notification updates work

---

### 1.2 Native Menu Bar

#### Use Case
Professional desktop apps have native menus. Provides:
- Familiar UX (File, Edit, View, Help)
- Keyboard shortcuts (Ctrl+N, Ctrl+S)
- Platform-native look and feel
- Accessibility (screen readers)

#### Implementation Plan

**Step 1: Define Menu Structure** (`src-tauri/src/menu.rs`)
```rust
use tauri::{Menu, MenuItem, Submenu};

pub fn create_app_menu() -> Menu {
    let file_menu = Submenu::new(
        "File",
        Menu::new()
            .add_native_item(MenuItem::new("New Library Item", "Ctrl+N"))
            .add_native_item(MenuItem::new("Export Library", "Ctrl+E"))
            .add_separator()
            .add_native_item(MenuItem::Quit)
    );

    let edit_menu = Submenu::new(
        "Edit",
        Menu::new()
            .add_native_item(MenuItem::Undo)
            .add_native_item(MenuItem::Redo)
            .add_separator()
            .add_native_item(MenuItem::Cut)
            .add_native_item(MenuItem::Copy)
            .add_native_item(MenuItem::Paste)
            .add_separator()
            .add_native_item(MenuItem::SelectAll)
    );

    let view_menu = Submenu::new(
        "View",
        Menu::new()
            .add_item(MenuItem::new("Library", "Ctrl+1"))
            .add_item(MenuItem::new("Discover", "Ctrl+2"))
            .add_item(MenuItem::new("Statistics", "Ctrl+3"))
            .add_separator()
            .add_item(MenuItem::new("Toggle Fullscreen", "F11"))
            .add_separator()
            .add_item(MenuItem::new("Actual Size", "Ctrl+0"))
            .add_item(MenuItem::new("Zoom In", "Ctrl++"))
            .add_item(MenuItem::new("Zoom Out", "Ctrl+-"))
    );

    let help_menu = Submenu::new(
        "Help",
        Menu::new()
            .add_item(MenuItem::new("Documentation", "F1"))
            .add_item(MenuItem::new("Keyboard Shortcuts", "Ctrl+/"))
            .add_separator()
            .add_item(MenuItem::new("Report Issue", ""))
            .add_item(MenuItem::new("Check for Updates", ""))
            .add_separator()
            .add_native_item(MenuItem::About("Watchfolio".to_string()))
    );

    Menu::new()
        .add_submenu(file_menu)
        .add_submenu(edit_menu)
        .add_submenu(view_menu)
        .add_submenu(help_menu)
}
```

**Step 2: Register Menu in App** (`src-tauri/src/lib.rs`)
```rust
mod menu;

.menu(menu::create_app_menu())
.on_menu_event(|event| {
    match event.menu_item_id() {
        "new_item" => {
            // Trigger new item modal
        }
        "export" => {
            // Trigger export dialog
        }
        "library" => {
            // Navigate to library
        }
        // ... handle other menu items
        _ => {}
    }
})
```

**Step 3: Frontend Event Handling** (`src/lib/tauri/menu.ts`)
```typescript
import { listen } from '@tauri-apps/api/event';

export function setupMenuListeners() {
  listen('menu:new-item', () => {
    // Open add media modal
  });

  listen('menu:export', () => {
    // Open export dialog
  });

  listen('menu:view-library', () => {
    // Navigate to /library
    window.location.href = '/library';
  });
}
```

**Step 4: Dynamic Menu Updates**
```rust
// Update menu based on app state
#[tauri::command]
fn update_menu_state(app: tauri::AppHandle, has_selection: bool) {
    // Enable/disable menu items based on state
}
```

**Testing Checklist**
- [ ] Menu bar appears on all platforms
- [ ] All menu items clickable
- [ ] Keyboard shortcuts work
- [ ] Menu updates based on app state
- [ ] Platform-specific menus (macOS app menu)
- [ ] Accessibility via keyboard navigation

---

### 1.3 Global Keyboard Shortcuts

#### Use Case
Power users love keyboard shortcuts that work system-wide:
- Quick capture from anywhere (Ctrl+Shift+W)
- Search library without opening app
- Quick status updates
- Productivity boost

#### Implementation Plan

**Step 1: Register Global Shortcuts** (`src-tauri/src/lib.rs`)
```rust
use tauri_plugin_global_shortcut::{GlobalShortcut, Shortcut};

.setup(|app| {
    // Quick add from anywhere
    app.handle().plugin(
        GlobalShortcut::new("Ctrl+Shift+W")
            .with_handler(|app| {
                // Show quick add window
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
                window.emit("quick-add", ()).unwrap();
            })
            .build()
    )?;

    // Global search
    app.handle().plugin(
        GlobalShortcut::new("Ctrl+Shift+F")
            .with_handler(|app| {
                // Show search window
            })
            .build()
    )?;

    Ok(())
})
```

**Step 2: Configurable Shortcuts** (`src/lib/tauri/shortcuts.ts`)
```typescript
import { invoke } from '@tauri-apps/api/core';

export interface ShortcutConfig {
  id: string;
  name: string;
  defaultShortcut: string;
  currentShortcut: string;
}

export async function registerShortcut(id: string, shortcut: string) {
  await invoke('register_global_shortcut', { id, shortcut });
}

export async function unregisterShortcut(id: string) {
  await invoke('unregister_global_shortcut', { id });
}

export async function getAllShortcuts(): Promise<ShortcutConfig[]> {
  return await invoke('get_all_shortcuts');
}
```

**Step 3: Settings UI** (`src/pages/settings/Shortcuts.tsx`)
```typescript
function ShortcutsSettings() {
  const [shortcuts, setShortcuts] = useState<ShortcutConfig[]>([]);

  const handleChangeShortcut = async (id: string, newShortcut: string) => {
    await registerShortcut(id, newShortcut);
    // Update UI
  };

  return (
    <div>
      <h2>Global Keyboard Shortcuts</h2>
      {shortcuts.map(shortcut => (
        <ShortcutInput
          key={shortcut.id}
          config={shortcut}
          onChange={handleChangeShortcut}
        />
      ))}
    </div>
  );
}
```

**Step 4: Conflict Detection**
```rust
#[tauri::command]
fn register_global_shortcut(
    app: tauri::AppHandle,
    id: String,
    shortcut: String
) -> Result<(), String> {
    // Check if shortcut is already registered
    // If conflict, return error
    // Otherwise, register
}
```

**Testing Checklist**
- [ ] Shortcuts work when app is in background
- [ ] Shortcuts work when app is minimized
- [ ] No conflicts with system shortcuts
- [ ] Settings UI shows all shortcuts
- [ ] Can customize shortcuts
- [ ] Shortcuts persist across restarts
- [ ] Works on Windows, macOS, Linux

---

### 1.4 File System Operations

#### Use Case
Desktop users expect file system integration:
- Export library to JSON/CSV
- Import from files
- Backup/restore
- Choose export location
- Drag & drop files

#### Implementation Plan

**Step 1: Export Functionality** (`src-tauri/src/commands/export.rs`)
```rust
use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Serialize, Deserialize)]
pub struct ExportOptions {
    pub format: String, // "json" | "csv"
    pub path: Option<String>,
    pub include_notes: bool,
    pub include_ratings: bool,
}

#[tauri::command]
pub async fn export_library(
    options: ExportOptions,
    data: String
) -> Result<String, String> {
    // Use native file dialog if no path provided
    let path = match options.path {
        Some(p) => p,
        None => {
            // Show save dialog
            use tauri_plugin_dialog::FileDialogBuilder;
            FileDialogBuilder::new()
                .set_title("Export Library")
                .add_filter("JSON", &["json"])
                .add_filter("CSV", &["csv"])
                .save_file()
                .await
                .ok_or("No file selected")?
        }
    };

    // Write file
    fs::write(&path, data)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(path)
}
```

**Step 2: Import Functionality**
```rust
#[tauri::command]
pub async fn import_library() -> Result<String, String> {
    use tauri_plugin_dialog::FileDialogBuilder;

    let path = FileDialogBuilder::new()
        .set_title("Import Library")
        .add_filter("JSON", &["json"])
        .add_filter("CSV", &["csv"])
        .pick_file()
        .await
        .ok_or("No file selected")?;

    let data = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    Ok(data)
}
```

**Step 3: Frontend Integration** (`src/hooks/useFileOperations.ts`)
```typescript
import { invoke } from '@tauri-apps/api/core';
import { isDesktop } from '@/lib/platform';

export function useFileOperations() {
  const exportLibrary = async (data: unknown, format: 'json' | 'csv') => {
    if (!isDesktop()) {
      // Fallback to web download
      downloadFile(data, format);
      return;
    }

    const jsonData = JSON.stringify(data, null, 2);
    const path = await invoke('export_library', {
      options: {
        format,
        path: null, // Will show dialog
        include_notes: true,
        include_ratings: true,
      },
      data: jsonData,
    });

    toast.success(`Exported to ${path}`);
  };

  const importLibrary = async () => {
    if (!isDesktop()) {
      // Fallback to web file input
      return;
    }

    const data = await invoke('import_library');
    return JSON.parse(data);
  };

  return { exportLibrary, importLibrary };
}
```

**Step 4: Backup/Restore**
```rust
#[tauri::command]
pub async fn create_backup(app: tauri::AppHandle) -> Result<String, String> {
    // Get app data directory
    let app_data = app.path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data dir")?;

    // Create backups folder
    let backup_dir = app_data.join("backups");
    fs::create_dir_all(&backup_dir)
        .map_err(|e| format!("Failed to create backup dir: {}", e))?;

    // Create timestamped backup
    let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
    let backup_path = backup_dir.join(format!("backup_{}.json", timestamp));

    // Copy RxDB data
    // ...

    Ok(backup_path.to_string_lossy().to_string())
}
```

**Testing Checklist**
- [ ] Export opens native file dialog
- [ ] Export creates valid JSON/CSV
- [ ] Import reads and parses files
- [ ] Backup creates timestamped files
- [ ] Restore recovers from backup
- [ ] Large files handled efficiently
- [ ] Error handling for permissions

---

### 1.5 Native Notifications

#### Use Case
Keep users informed even when app is in background:
- New episode released for tracked show
- Sync completed
- Friend activity (if social features added)
- Daily/weekly stats summary

#### Implementation Plan

**Step 1: Configure Permissions** (`src-tauri/tauri.conf.json`)
```json
{
  "plugins": {
    "notification": {
      "all": true
    }
  }
}
```

**Step 2: Rust Notification Helper** (`src-tauri/src/notifications.rs`)
```rust
use tauri_plugin_notification::{NotificationBuilder, NotificationHandle};

pub struct NotificationManager {
    app: tauri::AppHandle,
}

impl NotificationManager {
    pub fn new(app: tauri::AppHandle) -> Self {
        Self { app }
    }

    pub fn send_sync_complete(&self, items: usize) -> Result<(), String> {
        NotificationBuilder::new()
            .title("Sync Complete")
            .body(format!("Synced {} items", items))
            .icon("sync-icon")
            .show(&self.app)
            .map_err(|e| format!("Failed to show notification: {}", e))?;
        Ok(())
    }

    pub fn send_new_episode(&self, show: &str, episode: &str) -> Result<(), String> {
        NotificationBuilder::new()
            .title(format!("New Episode: {}", show))
            .body(episode)
            .icon("tv-icon")
            .action("view", "View Now")
            .show(&self.app)
            .map_err(|e| format!("Failed to show notification: {}", e))?;
        Ok(())
    }
}
```

**Step 3: Frontend Integration** (`src/lib/tauri/notifications.ts`)
```typescript
import { isDesktop } from '@/lib/platform';
import { sendNotification } from '@tauri-apps/plugin-notification';

export async function notifySyncComplete(count: number) {
  if (isDesktop()) {
    await sendNotification({
      title: 'Sync Complete',
      body: `Synced ${count} items`,
      icon: 'sync',
    });
  } else {
    // Fallback to web notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Sync Complete', {
        body: `Synced ${count} items`,
      });
    }
  }
}
```

**Step 4: Notification Preferences** (`src/stores/usePreferencesStore.ts`)
```typescript
interface NotificationPreferences {
  enabled: boolean;
  syncComplete: boolean;
  newEpisodes: boolean;
  weeklyStats: boolean;
  friendActivity: boolean;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  notifications: {
    enabled: true,
    syncComplete: true,
    newEpisodes: true,
    weeklyStats: false,
    friendActivity: false,
  },
  // ...
}));
```

**Step 5: Background Notifications**
```rust
// Schedule periodic checks
use tauri::async_runtime;

pub fn start_background_tasks(app: tauri::AppHandle) {
    async_runtime::spawn(async move {
        let mut interval = tokio::time::interval(
            tokio::time::Duration::from_secs(3600) // Every hour
        );

        loop {
            interval.tick().await;
            // Check for new episodes
            // Send notifications if found
        }
    });
}
```

**Testing Checklist**
- [ ] Notifications appear in system notification center
- [ ] Click notification focuses app
- [ ] Action buttons work (if supported)
- [ ] Respects user preferences
- [ ] Works when app is minimized
- [ ] Works when app is closed (background tasks)
- [ ] Platform-specific styling (Windows, macOS, Linux)

---

### 1.6 Deep Linking

#### Use Case
Allow external apps and websites to open Watchfolio:
- `watchfolio://media/movie/123` - Open specific movie
- `watchfolio://search?q=inception` - Search for media
- `watchfolio://add?tmdb=550` - Quick add from browser extension
- Share links between users

#### Implementation Plan

**Step 1: Register URL Scheme** (`src-tauri/tauri.conf.json`)
```json
{
  "plugins": {
    "deepLink": {
      "schemes": ["watchfolio"]
    }
  }
}
```

**Step 2: Handle Deep Links** (`src-tauri/src/deep_link.rs`)
```rust
use tauri_plugin_deep_link;

pub fn setup_deep_link(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    tauri_plugin_deep_link::register("watchfolio", move |request| {
        let url = request.url();

        // Parse URL
        match url.path() {
            "/media/movie" => {
                // Extract TMDB ID from query
                // Open movie details
            }
            "/media/tv" => {
                // Open TV show details
            }
            "/search" => {
                // Open search with query
            }
            "/add" => {
                // Quick add modal
            }
            _ => {
                // Default: open app
            }
        }
    })?;

    Ok(())
}
```

**Step 3: Frontend Router Integration** (`src/router.tsx`)
```typescript
import { listen } from '@tauri-apps/api/event';

// Listen for deep link events
if (isTauri()) {
  listen<string>('deep-link', (event) => {
    const url = new URL(event.payload);

    // Parse and navigate
    if (url.pathname.startsWith('/media/')) {
      const [_, type, id] = url.pathname.split('/');
      router.navigate(`/media/${type}/${id}`);
    } else if (url.pathname === '/search') {
      const query = url.searchParams.get('q');
      router.navigate(`/discover?q=${query}`);
    }
  });
}
```

**Step 4: Share Functionality**
```typescript
export function useShare() {
  const shareMedia = async (media: LibraryMedia) => {
    const url = `watchfolio://media/${media.media_type}/${media.tmdbId}`;

    if (isDesktop()) {
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } else {
      // Web share API
      await navigator.share({
        title: media.title,
        url: url,
      });
    }
  };

  return { shareMedia };
}
```

**Testing Checklist**
- [ ] URL scheme registered in OS
- [ ] Clicking `watchfolio://` links opens app
- [ ] Deep links navigate to correct page
- [ ] Works when app is closed (launches app)
- [ ] Works when app is running (focuses and navigates)
- [ ] Invalid URLs handled gracefully
- [ ] Browser extension integration works

---

### 1.7 Auto-Update Mechanism

#### Use Case
Keep users on latest version automatically:
- Bug fixes delivered quickly
- New features without manual download
- Security patches
- Professional app experience

#### Implementation Plan

**Step 1: Add Updater Plugin** (`src-tauri/Cargo.toml`)
```toml
[dependencies]
tauri-plugin-updater = "2"
```

**Step 2: Configure Updater** (`src-tauri/tauri.conf.json`)
```json
{
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.watchfolio.app/{{target}}/{{current_version}}"
      ],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY_HERE"
    }
  }
}
```

**Step 3: Update Check Logic** (`src-tauri/src/updater.rs`)
```rust
use tauri_plugin_updater::{UpdaterExt, UpdateStatus};

pub async fn check_for_updates(app: tauri::AppHandle) -> Result<(), String> {
    let updater = app.updater();

    match updater.check().await {
        Ok(Some(update)) => {
            println!("Update available: {}", update.version);

            // Download and install
            update.download_and_install(|progress| {
                println!("Progress: {}%", progress);
            }).await?;

            // Prompt restart
            Ok(())
        }
        Ok(None) => {
            println!("App is up to date");
            Ok(())
        }
        Err(e) => Err(format!("Failed to check for updates: {}", e))
    }
}
```

**Step 4: Scheduled Update Checks**
```rust
pub fn start_update_checker(app: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        let mut interval = tokio::time::interval(
            tokio::time::Duration::from_secs(86400) // Daily
        );

        loop {
            interval.tick().await;
            let _ = check_for_updates(app.clone()).await;
        }
    });
}
```

**Step 5: Manual Update Check** (`src/components/settings/UpdateSection.tsx`)
```typescript
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

function UpdateSection() {
  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = async () => {
    setChecking(true);
    try {
      const update = await check();
      if (update) {
        setUpdateAvailable(true);
        // Download and install
        await update.downloadAndInstall();
        // Prompt restart
        await relaunch();
      } else {
        toast.success('You are on the latest version');
      }
    } catch (error) {
      toast.error('Failed to check for updates');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <h3>Updates</h3>
      <Button onClick={checkForUpdates} loading={checking}>
        Check for Updates
      </Button>
    </div>
  );
}
```

**Step 6: Release Server Setup**
```
# Create release server endpoint
# Structure:
releases.watchfolio.app/
  ├── windows-x86_64/
  │   ├── 1.0.0/
  │   │   ├── latest.json
  │   │   └── watchfolio-1.0.0-setup.exe
  │   └── 1.0.1/
  ├── darwin-x86_64/
  │   ├── 1.0.0/
  │   │   ├── latest.json
  │   │   └── watchfolio-1.0.0.dmg
  └── linux-x86_64/
      └── ...
```

**Step 7: Signing Updates**
```bash
# Generate key pair
tauri signer generate -w ~/.tauri/watchfolio.key

# Sign update
tauri signer sign /path/to/update.exe --private-key ~/.tauri/watchfolio.key
```

**Testing Checklist**
- [ ] Manual update check works
- [ ] Automatic daily check works
- [ ] Download progress shown
- [ ] Installation completes successfully
- [ ] App restarts after update
- [ ] Rollback works if update fails
- [ ] Signature verification works
- [ ] Works on all platforms

---

## Phase 2: Mobile Implementation

**Timeline**: 3-4 weeks
**Priority**: Medium
**Platforms**: iOS, Android

### 2.1 Mobile Environment Setup

#### Use Case
Enable development and testing of mobile apps on iOS and Android.

#### Implementation Plan

**Step 1: Install Android Requirements**
```bash
# Download Android Studio from https://developer.android.com/studio
# Install Android SDK
# Install Android NDK
# Set environment variables
export ANDROID_HOME=$HOME/Android/Sdk
export NDK_HOME=$ANDROID_HOME/ndk/25.0.8775105
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Step 2: Install iOS Requirements (macOS only)**
```bash
# Install Xcode from App Store
# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods
```

**Step 3: Initialize Tauri Mobile**
```bash
# Android
pnpm tauri android init

# iOS
pnpm tauri ios init
```

**Step 4: Configure Mobile Targets** (`src-tauri/gen/android/app/build.gradle`)
```gradle
android {
    compileSdkVersion 33
    defaultConfig {
        applicationId "com.watchfolio.app"
        minSdkVersion 24
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
}
```

**Step 5: Test on Emulator**
```bash
# Start Android emulator
pnpm tauri android dev

# Start iOS simulator (macOS)
pnpm tauri ios dev
```

**Testing Checklist**
- [ ] Android emulator launches
- [ ] iOS simulator launches (if macOS)
- [ ] App loads on emulator
- [ ] Hot reload works
- [ ] Can interact with app
- [ ] Logs visible in terminal

---

### 2.2 Mobile UI Adaptations

#### Use Case
Optimize UI for touch interfaces and smaller screens:
- Touch targets (44x44pt minimum)
- Bottom navigation (thumb-friendly)
- Pull-to-refresh
- Swipe gestures
- Mobile-optimized modals

#### Implementation Plan

**Step 1: Responsive Breakpoints** (`tailwind.config.ts`)
```typescript
// Already mobile-first, but add specific mobile checks
export const breakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
};
```

**Step 2: Platform-Specific Components** (`src/components/mobile/`)
```typescript
// BottomNav.tsx
export function BottomNav() {
  const { isMobile } = usePlatform();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around py-2">
        <NavItem icon={Home} label="Library" to="/library" />
        <NavItem icon={Search} label="Discover" to="/discover" />
        <NavItem icon={Plus} label="Add" to="/add" />
        <NavItem icon={BarChart} label="Stats" to="/statistics" />
        <NavItem icon={User} label="Profile" to="/profile" />
      </div>
    </nav>
  );
}
```

**Step 3: Touch-Optimized Interactions**
```typescript
// src/components/mobile/SwipeableCard.tsx
import { useLongPress } from 'use-long-press';

export function SwipeableCard({ media }: { media: LibraryMedia }) {
  const bind = useLongPress(() => {
    // Show context menu
  });

  return (
    <motion.div
      {...bind()}
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) {
          // Swipe right action
        } else if (info.offset.x < -100) {
          // Swipe left action
        }
      }}
    >
      <MediaCard media={media} />
    </motion.div>
  );
}
```

**Step 4: Mobile Modals** (Using Vaul - already installed)
```typescript
// Already using Vaul for bottom sheets
// Ensure all modals use drawer on mobile
import { Drawer } from 'vaul';
import { usePlatform } from '@/hooks/usePlatform';

export function Modal({ children }: { children: React.ReactNode }) {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerContent>{children}</DrawerContent>
      </Drawer>
    );
  }

  return <Dialog>{children}</Dialog>;
}
```

**Step 5: Pull-to-Refresh**
```typescript
// src/hooks/usePullToRefresh.ts
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false);
  const { isMobile } = usePlatform();

  useEffect(() => {
    if (!isMobile) return;

    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 100 && window.scrollY === 0) {
        setIsPulling(true);
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling) {
        await onRefresh();
        setIsPulling(false);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isPulling, onRefresh]);

  return { isPulling };
}
```

**Testing Checklist**
- [ ] All touch targets at least 44x44pt
- [ ] Bottom nav accessible with thumb
- [ ] Swipe gestures work smoothly
- [ ] Pull-to-refresh triggers
- [ ] Modals slide from bottom
- [ ] No horizontal scroll
- [ ] Safe area respected (notches)

---

### 2.3 Mobile-Specific Features

#### Use Case
Leverage native mobile capabilities:
- Haptic feedback for better UX
- Biometric authentication
- Share sheet integration
- Camera access (future: barcode scanning)
- Native gestures

#### Implementation Plan

**Step 1: Haptic Feedback** (Already implemented in `src/lib/tauri/mobile.ts`)
```typescript
// Enhance existing implementation
import { invoke } from '@tauri-apps/api/core';

export async function triggerHaptic(
  type: 'selection' | 'impact' | 'notification',
  intensity: 'light' | 'medium' | 'heavy' = 'medium'
) {
  if (!isMobile()) return;

  try {
    await invoke('trigger_haptic', { type, intensity });
  } catch {
    // Fallback to web vibration
    const duration = intensity === 'light' ? 10 : intensity === 'medium' ? 20 : 50;
    navigator.vibrate?.(duration);
  }
}

// Use in UI
export function MediaCard({ media }: { media: LibraryMedia }) {
  const handleFavorite = () => {
    triggerHaptic('impact', 'light');
    toggleFavorite(media.id);
  };

  return (
    <button onClick={handleFavorite}>
      <Heart />
    </button>
  );
}
```

**Step 2: Biometric Authentication** (`src-tauri/src/mobile/biometrics.rs`)
```rust
#[cfg(any(target_os = "ios", target_os = "android"))]
use tauri_plugin_biometric;

#[tauri::command]
async fn authenticate_biometric() -> Result<bool, String> {
    #[cfg(target_os = "ios")]
    {
        // Use Face ID / Touch ID
        use tauri_plugin_biometric::BiometricAuth;
        BiometricAuth::authenticate("Unlock Watchfolio")
            .await
            .map_err(|e| e.to_string())
    }

    #[cfg(target_os = "android")]
    {
        // Use Fingerprint / Face Unlock
        use tauri_plugin_biometric::BiometricAuth;
        BiometricAuth::authenticate("Unlock Watchfolio")
            .await
            .map_err(|e| e.to_string())
    }

    #[cfg(not(any(target_os = "ios", target_os = "android")))]
    Err("Biometrics not supported".to_string())
}
```

**Step 3: Frontend Biometric Integration**
```typescript
// src/hooks/useBiometricAuth.ts
import { invoke } from '@tauri-apps/api/core';

export function useBiometricAuth() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (isMobile()) {
      invoke<boolean>('is_biometric_available').then(setAvailable);
    }
  }, []);

  const authenticate = async (): Promise<boolean> => {
    try {
      return await invoke('authenticate_biometric');
    } catch {
      return false;
    }
  };

  return { available, authenticate };
}

// Usage in Login
function Login() {
  const { available, authenticate } = useBiometricAuth();

  const handleBiometricLogin = async () => {
    const success = await authenticate();
    if (success) {
      // Log in user
    }
  };

  return (
    <>
      <PasswordInput />
      {available && (
        <Button onClick={handleBiometricLogin}>
          <Fingerprint /> Use Biometric
        </Button>
      )}
    </>
  );
}
```

**Step 4: Share Sheet Integration**
```rust
#[tauri::command]
async fn share_media(title: String, url: String) -> Result<(), String> {
    #[cfg(any(target_os = "ios", target_os = "android"))]
    {
        use tauri_plugin_share;
        tauri_plugin_share::share(title, url)
            .await
            .map_err(|e| e.to_string())
    }

    #[cfg(not(any(target_os = "ios", target_os = "android")))]
    Err("Share not supported".to_string())
}
```

**Step 5: Camera Access (Future)**
```rust
#[tauri::command]
async fn scan_barcode() -> Result<String, String> {
    #[cfg(any(target_os = "ios", target_os = "android"))]
    {
        use tauri_plugin_camera;
        let barcode = tauri_plugin_camera::scan_barcode()
            .await
            .map_err(|e| e.to_string())?;
        Ok(barcode)
    }

    #[cfg(not(any(target_os = "ios", target_os = "android")))]
    Err("Camera not supported".to_string())
}
```

**Testing Checklist**
- [ ] Haptic feedback on button presses
- [ ] Haptic feedback on swipe actions
- [ ] Biometric auth available on compatible devices
- [ ] Biometric auth works for login
- [ ] Share sheet opens with correct content
- [ ] Camera permission requested
- [ ] Barcode scanning works (if implemented)

---

### 2.4 Mobile Build & Testing

#### Use Case
Build production-ready mobile apps for distribution.

#### Implementation Plan

**Step 1: Configure App Icons**
```
src-tauri/icons/
  ├── icon.png (1024x1024 source)
  ├── android/
  │   ├── mipmap-mdpi/ic_launcher.png (48x48)
  │   ├── mipmap-hdpi/ic_launcher.png (72x72)
  │   ├── mipmap-xhdpi/ic_launcher.png (96x96)
  │   ├── mipmap-xxhdpi/ic_launcher.png (144x144)
  │   └── mipmap-xxxhdpi/ic_launcher.png (192x192)
  └── ios/
      └── AppIcon.appiconset/
```

**Step 2: Configure Splash Screens**
```xml
<!-- src-tauri/gen/android/app/src/main/res/values/styles.xml -->
<resources>
  <style name="SplashTheme" parent="Theme.AppCompat.NoActionBar">
    <item name="android:windowBackground">@drawable/splash</item>
  </style>
</resources>
```

**Step 3: Build for Production**
```bash
# Android - Build APK
pnpm tauri:build:android

# Android - Build AAB (for Play Store)
cd src-tauri/gen/android
./gradlew bundleRelease

# iOS - Build IPA
pnpm tauri:build:ios
```

**Step 4: Code Signing**

**Android:**
```bash
# Generate keystore
keytool -genkey -v -keystore watchfolio.keystore \
  -alias watchfolio -keyalg RSA -keysize 2048 -validity 10000

# Configure in build.gradle
signingConfigs {
  release {
    storeFile file("watchfolio.keystore")
    storePassword System.getenv("KEYSTORE_PASSWORD")
    keyAlias "watchfolio"
    keyPassword System.getenv("KEY_PASSWORD")
  }
}
```

**iOS:**
```bash
# Requires Apple Developer Account
# 1. Create App ID in Apple Developer Portal
# 2. Create Distribution Certificate
# 3. Create Provisioning Profile
# 4. Configure in Xcode
```

**Step 5: Testing on Physical Devices**
```bash
# Android - via USB
adb devices
pnpm tauri android dev --device

# iOS - via USB
xcrun xctrace list devices
pnpm tauri ios dev --device "iPhone"
```

**Testing Checklist**
- [ ] APK installs on Android device
- [ ] IPA installs on iOS device (TestFlight)
- [ ] App launches successfully
- [ ] All features work on mobile
- [ ] Performance acceptable
- [ ] Battery usage reasonable
- [ ] No crashes or ANRs
- [ ] Offline mode works

---

## Phase 3: Platform-Specific Features

**Timeline**: 2-3 weeks
**Priority**: Low-Medium

### 3.1 Windows-Specific Features

#### Use Case
Leverage Windows platform capabilities for better integration.

#### Features to Implement

**1. Windows 11 Snap Layouts**
- App participates in Windows 11 snap layouts
- Custom snap positions

**2. Windows Notifications**
- Rich notifications with images
- Notification actions (Mark as Watched, View Details)
- Notification center integration

**3. Windows Taskbar Integration**
- Jump list with recent items
- Progress bar for sync
- Thumbnail toolbar buttons

**4. Windows Store Distribution**
- MSIX packaging
- Windows Store submission
- Auto-updates via Store

#### Implementation
```rust
#[cfg(target_os = "windows")]
mod windows_integration {
    use windows::Win32::UI::Shell;

    pub fn add_jump_list_items() {
        // Add recent library items to jump list
    }

    pub fn set_taskbar_progress(progress: f32) {
        // Show sync progress in taskbar
    }
}
```

---

### 3.2 macOS-Specific Features

#### Use Case
Match macOS design language and capabilities.

#### Features to Implement

**1. macOS Menu Bar**
- Native macOS menu structure
- macOS keyboard shortcuts (⌘ instead of Ctrl)

**2. Touch Bar Support**
- Quick actions in Touch Bar
- Media controls

**3. Widgets (macOS 14+)**
- Library stats widget
- Currently watching widget

**4. App Store Distribution**
- Notarization
- App Store submission
- Sandboxing compliance

#### Implementation
```rust
#[cfg(target_os = "macos")]
mod macos_integration {
    use cocoa::appkit;

    pub fn setup_touch_bar() {
        // Configure Touch Bar items
    }

    pub fn create_widget() {
        // Create WidgetKit widget
    }
}
```

---

### 3.3 Linux-Specific Features

#### Use Case
Support various Linux desktop environments.

#### Features to Implement

**1. Multi-Distribution Packages**
- DEB (Debian, Ubuntu)
- RPM (Fedora, RedHat)
- AppImage (Universal)
- Flatpak (Flathub)
- Snap (Snapcraft)

**2. Desktop Integration**
- .desktop file
- Icon theme integration
- MIME type associations

**3. Distribution via Package Managers**
- AUR (Arch User Repository)
- Flathub
- Snapcraft Store

#### Implementation
```toml
# src-tauri/tauri.conf.json
{
  "bundle": {
    "deb": {
      "depends": ["libwebkit2gtk-4.0-37"]
    },
    "rpm": {
      "depends": ["webkit2gtk3"]
    }
  }
}
```

---

## Phase 4: Distribution & Deployment

**Timeline**: 2-3 weeks
**Priority**: High (before public release)

### 4.1 App Store Preparation

#### Desktop Stores

**Microsoft Store (Windows)**
- Create Microsoft Partner Center account
- Prepare MSIX package
- Create store listing
- Submit for review
- Plan: 1 week

**Mac App Store (macOS)**
- Create Apple Developer account ($99/year)
- Code signing certificate
- App sandbox compliance
- Create store listing
- Submit for review
- Plan: 2 weeks (review process)

**Flathub (Linux)**
- Create Flatpak manifest
- Submit to Flathub repository
- Community review
- Plan: 1 week

#### Mobile Stores

**Google Play Store (Android)**
- Create Google Play Console account ($25 one-time)
- Prepare AAB bundle
- Create store listing:
  - Screenshots (phone, tablet)
  - Feature graphic
  - App description
  - Privacy policy
- Submit for review
- Plan: 1 week

**Apple App Store (iOS)**
- Apple Developer account required ($99/year)
- TestFlight beta testing
- App Store Connect listing:
  - Screenshots (multiple devices)
  - App preview video
  - Description
  - Privacy policy
- Submit for review (7-14 days)
- Plan: 2-3 weeks

---

### 4.2 Branding & Assets

#### App Icons

**Requirements:**
- 1024x1024 master icon (PNG, no transparency)
- Platform-specific sizes auto-generated

**Design Guidelines:**
- Simple, recognizable
- Works at small sizes (16x16)
- Matches Watchfolio brand colors
- No text (except logo)

**Tools:**
- Figma/Sketch for design
- `tauri icon` command for generation

#### Screenshots

**Desktop (1280x800):**
- Library view with items
- Movie details page
- Statistics dashboard
- Search/discover
- Settings

**Mobile (1080x1920 for Android, various for iOS):**
- Portrait orientation
- Bottom nav visible
- Touch-optimized UI
- Feature highlights

**Tool:** Playwright for automated screenshots

#### Marketing Materials

**Required:**
- Feature graphic (1024x500 for Play Store)
- Promotional images
- App description (short & long)
- Keywords/tags
- Privacy policy
- Terms of service

---

### 4.3 Code Signing & Security

#### Windows Code Signing

**Requirements:**
- EV Code Signing Certificate ($300-500/year)
- Or: Standard Code Signing Certificate ($100-200/year)

**Provider Options:**
- DigiCert
- Sectigo
- SSL.com

**Process:**
```bash
# Sign executable
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com watchfolio.exe
```

#### macOS Code Signing

**Requirements:**
- Apple Developer account
- Developer ID Application Certificate
- Developer ID Installer Certificate

**Process:**
```bash
# Sign app
codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name" Watchfolio.app

# Notarize
xcrun notarytool submit Watchfolio.dmg --keychain-profile "notary"
```

#### Android Signing

**Process:**
```bash
# Already configured in build.gradle
# Uses keystore created earlier
./gradlew assembleRelease
```

#### iOS Signing

**Process:**
- Managed by Xcode
- Requires provisioning profile
- Automatic signing recommended

---

### 4.4 CI/CD Pipeline

#### Use Case
Automate building, testing, and releasing for all platforms.

#### Implementation Plan

**GitHub Actions Workflow** (`.github/workflows/release.yml`)
```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-desktop:
    strategy:
      matrix:
        platform: [windows-latest, macos-latest, ubuntu-latest]
    runs-on: ${{ matrix.platform }}

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable

      - name: Install dependencies
        run: pnpm install

      - name: Build desktop app
        run: pnpm tauri:build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.platform }}-build
          path: src-tauri/target/release/bundle/*

  build-android:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Android SDK
        uses: android-actions/setup-android@v2

      - name: Build Android APK
        run: pnpm tauri:build:android

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: android-build
          path: src-tauri/gen/android/app/build/outputs/apk/release/*.apk

  build-ios:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: latest

      - name: Build iOS IPA
        run: pnpm tauri:build:ios

      - name: Upload IPA
        uses: actions/upload-artifact@v3
        with:
          name: ios-build
          path: src-tauri/gen/ios/build/*.ipa

  create-release:
    needs: [build-desktop, build-android, build-ios]
    runs-on: ubuntu-latest

    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v3

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            windows-latest-build/*
            macos-latest-build/*
            ubuntu-latest-build/*
            android-build/*
            ios-build/*
          generate_release_notes: true

      - name: Deploy to update server
        run: |
          # Upload to releases.watchfolio.app
          # Update latest.json for auto-updater
```

**Testing Checklist:**
- [ ] CI builds all platforms successfully
- [ ] Artifacts uploaded correctly
- [ ] Release created on tag push
- [ ] Auto-updater detects new version
- [ ] Downloads work from release page

---

### 4.5 Distribution Channels

#### Direct Download
- Host installers on watchfolio.app/download
- Separate pages for each platform
- Auto-detect user's OS
- Provide direct download links

**Web Page Structure:**
```
/download
  ├── Windows (MSI, EXE)
  ├── macOS (DMG)
  ├── Linux (AppImage, DEB, RPM)
  ├── Android (APK)
  └── iOS (TestFlight link, later App Store)
```

#### Package Managers

**Desktop:**
- Chocolatey (Windows): `choco install watchfolio`
- Homebrew (macOS): `brew install --cask watchfolio`
- Snap (Linux): `snap install watchfolio`
- Flatpak (Linux): `flatpak install watchfolio`

**Mobile:**
- Google Play Store
- Apple App Store
- F-Droid (if open source)

---

## Phase 5: Maintenance & Updates

### 5.1 Update Strategy

**Release Cycle:**
- **Major updates** (1.0, 2.0): Every 6-12 months
- **Minor updates** (1.1, 1.2): Every 1-2 months
- **Patch updates** (1.0.1): As needed for bugs

**Beta Channel:**
- TestFlight for iOS
- Google Play beta track for Android
- GitHub pre-releases for desktop

**Version Numbering:**
- Semantic versioning (MAJOR.MINOR.PATCH)
- Consistent across all platforms

---

### 5.2 Crash Reporting

**Integration:** Sentry or similar

```typescript
// src/lib/crashReporting.ts
import * as Sentry from '@sentry/browser';
import { isTauri, getPlatform } from '@/lib/platform';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: `watchfolio@${import.meta.env.VITE_APP_VERSION}`,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  beforeSend(event) {
    // Add platform context
    event.contexts = {
      ...event.contexts,
      platform: {
        type: getPlatform(),
        tauri: isTauri(),
      },
    };
    return event;
  },
});
```

---

### 5.3 Analytics

**Respect Privacy:**
- No tracking without consent
- Anonymous usage stats
- Opt-in analytics

**Metrics to Track:**
- Daily/monthly active users
- Feature usage
- Platform distribution
- Crash-free rate
- Performance metrics

**Tool:** Plausible or Umami (privacy-focused)

---

## Technical Architecture

### Platform Detection Flow

```
App Startup
    ↓
Check environment (window.__TAURI__)
    ↓
├─ Web ──→ Standard web features
├─ Desktop ──→ Initialize desktop features
│            ├─ System tray
│            ├─ Native menu
│            ├─ Global shortcuts
│            └─ File system access
└─ Mobile ──→ Initialize mobile features
             ├─ Bottom navigation
             ├─ Haptic feedback
             ├─ Biometrics
             └─ Share sheet
```

### Data Sync Architecture

```
RxDB (Local)
    ↕ (Replication)
Appwrite (Cloud)
    ↕
Other Devices (Web/Desktop/Mobile)
```

**Key Points:**
- Same sync logic across all platforms
- Offline-first on all platforms
- Desktop gets faster RxDB performance
- Mobile handles intermittent connectivity

### Build System

```
Source Code (TypeScript + React)
    ↓
Vite Build (dist/)
    ↓
    ├─ Web ──→ Netlify
    ├─ Desktop ──→ Tauri Build
    │              ├─ Windows MSI/EXE
    │              ├─ macOS DMG
    │              └─ Linux AppImage/DEB/RPM
    └─ Mobile ──→ Tauri Mobile Build
                   ├─ Android APK/AAB
                   └─ iOS IPA
```

---

## Testing Strategy

### Manual Testing Checklist

**Desktop (per platform):**
- [ ] App launches
- [ ] Window can be resized
- [ ] Minimize/maximize works
- [ ] System tray works
- [ ] Native menus work
- [ ] Global shortcuts work
- [ ] File dialogs work
- [ ] Notifications work
- [ ] Deep linking works
- [ ] Auto-update works
- [ ] All app features work
- [ ] Offline mode works
- [ ] Sync works

**Mobile (per platform):**
- [ ] App launches
- [ ] Touch targets adequate
- [ ] Bottom nav works
- [ ] Swipe gestures work
- [ ] Pull-to-refresh works
- [ ] Haptic feedback works
- [ ] Biometric auth works (if available)
- [ ] Share sheet works
- [ ] Notifications work
- [ ] All app features work
- [ ] Offline mode works
- [ ] Sync works
- [ ] Battery usage acceptable

### Automated Testing

**Unit Tests:**
- Platform detection utilities
- Tauri command wrappers
- Business logic

**Integration Tests:**
- RxDB sync across platforms
- File operations
- Deep linking

**E2E Tests (Playwright):**
- Critical user flows
- Desktop window management
- Mobile navigation

---

## Success Metrics

### Adoption Metrics
- **Target:** 10,000 total downloads in first 3 months
- Desktop: 60% of downloads
- Mobile: 40% of downloads

### Quality Metrics
- **Crash-free rate:** >99%
- **App store rating:** >4.5 stars
- **Review response time:** <24 hours

### Performance Metrics
- **Desktop startup:** <2 seconds
- **Mobile startup:** <3 seconds
- **Sync time:** <5 seconds for 100 items

### User Retention
- **Day 1:** 60%
- **Day 7:** 40%
- **Day 30:** 25%

---

## Appendix: Commands Reference

### Development
```bash
# Web
pnpm dev

# Desktop
pnpm tauri:dev

# Android
pnpm tauri:dev:android

# iOS
pnpm tauri:dev:ios
```

### Production Builds
```bash
# Desktop (current platform)
pnpm tauri:build

# Android APK
pnpm tauri:build:android

# iOS IPA
pnpm tauri:build:ios
```

### Maintenance
```bash
# Update Rust
rustup update

# Update Tauri
pnpm update @tauri-apps/cli @tauri-apps/api

# Clean build
cd src-tauri && cargo clean
```

---

## Timeline Summary

| Phase | Duration | Priority | Deliverables |
|-------|----------|----------|--------------|
| Phase 1: Desktop Enhancement | 2-3 weeks | High | System tray, native menus, shortcuts, file ops, notifications, deep linking, auto-update |
| Phase 2: Mobile Implementation | 3-4 weeks | Medium | Android/iOS apps, mobile UI, mobile features, builds |
| Phase 3: Platform-Specific | 2-3 weeks | Low-Medium | Windows/macOS/Linux specific features |
| Phase 4: Distribution | 2-3 weeks | High | App stores, CI/CD, branding, signing |
| Phase 5: Maintenance | Ongoing | High | Updates, crash reporting, analytics |

**Total Estimated Time:** 9-13 weeks (2-3 months)

---

## Risk Assessment

### Technical Risks
- **Tauri Mobile Stability:** Tauri 2.x mobile is relatively new
  - *Mitigation:* Test extensively, have fallback to web app

- **Code Signing Complexity:** Certificates and notarization can be tricky
  - *Mitigation:* Allocate extra time, use CI/CD for consistency

- **Platform Fragmentation:** Different OS versions, screen sizes
  - *Mitigation:* Focus on latest OS versions, responsive design

### Business Risks
- **App Store Approval:** Rejection possible
  - *Mitigation:* Follow guidelines strictly, prepare for resubmission

- **Maintenance Burden:** Supporting 5+ platforms is complex
  - *Mitigation:* Shared codebase, automated testing, good monitoring

### User Risks
- **Adoption:** Users may prefer web app
  - *Mitigation:* Highlight native app benefits, soft launch to gather feedback

---

## Next Steps

**Immediate (This Week):**
1. Test production desktop build
2. Start implementing system tray
3. Create app icons

**Short-term (Next 2 Weeks):**
1. Complete desktop enhancement (Phase 1)
2. Set up Android development environment
3. Test desktop builds on all platforms

**Medium-term (Next Month):**
1. Initialize mobile targets
2. Implement mobile UI adaptations
3. Begin app store preparation

**Long-term (Next 2-3 Months):**
1. Complete all phases
2. Launch beta programs
3. Submit to app stores
4. Public release

---

**Document Version:** 1.0
**Last Updated:** 2025-10-03
**Maintained by:** Watchfolio Development Team
