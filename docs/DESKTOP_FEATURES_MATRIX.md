# Watchfolio Desktop Features - Comprehensive Matrix & Roadmap

> **Last Updated:** October 19, 2025
> **Version:** 1.0
> **Status:** Living Document

## Table of Contents

1. [Overview](#overview)
2. [Legend & Metrics](#legend--metrics)
3. [Current Implementation Status](#current-implementation-status)
4. [Feature Categories](#feature-categories)
   - [Core System Integration](#category-1-core-system-integration)
   - [Window Management](#category-2-window-management)
   - [Notifications & Alerts](#category-3-notifications--alerts)
   - [File & Data Management](#category-4-file--data-management)
   - [URL & Protocol Handling](#category-5-url--protocol-handling)
   - [Shortcuts & Quick Actions](#category-6-shortcuts--quick-actions)
   - [Tray & Menu Enhancements](#category-7-tray--menu-enhancements)
   - [Performance & Optimization](#category-8-performance--optimization)
   - [Security & Privacy](#category-9-security--privacy)
   - [Installer & Distribution](#category-10-installer--distribution)
   - [Accessibility](#category-11-accessibility)
   - [Advanced Features](#category-12-advanced-features)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Platform Support Matrix](#platform-support-matrix)
7. [Decision Framework](#decision-framework)
8. [Technical Dependencies](#technical-dependencies)
9. [Resources & References](#resources--references)

---

## Overview

This document provides a comprehensive analysis of all potential desktop features for Watchfolio. Each feature is evaluated across multiple dimensions to inform prioritization and implementation decisions.

### Philosophy

Watchfolio's desktop implementation follows these principles:

1. **Native First:** Leverage platform capabilities over web-based solutions
2. **Performance Conscious:** Minimize resource usage for always-running app
3. **User Agency:** Provide controls, don't impose behavior
4. **Graceful Degradation:** Features should enhance but not break core functionality
5. **Cross-Platform Parity:** Maintain feature consistency across Windows/macOS/Linux where possible

---

## Legend & Metrics

### Priority Levels

| Symbol | Level | Criteria |
|--------|-------|----------|
| 🔴 | **Critical** | Blocker for release, security issue, or platform requirement |
| 🟠 | **High** | Significant user value, competitive parity, or common request |
| 🟡 | **Medium** | Nice-to-have improvement, secondary workflow enhancement |
| 🟢 | **Low** | Edge case, experimental, or power-user feature |

### Implementation Difficulty

| Symbol | Level | Estimated Hours | Factors |
|--------|-------|----------------|---------|
| 🟢 | **Easy** | 0.25h - 2h | Config change, simple API call, existing pattern |
| 🟡 | **Medium** | 2h - 8h | New component, integration work, moderate testing |
| 🔴 | **Hard** | 8h+ | Architecture changes, external dependencies, complex edge cases |

### Status Indicators

| Symbol | Status | Meaning |
|--------|--------|---------|
| ✅ | **Done** | Fully implemented and tested |
| 🚧 | **Partial** | Partially implemented or needs enhancement |
| ❌ | **Missing** | Not yet implemented |
| 🚫 | **Blocked** | Waiting on external dependency or decision |
| 🔄 | **In Progress** | Currently being developed |

### Impact Assessment

| Rating | Description |
|--------|-------------|
| ⭐⭐⭐ | **High Impact** - Used daily by majority of users, directly affects core workflow |
| ⭐⭐ | **Medium Impact** - Used occasionally or by subset of users, enhances experience |
| ⭐ | **Low Impact** - Rarely used or affects edge cases, minor convenience |

---

## Current Implementation Status

### Summary Statistics (as of v0.1.0)

| Category | Total Features | Done | Partial | Missing | % Complete |
|----------|---------------|------|---------|---------|------------|
| Core System Integration | 5 | 0 | 0 | 5 | 0% |
| Window Management | 5 | 1 | 1 | 3 | 20% |
| Notifications & Alerts | 5 | 0 | 0 | 5 | 0% |
| File & Data Management | 5 | 0 | 1 | 4 | 10% |
| URL & Protocol Handling | 4 | 0 | 0 | 4 | 0% |
| Shortcuts & Quick Actions | 5 | 1 | 0 | 4 | 20% |
| Tray & Menu Enhancements | 5 | 0 | 1 | 4 | 10% |
| Performance & Optimization | 4 | 0 | 1 | 3 | 13% |
| Security & Privacy | 4 | 0 | 0 | 4 | 0% |
| Installer & Distribution | 6 | 0 | 0 | 6 | 0% |
| Accessibility | 4 | 0 | 2 | 2 | 25% |
| Advanced Features | 5 | 0 | 0 | 5 | 0% |
| **TOTAL** | **57** | **2** | **6** | **49** | **14%** |

### Implemented Features ✅

1. **Global Quick Add Shortcut** - Ctrl+Shift+A anywhere opens Quick Add window
2. **Fullscreen Toggle** - F11 keyboard shortcut with persistence

### Partially Implemented Features 🚧

1. **Custom Titlebar** - Works but could use enhancements (double-click to maximize, etc.)
2. **System Tray** - Present but tooltip not dynamic, no state indicator icon
3. **Multi-Monitor Support** - Works but doesn't remember last monitor
4. **Lazy Window Initialization** - Quick Add window exists but created at startup
5. **Custom Export Location** - File picker works but doesn't remember last location
6. **Keyboard Navigation** - Good but could be improved for full keyboard-only use
7. **Screen Reader Support** - Basic HTML semantics but lacks comprehensive ARIA labels

---

## Feature Categories

## Category 1: Core System Integration

### 1.1 App Launch on Startup

**Priority:** 🟠 High | **Status:** ❌ Missing | **Difficulty:** 🟢 Easy | **Time:** 1h | **Impact:** ⭐⭐⭐

#### Description
Enable Watchfolio to automatically start when the user logs into their system. This is essential for media tracking apps as it allows passive background sync and ensures the app is always available in the system tray.

#### User Story
> "As a user, I want Watchfolio to start automatically when I turn on my computer so that I don't have to manually open it every day and my library stays synced."

#### Technical Implementation

**Dependencies:**
- `tauri-plugin-autostart` (Tauri official plugin)

**Installation:**
```bash
pnpm add @tauri-apps/plugin-autostart
cargo add tauri-plugin-autostart --manifest-path=src-tauri/Cargo.toml
```

**Rust Setup (src-tauri/src/lib.rs):**
```rust
use tauri_plugin_autostart::MacosLauncher;

builder = builder
  .plugin(tauri_plugin_autostart::init(
    MacosLauncher::LaunchAgent,
    Some(vec!["--minimized"]), // Launch args
  ))
```

**Frontend Commands:**
```typescript
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

// Enable auto-start
await enable();

// Disable auto-start
await disable();

// Check status
const enabled = await isEnabled();
```

#### Platform-Specific Notes

**Windows:**
- Creates registry entry in `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run`
- Standard behavior, well-supported
- No administrator rights required

**macOS:**
- Uses LaunchAgent (user-level) or LaunchDaemon (system-level)
- Recommended: LaunchAgent for user-specific behavior
- Respects macOS privacy settings

**Linux:**
- Creates `.desktop` file in `~/.config/autostart/`
- Works across all major desktop environments (GNOmainME, KDE, XFCE)
- Follows XDG autostart specification

#### UI/UX Considerations

**Settings Location:** Settings > Preferences > General

**Mockup:**
```
┌────────────────────────────────────────┐
│ General Settings                       │
├────────────────────────────────────────┤
│                                        │
│ [x] Launch Watchfolio on startup      │
│     Start automatically when you log   │
│     in to your computer                │
│                                        │
│ [x] Start minimized to tray           │
│     Don't show main window on startup  │
│                                        │
└────────────────────────────────────────┘
```

**Default Behavior:** Disabled (user must opt-in)

**Rationale:** Users should explicitly enable auto-start to avoid surprise resource usage

#### Testing Checklist

- [ ] Enable via UI, verify app starts on next login
- [ ] Disable via UI, verify app doesn't start on next login
- [ ] Test with `--minimized` flag (should start in tray)
- [ ] Verify registry/LaunchAgent/autostart file is created correctly
- [ ] Test uninstall removes autostart entry
- [ ] Verify works after app update (path changes)

#### Edge Cases

1. **App moved to different location:**
   - Windows: Registry path becomes invalid
   - Solution: Update registry on app launch if path changed

2. **Portable version:**
   - Should disable autostart feature or use relative paths

3. **Multiple user accounts:**
   - Each user has independent autostart setting

#### ROI Analysis

**Development Time:** 1 hour
**Expected Usage:** 60-80% of desktop users
**User Value:** High - eliminates daily friction
**Maintenance:** Low - stable API

**Verdict:** ✅ High ROI - implement in Phase 2

---

### 1.2 Run in Background (Minimize to Tray)

**Priority:** 🟠 High | **Status:** 🚧 Partial | **Difficulty:** 🟢 Easy | **Time:** 30m | **Impact:** ⭐⭐⭐

#### Description
When user clicks the window close button (X), instead of quitting the app, hide the window and keep running in system tray. This prevents accidental quits and maintains background sync.

#### Current State
- Tray icon exists ✅
- Close button quits app ❌
- No setting to control behavior ❌

#### Implementation

**Add Setting to Store:**
```typescript
// src/stores/useUIStore.ts
interface UIState {
  closeToTray: boolean;
  setCloseToTray: (enabled: boolean) => void;
}
```

**Window Close Handler (Rust):**
```rust
// src-tauri/src/lib.rs
.on_window_event(|window, event| {
  if let WindowEvent::CloseRequested { api, .. } = event {
    // Prevent default close
    api.prevent_close();

    // Hide window instead
    window.hide().unwrap();

    // Optional: Show tray notification
    // "Watchfolio is still running in the background"
  }
})
```

**Alternative: Frontend Handler:**
```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

window.addEventListener('beforeunload', async (e) => {
  if (closeToTray) {
    e.preventDefault();
    await getCurrentWindow().hide();
  }
});
```

#### Settings UI

**Location:** Settings > Preferences > General

```
[x] Keep running in background when window is closed
    Minimize to system tray instead of quitting

    [ ] Show notification when minimizing to tray

[Button: Quit Watchfolio Completely]
```

#### Platform Differences

**Windows:** Standard behavior, expected by users
**macOS:** Less common (Cmd+Q is quit, red X should close)
- Recommended: Make this macOS-specific default OFF
**Linux:** Varies by desktop environment, generally accepted

#### User Education

**First-time behavior:**
1. User closes window
2. Show temporary toast: "Watchfolio is still running. Access it from the system tray."
3. Tray icon bounces/highlights briefly
4. Don't show again after first time

#### Related Features

- Requires: System Tray (✅ Already exists)
- Pairs with: "Quit" menu item in tray (✅ Already exists)
- Enhances: Auto-start on login (user never manually opens/closes)

---

### 1.3 Single Instance Lock

**Priority:** 🟡 Medium | **Status:** ❌ Missing | **Difficulty:** 🟢 Easy | **Time:** 30m | **Impact:** ⭐⭐

#### Description
Prevent multiple instances of Watchfolio from running simultaneously. If user tries to launch a second instance, focus the existing window instead.

#### Why It Matters

**Problems it solves:**
1. **Database Conflicts:** RxDB can't safely have multiple connections to same database
2. **Resource Waste:** Duplicate processes consuming memory
3. **User Confusion:** "Why do I have two Watchfolio icons?"

#### Technical Implementation

**Dependencies:**
- `tauri-plugin-single-instance`

**Installation:**
```bash
pnpm add @tauri-apps/plugin-single-instance
cargo add tauri-plugin-single-instance --manifest-path=src-tauri/Cargo.toml
```

**Setup:**
```rust
use tauri_plugin_single_instance::init as single_instance;

tauri::Builder::default()
  .plugin(single_instance(|app, argv, cwd| {
    println!("Second instance detected!");
    println!("Args: {:?}", argv);
    println!("Working directory: {}", cwd);

    // Focus existing window
    if let Some(window) = app.get_window("main") {
      window.show().unwrap();
      window.set_focus().unwrap();
      window.unminimize().unwrap();
    }
  }))
```

#### Handling Deep Links

**Scenario:** User clicks `watchfolio://movie/550` while app is already running

**Solution:**
```rust
.plugin(single_instance(|app, argv, _cwd| {
  // Parse deep link from argv
  if let Some(url) = argv.get(1) {
    if url.starts_with("watchfolio://") {
      // Emit event to frontend
      app.emit_all("deep-link", url).unwrap();
    }
  }

  // Focus window
  app.get_window("main").unwrap().set_focus().unwrap();
}))
```

#### Testing

**Test Cases:**
1. Launch app normally → Works
2. Launch app again while running → Focuses existing window
3. Launch with deep link URL → Focuses window + handles URL
4. Launch from different terminal/directory → Still focuses existing instance

**Edge Case:** Crash recovery
- If app crashes, lock file might persist
- Plugin handles this automatically (stale lock detection)

#### ROI Analysis

**Development Time:** 30 minutes
**Prevents Issues:** Database corruption, resource waste
**User Impact:** Mostly invisible (prevents confusion)
**Risk:** Low - stable plugin

**Verdict:** ✅ Should implement - low effort, prevents problems

---

### 1.4 System Sleep/Wake Detection

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 1.5h | **Impact:** ⭐⭐

#### Description
Detect when the computer goes to sleep or wakes up, allowing the app to pause sync operations during sleep and resume on wake. Improves battery life and prevents failed network requests.

#### Use Cases

1. **Laptop on battery:** Pause background sync to save power
2. **Network disconnection:** Computer sleeps mid-sync → pause gracefully
3. **Wake optimization:** Immediately check for updates on wake

#### Implementation Approach

**No native Tauri plugin exists** - requires platform-specific code

**Option A: Platform-specific implementations**

**Windows (Power Events):**
```rust
// Listen to Windows power events
use windows::Win32::System::Power::*;

fn register_power_events() {
  // PBT_APMSUSPEND - system is suspending
  // PBT_APMRESUMEAUTOMATIC - system has resumed
}
```

**macOS (IOKit):**
```rust
// Use IOKit framework
extern "C" {
  fn IORegisterForSystemPower(...);
}
```

**Linux (DBus):**
```rust
// Listen to DBus signals
// org.freedesktop.login1.Manager.PrepareForSleep
```

**Option B: Polling-based detection**
```rust
// Simpler but less efficient
let mut last_active = Instant::now();

std::thread::spawn(move || {
  loop {
    std::thread::sleep(Duration::from_secs(10));
    let now = Instant::now();

    // If more than 20 seconds passed, likely was asleep
    if now.duration_since(last_active) > Duration::from_secs(20) {
      // Emit wake event
      app.emit_all("system-wake", ()).unwrap();
    }

    last_active = now;
  }
});
```

#### Frontend Integration

```typescript
// Listen for events
import { listen } from '@tauri-apps/api/event';

listen('system-sleep', () => {
  console.log('System going to sleep');
  // Pause sync operations
  syncStore.pauseSync();
});

listen('system-wake', () => {
  console.log('System woke up');
  // Resume sync
  syncStore.resumeSync();
  // Check for updates
  updater.checkForUpdates();
});
```

#### Complexity Assessment

**Pros:**
- Better battery life on laptops
- Prevents half-finished sync operations
- Good for updates (check on wake)

**Cons:**
- Platform-specific code (3x implementations)
- Testing requires actual sleep/wake cycles
- Minimal user-facing benefit

**Verdict:** ⚠️ Low priority - complex implementation, moderate benefit. Consider for v0.3.0+

---

### 1.5 Network Change Detection

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 1h | **Impact:** ⭐⭐

#### Description
Detect when network connectivity changes (WiFi connects/disconnects, ethernet plugged/unplugged) to intelligently retry sync operations.

#### User Scenarios

1. **Coffee shop:** User opens laptop → WiFi connects → auto-sync starts
2. **Airplane mode:** Network lost → pause sync, show offline indicator
3. **Network switching:** Mobile hotspot → home WiFi → verify connection quality

#### Implementation

**Option A: Navigator API (Browser)**
```typescript
// Works in Tauri's webview
window.addEventListener('online', () => {
  console.log('Network connected');
  syncStore.triggerSync();
});

window.addEventListener('offline', () => {
  console.log('Network disconnected');
  syncStore.pauseSync();
});

// Check current status
const isOnline = navigator.onLine;
```

**Option B: Rust network monitoring**
```rust
use std::net::TcpStream;

fn check_connectivity() -> bool {
  // Try to connect to reliable endpoint
  TcpStream::connect("8.8.8.8:53").is_ok()
}
```

**Option C: Ping Appwrite endpoint**
```typescript
// Most reliable - checks actual service availability
async function checkConnection() {
  try {
    await fetch('https://cloud.appwrite.io/v1/health', {
      method: 'GET',
      timeout: 5000
    });
    return true;
  } catch {
    return false;
  }
}
```

#### Smart Sync Behavior

```typescript
// Enhanced sync with network awareness
class SyncManager {
  private isOnline = true;
  private retryQueue: SyncOperation[] = [];

  constructor() {
    // Listen to network events
    window.addEventListener('online', () => this.onNetworkChange(true));
    window.addEventListener('offline', () => this.onNetworkChange(false));
  }

  private async onNetworkChange(online: boolean) {
    this.isOnline = online;

    if (online) {
      // Network restored
      toast.success('Back online - syncing library');
      await this.processRetryQueue();
    } else {
      // Network lost
      toast.warning('Working offline - changes will sync when online');
    }
  }
}
```

#### UI Indicators

**Status Bar Component:**
```tsx
function NetworkStatus() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null; // Don't show when online

  return (
    <div className="fixed bottom-4 left-4 pill-bg px-3 py-2 text-sm">
      <WifiOff className="w-4 h-4 inline mr-2" />
      Working Offline
    </div>
  );
}
```

#### Testing

**Simulate network conditions:**
1. Disable WiFi → Should show offline indicator
2. Re-enable WiFi → Should auto-sync
3. Throttle network (Chrome DevTools) → Should handle slow connections
4. Rapid on/off toggling → Should debounce events

#### Verdict

**Benefit:** Improves offline-first UX
**Complexity:** Low (browser API works well)
**Priority:** Medium - nice enhancement, not critical

**Recommendation:** ✅ Implement in Phase 3, pairs well with sync improvements

---

## Category 2: Window Management

### 2.1 Remember Window Size & Position

**Priority:** 🟠 High | **Status:** ❌ Missing | **Difficulty:** 🟢 Easy | **Time:** 45m | **Impact:** ⭐⭐⭐

#### Description
Save window dimensions and position when user closes/moves the window, restore on next launch. This is a baseline expectation for professional desktop applications.

#### Why Users Care

> "I've positioned my windows exactly how I like them. Don't make me re-arrange every time I open the app."

Professional apps (VS Code, Slack, Spotify) all do this. Its absence is immediately noticeable.

#### Implementation

**Storage Options:**

**Option A: Local Storage (Simple)**
```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

// Save on window events
async function saveWindowState() {
  const window = getCurrentWindow();
  const position = await window.outerPosition();
  const size = await window.outerSize();

  localStorage.setItem('windowState', JSON.stringify({
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
    isMaximized: await window.isMaximized(),
  }));
}

// Restore on launch
async function restoreWindowState() {
  const saved = localStorage.getItem('windowState');
  if (!saved) return;

  const state = JSON.parse(saved);
  const window = getCurrentWindow();

  await window.setPosition({ x: state.x, y: state.y });
  await window.setSize({ width: state.width, height: state.height });

  if (state.isMaximized) {
    await window.maximize();
  }
}
```

**Option B: Tauri Store Plugin (Better)**
```rust
// Use official tauri-plugin-store
use tauri_plugin_store::StoreBuilder;

let store = StoreBuilder::new(app.handle(), "window-state.json").build();

// Save
store.insert("window-bounds", json!({
  "x": position.x,
  "y": position.y,
  "width": size.width,
  "height": size.height
}));
store.save();
```

#### Events to Listen To

```typescript
import { listen } from '@tauri-apps/api/event';

// Save on resize
await listen('tauri://resize', saveWindowState);

// Save on move
await listen('tauri://move', saveWindowState);

// Save on close
window.addEventListener('beforeunload', saveWindowState);

// Debounce to avoid excessive saves
const debouncedSave = debounce(saveWindowState, 500);
```

#### Edge Cases

**1. Screen resolution changed**
```typescript
// Detect if saved position is off-screen
const screen = await window.currentMonitor();
if (state.x > screen.size.width || state.y > screen.size.height) {
  // Reset to center
  await window.center();
}
```

**2. Monitor disconnected**
```typescript
// If saved position was on external monitor that's now gone
const monitors = await window.availableMonitors();
const isOnValidMonitor = monitors.some(monitor =>
  state.x >= monitor.position.x &&
  state.x < monitor.position.x + monitor.size.width
);

if (!isOnValidMonitor) {
  await window.center();
}
```

**3. First launch**
```typescript
if (!saved) {
  // Use defaults from tauri.conf.json
  // 1280x800, centered
}
```

#### Multi-Window Support

```typescript
// Store per window
const stateKey = `windowState-${window.label}`;

// main window: "windowState-main"
// quick-add: "windowState-quick-add"
```

#### Testing Checklist

- [ ] Resize window, restart → size restored
- [ ] Move window, restart → position restored
- [ ] Maximize window, restart → maximized state restored
- [ ] Move to second monitor, restart → appears on same monitor
- [ ] Disconnect external monitor, restart → appears on primary monitor
- [ ] Change screen resolution → window still visible
- [ ] Reset to defaults option in settings

#### Settings Integration

```tsx
// Settings > Preferences > General
<>
  <Switch checked={rememberWindowState} onChange={...}>
    Remember window size and position
  </Switch>

  {rememberWindowState && (
    <Button onClick={resetWindowState} variant="outline" size="sm">
      Reset to Defaults
    </Button>
  )}
</>
```

#### ROI Analysis

**Development Time:** 45 minutes
**User Satisfaction:** High - removes daily annoyance
**Bug Risk:** Low - well-established pattern
**Maintenance:** Low - save/restore logic rarely changes

**Verdict:** ✅ High ROI - implement in Phase 2 immediately after launch

---

### 2.2 Multi-Monitor Support

**Priority:** 🟡 Medium | **Status:** 🚧 Partial | **Difficulty:** 🟢 Easy | **Time:** 30m | **Impact:** ⭐⭐

#### Current State

Tauri inherently supports multi-monitor - windows can be dragged to any monitor. What's missing: **remembering which monitor** the app was on.

#### Enhancement

This is covered by **2.1 Remember Window Position** - no separate work needed.

**Additional capability:**
```typescript
// Detect monitor changes
import { availableMonitors, currentMonitor } from '@tauri-apps/api/window';

const monitors = await availableMonitors();
// [
//   { name: "Built-in Display", size: { width: 2560, height: 1600 }, position: { x: 0, y: 0 } },
//   { name: "Dell U2720Q", size: { width: 3840, height: 2160 }, position: { x: 2560, y: 0 } }
// ]

const current = await currentMonitor();
// { name: "Dell U2720Q", ... }
```

**Potential Feature:** "Open on specific monitor" setting
```typescript
// Advanced users might want: "Always open on Monitor 2"
interface WindowSettings {
  preferredMonitor?: string; // Monitor name or "primary"
}
```

**Verdict:** ✅ Mostly handled by 2.1, can add monitor preference later if requested

---

### 2.3 Picture-in-Picture Mode

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🔴 Hard | **Time:** 4h | **Impact:** ⭐

#### Description
Create a small, always-on-top mini window for watching trailers while browsing the rest of the app.

#### User Scenario

> "I'm browsing movies in the main window, but I want to watch this trailer in a small floating window"

#### Implementation Complexity

**Requires:**
1. New window type (mini player window)
2. Video player integration
3. Window controls (resize, close)
4. Communication between windows (play/pause from main window)

**Example Code:**
```rust
// Create PiP window
let pip_window = WindowBuilder::new(
  app,
  "pip",
  WindowUrl::App("/pip-player".into())
)
.title("Trailer")
.inner_size(400.0, 225.0) // 16:9 aspect ratio
.resizable(true)
.always_on_top(true)
.decorations(false)
.transparent(true)
.build()?;
```

#### Challenges

1. **Video playback:** Embed YouTube/TMDB video player in small window
2. **Aspect ratio locking:** Maintain 16:9 when resizing
3. **Platform differences:**
   - macOS has native PiP for `<video>` elements
   - Windows requires custom implementation
4. **Performance:** Video decoding in separate window

#### Alternative Approach

Use native browser PiP API:
```typescript
const video = document.querySelector('video');
if (document.pictureInPictureEnabled) {
  await video.requestPictureInPicture();
}
```

**Limitation:** Only works for `<video>` elements, not full UI

#### Verdict

**Pros:** Cool feature, unique selling point
**Cons:** Complex implementation, limited use case (only for trailers)
**Priority:** Low - nice-to-have, not essential

**Recommendation:** ⚠️ Defer to v0.4.0+, assess user demand first

---

### 2.4 Compact Mode

**Priority:** 🟡 Medium | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 2h | **Impact:** ⭐⭐

#### Description
A space-saving layout option that shows a minimal UI (400x600px window) for quick status checking without covering the entire screen.

#### Visual Mockup

**Normal Mode (1280x800):**
```
┌─────────────────────────────────────────────────────┐
│ Sidebar │      Main Content (Cards, Lists)         │
│  - Home │                                           │
│  - Lib  │                                           │
│  - TV   │         [Large Media Cards]              │
└─────────────────────────────────────────────────────┘
```

**Compact Mode (400x600):**
```
┌──────────────────┐
│ [Hamburger Menu] │
├──────────────────┤
│  Watching (5)    │
│  ▸ Fight Club    │
│  ▸ The Matrix    │
│                  │
│  Plan to Watch(2)│
│  ▸ Inception     │
│                  │
│  [Quick Add +]   │
└──────────────────┘
```

#### Implementation

**Toggle in View Menu:**
```rust
// menu.rs
let compact_mode = MenuItem::with_id(
  app,
  "compact_mode",
  "Compact Mode",
  true,
  Some("Ctrl+K")
)?;
```

**Frontend Layout:**
```typescript
const isCompact = useUIStore(state => state.compactMode);

if (isCompact) {
  return <CompactLayout />;
}

return <StandardLayout />;
```

**Window Resize:**
```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

async function enableCompactMode() {
  const window = getCurrentWindow();

  // Save current size
  const currentSize = await window.outerSize();
  localStorage.setItem('normalModeSize', JSON.stringify(currentSize));

  // Resize to compact
  await window.setSize({ width: 400, height: 600 });
  await window.center(); // Re-center after resize
}

async function disableCompactMode() {
  const saved = localStorage.getItem('normalModeSize');
  if (saved) {
    const size = JSON.parse(saved);
    await window.setSize(size);
  }
}
```

#### Components for Compact Mode

1. **CompactNavigation** - Hamburger menu instead of sidebar
2. **CompactLibrary** - List view only (no grid/cards)
3. **CompactMediaCard** - Title + small poster (no details)
4. **HiddenFilters** - Collapse by default to save space

#### Use Cases

- **Secondary monitor:** Quick glance at watching list
- **Minimal distraction:** Keep app open but not dominating
- **Low-res displays:** Better fit on 1366x768 laptops

#### Settings

```tsx
// View > Compact Mode
// OR
// Settings > Appearance > Layout

<RadioGroup>
  <Radio value="standard">Standard (1280x800)</Radio>
  <Radio value="compact">Compact (400x600)</Radio>
  <Radio value="auto">Auto (based on window size)</Radio>
</RadioGroup>
```

#### Verdict

**Pros:** Differentiates from competitors, good for power users
**Cons:** Requires responsive design work, testing multiple layouts
**Priority:** Medium - valuable but not urgent

**Recommendation:** ✅ Good for v0.3.0 after core features stabilized

---

### 2.5 Fullscreen Persistence

**Priority:** 🟢 Low | **Status:** ✅ Done | **Difficulty:** - | **Time:** - | **Impact:** ⭐

#### Status: ✅ Already Implemented

**Current implementation:**
- F11 toggles fullscreen ✅
- State persists across restarts ✅ (via window state restoration)
- Menu item exists ✅

**No additional work needed.**

---

## Category 3: Notifications & Alerts

### 3.1 Native OS Update Notifications

**Priority:** 🟠 High | **Status:** ❌ Missing | **Difficulty:** 🟢 Easy | **Time:** 15m | **Impact:** ⭐⭐⭐

#### Current State

- ✅ Update checking works
- ✅ In-app banner shows when update available
- ❌ No OS notification when app is minimized/background

#### Problem

If app is minimized to tray, user never sees the update notification banner. They only discover updates when manually opening the app.

#### Solution

Add native OS notification when update is detected.

**Implementation:**

```rust
// src-tauri/src/updater.rs

use tauri_plugin_notification::NotificationExt;

pub async fn check_for_updates(app: AppHandle, silent: bool) -> Result<(), Box<dyn std::error::Error>> {
    let update = app.updater()?.check().await?;

    if let Some(update) = update {
        let version = update.version.clone();

        if !silent {
            // Show native OS notification
            app.notification()
                .builder()
                .title("Update Available")
                .body(format!("Watchfolio {} is ready to download", version))
                .icon("icons/icon.png")
                .show()?;

            // Also emit event for in-app banner
            app.emit("update-available", ...)?;
        }

        Ok(())
    } else {
        Ok(())
    }
}
```

#### Platform Appearance

**Windows 10/11:**
```
┌────────────────────────────────┐
│ [App Icon] Watchfolio          │
│ Update Available               │
│ Watchfolio 1.2.0 is ready to   │
│ download                        │
│                    [Dismiss] [Action] │
└────────────────────────────────┘
```

**macOS:**
```
┌────────────────────────────────┐
│ Watchfolio                     │
│ Update Available               │
│ Watchfolio 1.2.0 is ready to   │
│ download                        │
│                         [Close] │
└────────────────────────────────┘
```

**Linux (GNOME):**
```
┌────────────────────────────────┐
│ Watchfolio - Update Available  │
│ Watchfolio 1.2.0 is ready to   │
│ download                        │
│                              [✕] │
└────────────────────────────────┘
```

#### Notification Actions (Advanced)

Some platforms support clickable actions:

```rust
app.notification()
    .builder()
    .title("Update Available")
    .body(format!("Version {} is ready", version))
    .actions(vec![
        NotificationAction::new("download", "Download Now"),
        NotificationAction::new("later", "Remind Me Later"),
    ])
    .show()?;
```

**Challenges:**
- Not all platforms support actions (Linux varies)
- Requires handling action clicks
- More complex implementation

**Recommendation:** Start with simple notification, add actions later if requested

#### User Preference

Some users may not want notifications:

```tsx
// Settings > Notifications
<Switch
  checked={notifyOnUpdates}
  onChange={setNotifyOnUpdates}
>
  Notify me when updates are available
</Switch>
```

Pass to Rust:
```rust
let show_notification = app.state::<Settings>().notify_on_updates;

if show_notification {
  app.notification().builder()...
}
```

#### Testing

**Test Cases:**
1. App in foreground → Show both notification + banner
2. App minimized → Show notification only
3. App in background → Show notification
4. User disabled notifications → No notification, only banner when they open app
5. Click notification → Should focus app window

#### ROI Analysis

**Development Time:** 15 minutes
**User Benefit:** High - users actually see updates
**Adoption Impact:** Keeps users on latest version
**Maintenance:** Low - plugin is stable

**Verdict:** ✅ Quick win, implement in Phase 2

---

### 3.2 Sync Completion Notifications

**Priority:** 🟡 Medium | **Status:** ❌ Missing | **Difficulty:** 🟢 Easy | **Time:** 20m | **Impact:** ⭐⭐

#### Description

Show a native notification when background sync completes, informing users of what was synced.

#### Examples

**Scenarios:**

1. **Items synced:**
   ```
   Watchfolio
   Sync Complete
   Synced 3 items with cloud
   ```

2. **Conflicts resolved:**
   ```
   Watchfolio
   Sync Complete
   Synced 5 items, resolved 1 conflict
   ```

3. **No changes:**
   ```
   (No notification - nothing to report)
   ```

#### Implementation

```typescript
// src/stores/useSyncStore.ts

const triggerSync = async () => {
  setState({ isSyncing: true });

  try {
    const result = await performSync();

    if (result.itemsSynced > 0) {
      // Show notification
      await invoke('show_sync_notification', {
        itemCount: result.itemsSynced,
        conflicts: result.conflictsResolved
      });
    }

    setState({ isSyncing: false, lastSyncTime: new Date() });
  } catch (error) {
    // Error notification
    await invoke('show_sync_error', { error: error.message });
  }
};
```

**Rust handler:**
```rust
#[tauri::command]
async fn show_sync_notification(
  app: AppHandle,
  item_count: u32,
  conflicts: u32
) -> Result<(), String> {
  let message = if conflicts > 0 {
    format!("Synced {} items, resolved {} conflict(s)", item_count, conflicts)
  } else {
    format!("Synced {} items with cloud", item_count)
  };

  app.notification()
    .builder()
    .title("Sync Complete")
    .body(message)
    .show()
    .map_err(|e| e.to_string())?;

  Ok(())
}
```

#### User Control

**Settings > Notifications:**
```tsx
<div className="space-y-2">
  <Switch checked={notifyOnSync}>
    Notify when sync completes
  </Switch>

  {notifyOnSync && (
    <>
      <Checkbox checked={notifyOnlyIfChanges}>
        Only notify if items were synced (hide "no changes")
      </Checkbox>

      <Checkbox checked={notifyOnSyncError}>
        Notify on sync errors
      </Checkbox>
    </>
  )}
</div>
```

#### Notification Frequency

**Problem:** If user makes rapid changes, don't spam notifications

**Solution: Debouncing**
```typescript
// Only notify if:
// 1. More than 5 minutes since last notification
// 2. OR significant change (>10 items)

const shouldNotify = (result: SyncResult) => {
  const lastNotification = localStorage.getItem('lastSyncNotification');
  const timeSince = Date.now() - Number(lastNotification);

  return (
    result.itemsSynced >= 10 ||
    timeSince > 5 * 60 * 1000 // 5 minutes
  );
};
```

#### Visual Feedback

Notification could include icon based on result:

```rust
.icon(if conflicts > 0 {
  "icons/warning.png"
} else {
  "icons/success.png"
})
```

#### Verdict

**Pros:** Reassures users sync is working in background
**Cons:** Could be annoying if frequent syncs
**Priority:** Medium - nice feedback, not critical

**Recommendation:** ✅ Implement with smart debouncing in Phase 3

---

### 3.3 New Recommendations Alert

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 1h | **Impact:** ⭐⭐

#### Description

Daily notification: "You have 3 new mood recommendations ready!" to drive engagement with AI features.

#### User Value

**Problem:** Users forget about Mood Match feature
**Solution:** Gentle daily reminder with fresh recommendations

#### Implementation

**Scheduled Task:**
```rust
use tokio::time::{interval, Duration};

pub fn start_recommendation_notifier(app: AppHandle) {
  tokio::spawn(async move {
    // Run every 24 hours at 10 AM
    let mut interval = interval(Duration::from_secs(86400));

    loop {
      interval.tick().await;

      // Fetch recommendation count
      let count = fetch_recommendation_count(&app).await;

      if count > 0 {
        app.notification()
          .builder()
          .title("New Recommendations")
          .body(format!("You have {} fresh mood recommendations!", count))
          .show()
          .unwrap();
      }
    }
  });
}
```

**Recommendation Count:**
```typescript
// Check if user has new recommendations
// "New" = generated in last 24 hours that user hasn't viewed

async function getNewRecommendationCount() {
  const lastViewed = localStorage.getItem('lastViewedRecommendations');

  // Call Gemini API or check cache
  const recommendations = await generateRecommendations();

  // Filter to only recommendations user hasn't seen
  const newOnes = recommendations.filter(r =>
    r.generatedAt > lastViewed
  );

  return newOnes.length;
}
```

#### Settings

**Opt-in by default? NO.**

This could be annoying, should be opt-in:

```tsx
// Settings > Notifications
<Switch checked={dailyRecommendations}>
  Daily mood recommendation alerts
</Switch>

{dailyRecommendations && (
  <Select value={recommendationTime}>
    <option value="morning">Morning (10 AM)</option>
    <option value="afternoon">Afternoon (2 PM)</option>
    <option value="evening">Evening (7 PM)</option>
  </Select>
)}
```

#### Click Behavior

Clicking notification should navigate to Mood Match page:

```rust
// Handle notification click
app.notification()
  .builder()
  .title("New Recommendations")
  .body(...)
  .on_click(|| {
    // Focus window and navigate
    app.get_window("main")?
      .emit("navigate", "/mood-match")?;
  })
  .show()
```

#### Verdict

**Pros:** Increases feature engagement, re-activation trigger
**Cons:** Could annoy users if recommendations aren't valuable
**Priority:** Low - enhancement, not core functionality

**Recommendation:** ⚠️ Implement only if analytics show Mood Match has low usage (v0.4.0+)

---

### 3.4 Notification Actions

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 1.5h | **Impact:** ⭐

#### Description

Add clickable buttons to notifications (e.g., "Download Update" button in update notification).

#### Platform Support

**Windows 10/11:** ✅ Full support (Toast Notifications API)
**macOS 10.14+:** ✅ Full support (User Notifications Framework)
**Linux:** ⚠️ Varies by desktop environment
  - GNOME: ✅ Supports actions
  - KDE: ✅ Supports actions
  - XFCE: ❌ Limited support
  - Others: ❌ Often no support

#### Example

```rust
use tauri_plugin_notification::NotificationExt;

app.notification()
  .builder()
  .title("Update Available")
  .body("Watchfolio 1.2.0 is ready to download")
  .actions(vec![
    NotificationAction::new("download", "Download Now"),
    NotificationAction::new("later", "Later"),
  ])
  .on_action(|action| {
    match action.as_str() {
      "download" => {
        // Trigger download
        app.emit_all("start-update-download", ()).unwrap();
      },
      "later" => {
        // Dismiss
      },
      _ => {}
    }
  })
  .show()
```

#### Use Cases

1. **Update notification:**
   - "Download Now" → Start download immediately
   - "Remind Me Later" → Snooze notification

2. **Sync conflict:**
   - "Use Local" → Keep local changes
   - "Use Cloud" → Use cloud version

3. **New recommendation:**
   - "View Now" → Open Mood Match page
   - "Dismiss" → Do nothing

#### Fallback for Unsupported Platforms

```rust
#[cfg(target_os = "linux")]
{
  // Check if actions are supported
  if notification_supports_actions() {
    // Use actions
  } else {
    // Simple notification + click handler
    .on_click(|| { /* default action */ })
  }
}
```

#### Verdict

**Pros:** More interactive, better UX
**Cons:** Platform fragmentation, testing complexity
**Priority:** Low - polish feature

**Recommendation:** ⚠️ Nice-to-have for v0.5.0+, focus on basic notifications first

---

### 3.5 Badge Count (macOS/Linux)

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 1h | **Impact:** ⭐

#### Description

Show a number badge on the dock/taskbar icon (e.g., "5" for 5 items currently watching).

#### Platform Support

**macOS:** ✅ Full support (Dock badge API)
**Linux:** ⚠️ Varies (Unity launcher API, but inconsistent)
**Windows:** ❌ No native badge (can show overlay icon instead)

#### macOS Implementation

```rust
use tauri::Manager;

#[cfg(target_os = "macos")]
pub fn set_badge_count(app: &AppHandle, count: u32) {
  use cocoa::appkit::{NSApp, NSApplication};
  use cocoa::base::nil;
  use cocoa::foundation::NSString;

  unsafe {
    let app = NSApp();
    let label = if count > 0 {
      NSString::alloc(nil).init_str(&count.to_string())
    } else {
      NSString::alloc(nil).init_str("")
    };
    app.dockTile().setBadgeLabel_(label);
  }
}
```

**Frontend call:**
```typescript
import { invoke } from '@tauri-apps/api';

// Update badge when watching count changes
useEffect(() => {
  const watchingCount = library.filter(i => i.status === 'watching').length;
  invoke('set_badge_count', { count: watchingCount });
}, [library]);
```

#### Use Cases

**What to show:**
1. **Option A:** Currently watching count (most relevant)
2. **Option B:** Unsynced items count
3. **Option C:** User choice in settings

```tsx
// Settings > Notifications > Badge Icon
<Select value={badgeMode}>
  <option value="watching">Watching count</option>
  <option value="unsynced">Unsynced items</option>
  <option value="none">No badge</option>
</Select>
```

#### Windows Alternative

Windows doesn't have dock badges, but supports **overlay icons**:

```rust
// Show small icon overlay (e.g., sync indicator)
#[cfg(target_os = "windows")]
window.set_overlay_icon(
  Some(Icon::from_path("icons/syncing.ico")?),
  Some("Syncing...")
);
```

**Limited use case** - not as clean as macOS badge

#### Verdict

**Pros:** Nice visual indicator, common on macOS
**Cons:** macOS-only feature (limited reach)
**Priority:** Low - platform-specific enhancement

**Recommendation:** ⚠️ Low priority - only implement if significant macOS user base (v0.5.0+)

---

## Category 4: File & Data Management

### 4.1 File Associations

**Priority:** 🟡 Medium | **Status:** ❌ Missing | **Difficulty:** 🟢 Easy | **Time:** 30m | **Impact:** ⭐⭐

#### Description

Register `.watchfolio` file extension so double-clicking exported library files opens them in Watchfolio.

#### User Flow

1. User exports library: `my-library.watchfolio`
2. User moves file to different computer
3. User double-clicks file
4. Watchfolio opens and prompts: "Import 127 items from my-library.watchfolio?"

#### Implementation

**tauri.conf.json:**
```json
{
  "bundle": {
    "fileAssociations": [
      {
        "ext": ["watchfolio"],
        "name": "Watchfolio Library Export",
        "description": "Watchfolio library export file",
        "role": "Editor",
        "mimeType": "application/x-watchfolio"
      }
    ]
  }
}
```

#### Handling File Open

**Rust (main.rs):**
```rust
use tauri::Manager;

.setup(|app| {
  // Handle file open on launch
  #[cfg(not(target_os = "macos"))]
  {
    if let Some(path) = std::env::args().nth(1) {
      if path.ends_with(".watchfolio") {
        app.emit_all("file-open", path).unwrap();
      }
    }
  }

  // macOS uses different event
  #[cfg(target_os = "macos")]
  {
    use tauri::{RunEvent, WindowEvent};

    app.listen_global("tauri://file-drop", |event| {
      if let Some(paths) = event.payload() {
        // Handle dropped .watchfolio files
      }
    });
  }

  Ok(())
})
```

**Frontend handler:**
```typescript
import { listen } from '@tauri-apps/api/event';

listen<string>('file-open', async (event) => {
  const filePath = event.payload;

  // Confirm before importing
  const confirmed = await confirm(
    `Import library from ${basename(filePath)}?`,
    { title: 'Import Library', type: 'info' }
  );

  if (confirmed) {
    await importFromFile(filePath);
    toast.success('Library imported successfully');
  }
});
```

#### Platform Behavior

**Windows:**
- Installer creates registry entry
- File shows Watchfolio icon
- Right-click → "Open with Watchfolio"

**macOS:**
- Application bundle declares UTI (Uniform Type Identifier)
- File shows app icon in Finder
- Default app for `.watchfolio` files

**Linux:**
- `.desktop` file includes MIME type
- Desktop environment associates extension
- Varies by file manager (Nautilus, Dolphin, etc.)

#### File Icon

Custom icon for `.watchfolio` files:

**Windows:** Embed icon in app resources
**macOS:** Include in `Info.plist` document icons
**Linux:** Specify in `.desktop` file

```json
// tauri.conf.json
{
  "bundle": {
    "icon": ["icons/icon.ico", "icons/icon.icns", "icons/icon.png"],
    "resources": ["icons/document-icon.ico"] // Windows file association icon
  }
}
```

#### Testing

- [ ] Export library to `.watchfolio` file
- [ ] Double-click file → App opens
- [ ] App prompts to import
- [ ] Import completes successfully
- [ ] Test on fresh install (no existing association)
- [ ] Test with app already running (second instance or focus existing)
- [ ] Verify file shows app icon

#### Verdict

**Pros:** Professional touch, improves import UX
**Cons:** Platform-specific installer work
**Priority:** Medium - nice enhancement for desktop feel

**Recommendation:** ✅ Implement in Phase 3 after basic import/export is stable

---

### 4.2 Drag & Drop Import

**Priority:** 🟠 High | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 2h | **Impact:** ⭐⭐⭐

#### Description

Allow users to drag JSON/CSV files directly into the Watchfolio window to trigger import, eliminating the need for file picker dialogs.

#### User Experience

**Before (current):**
1. Click Import button
2. File picker opens
3. Navigate to file location
4. Select file
5. Click Open
6. Import starts

**After (with drag & drop):**
1. Drag file from desktop/folder
2. Drop onto Watchfolio window
3. Import starts immediately

**60% fewer clicks!**

#### Implementation

**Tauri Config:**
```json
{
  "app": {
    "windows": [{
      "label": "main",
      "fileDropEnabled": true  // ← Enable file dropping
    }]
  }
}
```

**Frontend Handler:**
```typescript
import { listen } from '@tauri-apps/api/event';

// Listen for file drop events
listen<string[]>('tauri://file-drop', async (event) => {
  const files = event.payload;

  // Filter to supported types
  const importable = files.filter(file =>
    file.endsWith('.json') ||
    file.endsWith('.csv') ||
    file.endsWith('.watchfolio')
  );

  if (importable.length === 0) {
    toast.error('No supported files dropped. Supported: JSON, CSV, .watchfolio');
    return;
  }

  // Handle multiple files
  if (importable.length > 1) {
    const confirmed = await confirm(
      `Import ${importable.length} files?`,
      { title: 'Multiple Files Detected' }
    );
    if (!confirmed) return;
  }

  // Trigger import
  for (const file of importable) {
    await handleImport(file);
  }
});

// Also listen for drag hover (visual feedback)
listen('tauri://file-drop-hover', (event) => {
  // Show drop zone overlay
  setIsDragging(true);
});

listen('tauri://file-drop-cancelled', () => {
  // Hide overlay
  setIsDragging(false);
});
```

#### Visual Feedback

**Drop Zone Overlay:**
```tsx
function DropZoneOverlay({ isDragging }: { isDragging: boolean }) {
  if (!isDragging) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
                 flex items-center justify-center pointer-events-none"
    >
      <div className="pill-bg px-8 py-6 text-center">
        <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Drop to Import</h3>
        <p className="text-white/60">
          Supports JSON, CSV, and .watchfolio files
        </p>
      </div>
    </motion.div>
  );
}
```

**Import Progress:**
```tsx
// Show progress toast
toast.loading(`Importing ${filename}...`, { id: 'import' });

try {
  const result = await importFile(file);
  toast.success(
    `Imported ${result.count} items successfully`,
    { id: 'import' }
  );
} catch (error) {
  toast.error(
    `Import failed: ${error.message}`,
    { id: 'import' }
  );
}
```

#### Edge Cases

**1. Unsupported file types**
```typescript
const unsupported = files.filter(f =>
  !f.match(/\.(json|csv|watchfolio)$/)
);

if (unsupported.length > 0) {
  toast.error(
    `Unsupported files: ${unsupported.map(basename).join(', ')}`,
    { duration: 5000 }
  );
}
```

**2. Large files**
```typescript
// Check file size before importing
const stats = await fs.stat(file);
if (stats.size > 10 * 1024 * 1024) { // 10 MB
  const confirmed = await confirm(
    `This file is ${formatBytes(stats.size)}. Continue?`,
    { title: 'Large File Warning' }
  );
  if (!confirmed) return;
}
```

**3. Malformed files**
```typescript
try {
  JSON.parse(await fs.readTextFile(file));
} catch (error) {
  toast.error('Invalid JSON file');
  return;
}
```

**4. Drop while import in progress**
```typescript
if (isImporting) {
  toast.error('Please wait for current import to finish');
  return;
}
```

#### Security Considerations

**Tauri's file drop is sandboxed** - files are validated before being passed to frontend.

**Additional validation:**
```typescript
// Verify file size
// Verify file format (magic numbers for binary files)
// Scan JSON for suspicious content (script tags, etc.)
```

#### Testing Checklist

- [ ] Drag single JSON file → Import works
- [ ] Drag multiple JSON files → Batch import works
- [ ] Drag CSV file → Converts and imports
- [ ] Drag .watchfolio file → Imports correctly
- [ ] Drag image file → Shows "unsupported" message
- [ ] Drag file while import in progress → Shows error
- [ ] Visual overlay appears during drag
- [ ] Overlay disappears if drag cancelled
- [ ] Works from different sources (Desktop, Explorer, Finder)

#### Documentation

Add to Help section:
```md
### Quick Import via Drag & Drop

You can import library files by simply dragging them into Watchfolio:

1. Locate your export file (.json, .csv, or .watchfolio)
2. Drag the file into the Watchfolio window
3. Release to start import
4. Confirm if prompted

Tip: You can drag multiple files at once for batch import!
```

#### Verdict

**Pros:** Huge UX improvement, feels modern and intuitive
**Cons:** Requires comprehensive error handling
**Priority:** High - significantly better than file picker flow

**Recommendation:** ✅ Implement in Phase 2 - this is a differentiator

---

### 4.3 Auto-Backup on Schedule

**Priority:** 🟡 Medium | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 2h | **Impact:** ⭐⭐

#### Description

Automatically export library to a local backup file on a recurring schedule (daily/weekly), providing a safety net against data loss.

#### User Value

> "I accidentally cleared my library and didn't realize I could lose everything. Luckily, I had auto-backup enabled and restored from yesterday's backup."

**Peace of mind** - users never worry about losing data.

#### Implementation

**Scheduled Task:**
```rust
use tokio::time::{interval_at, Duration, Instant};
use chrono::{Local, Timelike};

pub fn start_auto_backup(app: AppHandle) {
  tokio::spawn(async move {
    // Calculate time until 3 AM tomorrow
    let now = Local::now();
    let tomorrow_3am = (now + chrono::Duration::days(1))
      .date()
      .and_hms(3, 0, 0);

    let duration_until_3am = (tomorrow_3am - now)
      .to_std()
      .unwrap();

    // Wait until 3 AM, then repeat every 24 hours
    let start = Instant::now() + duration_until_3am;
    let mut interval = interval_at(start, Duration::from_secs(86400));

    loop {
      interval.tick().await;

      // Trigger backup
      if let Err(e) = perform_backup(&app).await {
        eprintln!("Auto-backup failed: {}", e);
      }
    }
  });
}

async fn perform_backup(app: &AppHandle) -> Result<(), String> {
  // Get backup directory
  let backup_dir = app.path_resolver()
    .app_data_dir()
    .unwrap()
    .join("backups");

  // Create if doesn't exist
  std::fs::create_dir_all(&backup_dir)
    .map_err(|e| e.to_string())?;

  // Generate filename with timestamp
  let filename = format!(
    "watchfolio-backup-{}.json",
    Local::now().format("%Y%m%d-%H%M%S")
  );

  let backup_path = backup_dir.join(filename);

  // Export library data
  app.emit_all("perform-backup", backup_path.to_str().unwrap())
    .map_err(|e| e.to_string())?;

  // Clean up old backups (keep last 30 days)
  cleanup_old_backups(&backup_dir, 30)?;

  Ok(())
}

fn cleanup_old_backups(dir: &Path, keep_days: u64) -> Result<(), String> {
  let cutoff = SystemTime::now() - Duration::from_secs(keep_days * 86400);

  for entry in std::fs::read_dir(dir).map_err(|e| e.to_string())? {
    let entry = entry.map_err(|e| e.to_string())?;
    let metadata = entry.metadata().map_err(|e| e.to_string())?;

    if let Ok(modified) = metadata.modified() {
      if modified < cutoff {
        std::fs::remove_file(entry.path())
          .map_err(|e| e.to_string())?;
      }
    }
  }

  Ok(())
}
```

**Frontend Handler:**
```typescript
import { listen } from '@tauri-apps/api/event';
import { exportLibrary } from '@/lib/export';

listen<string>('perform-backup', async (event) => {
  const backupPath = event.payload;

  try {
    // Export current library
    const data = await exportLibrary('json');

    // Write to backup location
    await fs.writeTextFile(backupPath, data);

    console.log(`Auto-backup saved to ${backupPath}`);
  } catch (error) {
    console.error('Auto-backup failed:', error);
  }
});
```

#### Settings UI

**Location:** Settings > Data & Privacy > Backups

```tsx
<div className="space-y-4">
  <div>
    <Switch checked={autoBackupEnabled} onChange={setAutoBackupEnabled}>
      Enable automatic backups
    </Switch>
    <p className="text-sm text-white/60 mt-1">
      Your library will be backed up daily at 3 AM
    </p>
  </div>

  {autoBackupEnabled && (
    <>
      <div>
        <label>Backup frequency</label>
        <Select value={backupFrequency}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
      </div>

      <div>
        <label>Keep backups for</label>
        <Select value={backupRetention}>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={365}>1 year</option>
        </Select>
      </div>

      <div>
        <label>Backup location</label>
        <div className="flex items-center gap-2">
          <Input
            value={backupLocation}
            readOnly
            className="flex-1"
          />
          <Button onClick={chooseBackupLocation} variant="outline">
            Change
          </Button>
        </div>
        <p className="text-xs text-white/50 mt-1">
          Default: {defaultBackupPath}
        </p>
      </div>

      <Divider />

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Last backup</p>
          <p className="text-sm text-white/60">
            {lastBackupTime ? formatDistanceToNow(lastBackupTime) + ' ago' : 'Never'}
          </p>
        </div>
        <Button onClick={triggerBackupNow} variant="outline">
          Backup Now
        </Button>
      </div>

      <Button onClick={viewBackups} variant="outline" className="w-full">
        View Backups
      </Button>
    </>
  )}
</div>
```

#### Backup Manager UI

**Modal to view and restore backups:**

```tsx
function BackupManager() {
  const backups = useBackups(); // List all backup files

  return (
    <Modal title="Backup Manager">
      <div className="space-y-2">
        {backups.map(backup => (
          <div key={backup.path} className="pill-bg p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{backup.filename}</p>
              <p className="text-sm text-white/60">
                {formatBytes(backup.size)} • {format(backup.date, 'PPpp')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => restoreBackup(backup.path)}
                variant="primary"
                size="sm"
              >
                Restore
              </Button>
              <Button
                onClick={() => deleteBackup(backup.path)}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
```

#### Restore Flow

```typescript
async function restoreBackup(backupPath: string) {
  const confirmed = await confirm(
    'This will replace your current library with the backup. This action cannot be undone. Continue?',
    { title: 'Restore Backup', type: 'warning' }
  );

  if (!confirmed) return;

  // Additional safety: export current state first
  const currentBackup = await exportLibrary('json');
  const safetyPath = await path.join(
    await path.appDataDir(),
    `pre-restore-backup-${Date.now()}.json`
  );
  await fs.writeTextFile(safetyPath, currentBackup);

  try {
    // Read backup file
    const backupData = await fs.readTextFile(backupPath);

    // Import
    await importLibrary(JSON.parse(backupData));

    toast.success('Backup restored successfully');
  } catch (error) {
    toast.error(`Restore failed: ${error.message}`);

    // Offer to restore from safety backup
    const revert = await confirm(
      'Would you like to revert to your previous state?',
      { title: 'Restore Failed' }
    );

    if (revert) {
      const safetyData = await fs.readTextFile(safetyPath);
      await importLibrary(JSON.parse(safetyData));
    }
  }
}
```

#### Notifications

**After successful backup:**
```rust
// Optional: notify user
app.notification()
  .builder()
  .title("Backup Complete")
  .body(format!("Library backed up successfully ({} items)", item_count))
  .show()?;
```

**User setting:**
```tsx
<Checkbox checked={notifyOnBackup}>
  Show notification when backup completes
</Checkbox>
```

#### Default Paths

**Windows:** `C:\Users\<username>\AppData\Roaming\Watchfolio\backups\`
**macOS:** `~/Library/Application Support/Watchfolio/backups/`
**Linux:** `~/.local/share/Watchfolio/backups/`

#### Cloud Sync Integration

**Advanced:** Also backup to cloud storage

```tsx
<Checkbox checked={backupToCloud}>
  Also save backups to cloud (via Appwrite Storage)
</Checkbox>
```

Requires Appwrite Storage bucket setup.

#### ROI Analysis

**Development Time:** 2 hours
**User Benefit:** High - prevents catastrophic data loss
**Support Reduction:** Users can self-recover from mistakes
**Risk:** Low - well-established pattern

**Verdict:** ✅ Implement in Phase 3 - valuable safety feature

---

### 4.4 Custom Export Location

**Priority:** 🟢 Low | **Status:** 🚧 Partial | **Difficulty:** 🟢 Easy | **Time:** 30m | **Impact:** ⭐

#### Current State

- File picker opens for export ✅
- User selects location each time ❌
- No "remember last location" ❌

#### Enhancement

Remember last export directory:

```typescript
// When user exports
const lastDir = localStorage.getItem('lastExportDir') || await path.documentDir();

const selected = await dialog.save({
  defaultPath: await path.join(lastDir, 'watchfolio-export.json'),
  filters: [{ name: 'JSON', extensions: ['json'] }]
});

if (selected) {
  // Save directory for next time
  const dir = await path.dirname(selected);
  localStorage.setItem('lastExportDir', dir);

  // Perform export
  await exportToFile(selected);
}
```

#### Settings Option

```tsx
// Settings > Data & Privacy > Export
<div>
  <label>Default export location</label>
  <div className="flex gap-2">
    <Input value={defaultExportDir} readOnly className="flex-1" />
    <Button onClick={chooseExportDir} variant="outline">
      Change
    </Button>
  </div>
  <Button onClick={() => setDefaultExportDir(null)} variant="ghost" size="sm">
    Reset to Documents folder
  </Button>
</div>
```

#### Verdict

**Benefit:** Minor convenience (saves 1-2 clicks)
**Effort:** Very low
**Priority:** Low - quick win if doing related work

**Recommendation:** ✅ Include when implementing 4.2 (Drag & Drop Import)

---

### 4.5 Watch Folder for Imports

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🔴 Hard | **Time:** 3h | **Impact:** ⭐

#### Description

Monitor a specific folder (e.g., `~/Downloads/Watchfolio Imports/`) and automatically import any `.json` or `.watchfolio` files placed there.

#### Use Case

Power users who have automated workflows (e.g., scripts that generate watchlists) can drop files into this folder and have them auto-import.

**Niche feature** - 99% of users won't use this.

#### Implementation Complexity

**File watching:**
```rust
use notify::{Watcher, RecursiveMode, watcher};
use std::sync::mpsc::channel;
use std::time::Duration;

fn watch_import_folder(path: PathBuf, app: AppHandle) {
  let (tx, rx) = channel();

  let mut watcher = watcher(tx, Duration::from_secs(2)).unwrap();
  watcher.watch(path, RecursiveMode::NonRecursive).unwrap();

  std::thread::spawn(move || {
    loop {
      match rx.recv() {
        Ok(event) => {
          if let notify::DebouncedEvent::Create(path) = event {
            if path.extension() == Some("json") {
              app.emit_all("auto-import", path.to_str().unwrap()).unwrap();
            }
          }
        },
        Err(e) => eprintln!("Watch error: {:?}", e),
      }
    }
  });
}
```

**Challenges:**
1. File might still be writing (partial file)
2. Duplicate detection (same file dropped twice)
3. Malformed files
4. Permission issues
5. Cross-platform path differences

#### Verdict

**Pros:** Cool for automation enthusiasts
**Cons:** Complex edge cases, very limited audience
**Priority:** Very low - niche feature

**Recommendation:** ⚠️ Skip - not worth complexity for <1% user benefit

---

## Category 5: URL & Protocol Handling

### 5.1 Custom URL Protocol (watchfolio://)

**Priority:** 🟡 Medium | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 1h | **Impact:** ⭐⭐

#### Description

Register `watchfolio://` URL scheme so clicking links like `watchfolio://movie/550` opens Watchfolio and navigates to that movie.

#### Use Cases

1. **Browser bookmarks:** Save direct links to specific movies
2. **Browser extension:** Future integration (one-click add from TMDB)
3. **Email/chat:** Share deep links with other users
4. **Documentation:** Link to specific app pages

#### URL Scheme Design

```
watchfolio://movie/<tmdb-id>         → Open movie details
watchfolio://tv/<tmdb-id>            → Open TV show details
watchfolio://search/<query>          → Open search with query
watchfolio://library/<status>        → Open library filtered by status
watchfolio://mood-match              → Open mood recommendations
watchfolio://settings/preferences    → Open specific settings page
```

#### Implementation

**1. Register Protocol (tauri.conf.json):**

```json
{
  "plugins": {
    "deep-link": {
      "schemes": ["watchfolio"]
    }
  }
}
```

**2. Handle Deep Links (Rust):**

```rust
use tauri_plugin_deep_link::DeepLinkExt;

.setup(|app| {
  // Register deep link handler
  app.deep_link().register_all()?;

  // Listen for deep link events
  app.deep_link().on_open_url(|app, urls| {
    for url in urls {
      println!("Deep link opened: {}", url);

      // Parse and emit to frontend
      if let Some(route) = parse_deep_link(&url) {
        app.emit_all("deep-link-navigate", route).unwrap();
      }
    }
  });

  Ok(())
})
```

**3. Parse Deep Links:**

```rust
fn parse_deep_link(url: &str) -> Option<String> {
  if !url.starts_with("watchfolio://") {
    return None;
  }

  let path = url.strip_prefix("watchfolio://").unwrap();

  // Convert protocol URL to app route
  Some(match path.split_once('/') {
    Some(("movie", id)) => format!("/movie/{}", id),
    Some(("tv", id)) => format!("/tv/{}", id),
    Some(("search", query)) => format!("/search?q={}", query),
    Some(("library", status)) => format!("/library/{}", status),
    _ => format!("/{}", path),
  })
}
```

**4. Frontend Navigation:**

```typescript
import { listen } from '@tauri-apps/api/event';
import { useNavigate } from 'react-router';

function DeepLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const unlisten = listen<string>('deep-link-navigate', (event) => {
      const route = event.payload;
      console.log('Navigating to:', route);

      // Show and focus window
      getCurrentWindow().show();
      getCurrentWindow().setFocus();

      // Navigate to route
      navigate(route);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, [navigate]);

  return null;
}
```

#### Platform-Specific Behavior

**Windows:**
- Installer creates registry key: `HKEY_CLASSES_ROOT\watchfolio`
- User may see security warning first time

**macOS:**
- Registered in `Info.plist` under `CFBundleURLTypes`
- Gatekeeper approval required (notarization)

**Linux:**
- `.desktop` file includes `MimeType=x-scheme-handler/watchfolio`
- Desktop environment dependent

#### Testing

**Create test HTML file:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Watchfolio Deep Link Test</title>
</head>
<body>
  <h1>Click to test deep links:</h1>
  <ul>
    <li><a href="watchfolio://movie/550">Fight Club</a></li>
    <li><a href="watchfolio://search/inception">Search: Inception</a></li>
    <li><a href="watchfolio://library/watching">My Watching List</a></li>
    <li><a href="watchfolio://mood-match">Mood Recommendations</a></li>
  </ul>
</body>
</html>
```

**Test cases:**
- [ ] Click link when app not running → App launches and navigates
- [ ] Click link when app running → App focuses and navigates
- [ ] Invalid URL → App shows error or ignores
- [ ] Malformed URL → Graceful fallback
- [ ] URL with special characters → Properly decoded

#### Security Considerations

**Validate all inputs:**
```rust
fn parse_deep_link(url: &str) -> Option<String> {
  // Sanitize input
  let safe_url = url.trim();

  // Validate scheme
  if !safe_url.starts_with("watchfolio://") {
    return None;
  }

  // Validate path (no directory traversal)
  if safe_url.contains("..") || safe_url.contains("\\") {
    return None;
  }

  // Additional validation...
}
```

#### User Documentation

Add to help/onboarding:

```md
### Deep Links

You can create direct links to specific content in Watchfolio:

- Movies: `watchfolio://movie/<tmdb-id>`
- TV Shows: `watchfolio://tv/<tmdb-id>`
- Search: `watchfolio://search/<query>`
- Library: `watchfolio://library/<status>`

Example: `watchfolio://movie/550` opens Fight Club
```

#### ROI Analysis

**Development Time:** 1 hour
**Enables:** Browser extension, sharing, automation
**User Benefit:** Medium - power user feature
**Complexity:** Low - plugin handles most work

**Verdict:** ✅ Implement in Phase 3 - enables ecosystem features

---

### 5.2 TMDB URL Handler

**Priority:** 🟡 Medium | **Status:** ❌ Missing | **Difficulty:** 🟢 Easy | **Time:** 30m | **Impact:** ⭐⭐

#### Description

Detect when user clicks a TMDB link (e.g., `https://www.themoviedb.org/movie/550`) and offer to open in Watchfolio instead of browser.

#### Depends On

Requires **5.1 Custom URL Protocol** to be implemented first.

#### Implementation

**Option A: Browser extension** (separate project)
- Extension intercepts TMDB URLs
- Converts to `watchfolio://` protocol
- Opens app

**Option B: System-level URL interception** (complex)
- Register as handler for `themoviedb.org` URLs
- Not recommended (conflicts with browser)

**Option C: Bookmarklet** (simple)
```javascript
// User saves this as bookmark
javascript:(function(){
  const url = window.location.href;
  const match = url.match(/themoviedb.org\/(movie|tv)\/(\d+)/);
  if (match) {
    window.location.href = `watchfolio://${match[1]}/${match[2]}`;
  }
})();
```

#### Verdict

**Requires browser extension** for best UX - separate project scope.

**Recommendation:** ⚠️ Defer until v1.0+ with browser extension project

---

### 5.3 Share Sheet Integration (macOS)

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🔴 Hard | **Time:** 4h | **Impact:** ⭐

#### Description

macOS native share menu: Safari → Share → "Add to Watchfolio"

#### Implementation Requirements

- macOS Share Extension (separate target in Xcode)
- Swift/Objective-C code
- Complex signing and entitlements

**Not practical for Tauri app** - requires native macOS development.

**Verdict:** ⚠️ Skip - too complex for minimal benefit

---

### 5.4 Browser Extension Communication

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🔴 Hard | **Time:** 8h+ | **Impact:** ⭐⭐

#### Description

Browser extension that communicates with desktop app via native messaging, allowing "Add to Watchfolio" button on TMDB, IMDb, etc.

#### Scope

This is a **separate project** (browser extension development).

**Components:**
1. Browser extension (Chrome/Firefox/Safari)
2. Native messaging host (Rust binary)
3. Communication protocol
4. Icon and UI

**Verdict:** ⚠️ Out of scope for core app - separate roadmap item for v1.0+

---

## Category 6: Shortcuts & Quick Actions

### 6.1 Global Quick Add Shortcut

**Priority:** 🟠 High | **Status:** ✅ Done | **Difficulty:** - | **Time:** - | **Impact:** ⭐⭐⭐

#### Status: ✅ Already Implemented

- Ctrl+Shift+A opens Quick Add window from anywhere ✅
- Window is always-on-top, transparent ✅
- Registered via `tauri-plugin-global-shortcut` ✅

**No additional work needed.**

---

### 6.2 Global Search Shortcut

**Priority:** 🟡 Medium | **Status:** ❌ Missing | **Difficulty:** 🟢 Easy | **Time:** 30m | **Impact:** ⭐⭐

#### Description

Register Ctrl+Shift+F to focus main window and activate search input.

#### Implementation

**1. Register shortcut (shortcuts.rs):**

```rust
pub fn register_shortcuts(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
  use tauri_plugin_global_shortcut::{Code, Modifiers, ShortcutState};

  // Quick Add (already exists)
  app.global_shortcut().register("Ctrl+Shift+A", |app, _event, _shortcut| {
    // ... existing code
  })?;

  // Global Search (NEW)
  app.global_shortcut().register("Ctrl+Shift+F", |app, _event, _shortcut| {
    if let Some(window) = app.get_window("main") {
      window.show().unwrap();
      window.set_focus().unwrap();

      // Emit event to focus search
      app.emit_all("global-search-activate", ()).unwrap();
    }
  })?;

  Ok(())
}
```

**2. Frontend handler:**

```typescript
import { listen } from '@tauri-apps/api/event';

function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unlisten = listen('global-search-activate', () => {
      // Focus search input
      inputRef.current?.focus();
      inputRef.current?.select(); // Select existing text for easy replacement
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="search"
      placeholder="Search movies & TV shows..."
      // ... other props
    />
  );
}
```

**3. Also navigate to search page if not already there:**

```typescript
listen('global-search-activate', () => {
  // Navigate to search page
  if (location.pathname !== '/search') {
    navigate('/search');
  }

  // Then focus input
  setTimeout(() => {
    inputRef.current?.focus();
  }, 100); // Small delay for navigation
});
```

#### User Documentation

Add to keyboard shortcuts help:

```md
**Global Shortcuts**
- `Ctrl+Shift+A` - Quick Add (works anywhere)
- `Ctrl+Shift+F` - Focus Search (works anywhere)
```

#### Testing

- [ ] Press Ctrl+Shift+F when app in background → App shows and search is focused
- [ ] Press when already on search page → Search input refocuses
- [ ] Press when on different page → Navigates to search and focuses
- [ ] Text in search input is selected (easy to replace)

#### Verdict

**Pros:** Natural complement to Quick Add shortcut
**Cons:** None - simple addition
**Priority:** Medium - nice ergonomic improvement

**Recommendation:** ✅ Implement in Phase 2 alongside other shortcuts

---

### 6.3 Clipboard Monitoring

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 2h | **Impact:** ⭐⭐

#### Description

Monitor clipboard for TMDB/IMDb URLs and show toast: "Add [Movie Title] to library?"

#### Example Flow

1. User copies `https://www.themoviedb.org/movie/550-fight-club`
2. Watchfolio detects TMDB URL in clipboard
3. Toast appears: "Add 'Fight Club' to your library? [Add] [Dismiss]"
4. User clicks Add → Quick Add modal opens pre-filled

#### Implementation

**Clipboard monitoring:**

```rust
use tauri_plugin_clipboard::ClipboardExt;

pub fn start_clipboard_monitor(app: AppHandle) {
  std::thread::spawn(move || {
    let mut last_clipboard = String::new();

    loop {
      std::thread::sleep(std::time::Duration::from_secs(1));

      // Read clipboard
      if let Ok(clipboard) = app.clipboard().read_text() {
        if clipboard != last_clipboard && is_media_url(&clipboard) {
          last_clipboard = clipboard.clone();

          // Parse URL and emit event
          if let Some(media) = parse_media_url(&clipboard) {
            app.emit_all("clipboard-media-detected", media).unwrap();
          }
        }
      }
    }
  });
}

fn is_media_url(url: &str) -> bool {
  url.contains("themoviedb.org") ||
  url.contains("imdb.com") ||
  url.contains("letterboxd.com")
}
```

**Frontend toast:**

```typescript
import { listen } from '@tauri-apps/api/event';

listen<MediaInfo>('clipboard-media-detected', (event) => {
  const { title, type, tmdbId } = event.payload;

  toast(
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <p className="font-medium">Add to library?</p>
        <p className="text-sm text-white/60">{title}</p>
      </div>
      <Button
        size="sm"
        onClick={() => {
          openQuickAdd({ tmdbId, mediaType: type });
          toast.dismiss();
        }}
      >
        Add
      </Button>
    </div>,
    { duration: 8000 }
  );
});
```

#### Privacy Concerns

**⚠️ Reading clipboard is sensitive**

- Requires explicit permission on some platforms
- Users may feel violated if app reads clipboard without consent
- MUST be opt-in

**Settings:**

```tsx
// Settings > Privacy
<div className="border border-warning/50 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h4 className="font-medium mb-2">Clipboard Monitoring</h4>
      <p className="text-sm text-white/60 mb-3">
        Watchfolio can monitor your clipboard for movie links and offer to add them
        automatically. This feature requires access to your clipboard.
      </p>
      <Switch checked={clipboardMonitoring} onChange={setClipboardMonitoring}>
        Enable clipboard monitoring
      </Switch>
    </div>
  </div>
</div>
```

**Default:** DISABLED

#### Platform Permissions

**macOS:** Requires clipboard access permission (user prompted)
**Windows:** No special permission needed
**Linux:** Varies by desktop environment

#### Testing

- [ ] Copy TMDB URL → Toast appears
- [ ] Copy IMDb URL → Toast appears
- [ ] Copy non-media URL → No toast
- [ ] Click "Add" → Quick Add opens pre-filled
- [ ] Dismiss toast → No action taken
- [ ] Disable setting → Monitoring stops

#### Alternative: Manual Paste

Instead of automatic monitoring, provide a "Paste Link" button:

```tsx
<Button
  onClick={async () => {
    const clipboard = await navigator.clipboard.readText();
    if (isMediaUrl(clipboard)) {
      const media = parseMediaUrl(clipboard);
      openQuickAdd(media);
    } else {
      toast.error('No valid movie link in clipboard');
    }
  }}
>
  Paste Link
</Button>
```

**Safer and less invasive.**

#### Verdict

**Pros:** Convenient for power users
**Cons:** Privacy concerns, could be annoying
**Priority:** Low - niche feature with privacy trade-offs

**Recommendation:** ⚠️ Consider manual "Paste Link" button instead (Phase 4)

---

### 6.4 Custom Global Shortcuts

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🟡 Medium | **Time:** 2h | **Impact:** ⭐

#### Description

Allow users to customize keyboard shortcuts in Settings (e.g., change Quick Add from Ctrl+Shift+A to Ctrl+Alt+Q).

#### UI Mockup

**Settings > Keyboard > Customize Shortcuts**

```tsx
<div className="space-y-2">
  {shortcuts.map(shortcut => (
    <div key={shortcut.id} className="flex items-center justify-between pill-bg p-3">
      <div>
        <p className="font-medium">{shortcut.label}</p>
        <p className="text-sm text-white/60">{shortcut.description}</p>
      </div>

      <div className="flex items-center gap-2">
        <kbd className="kbd">{shortcut.currentKey}</kbd>
        <Button
          size="sm"
          variant="outline"
          onClick={() => editShortcut(shortcut.id)}
        >
          Change
        </Button>
        {shortcut.isCustom && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => resetShortcut(shortcut.id)}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  ))}
</div>
```

#### Shortcut Recording

```tsx
function ShortcutRecorder({ onRecord }: { onRecord: (keys: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [pressed, setPressed] = useState<string[]>([]);

  useEffect(() => {
    if (!recording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const keys = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Meta');

      if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
        keys.push(e.key.toUpperCase());

        // Complete recording
        const shortcut = keys.join('+');
        onRecord(shortcut);
        setRecording(false);
      }

      setPressed(keys);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recording, onRecord]);

  return (
    <Button
      onClick={() => setRecording(!recording)}
      variant={recording ? 'primary' : 'outline'}
    >
      {recording ? `Press keys... (${pressed.join('+')})` : 'Record Shortcut'}
    </Button>
  );
}
```

#### Validation

```typescript
function validateShortcut(shortcut: string, existingShortcuts: Map<string, string>): string | null {
  // Check if already in use
  if (existingShortcuts.has(shortcut)) {
    return `Already assigned to "${existingShortcuts.get(shortcut)}"`;
  }

  // Require at least one modifier
  if (!shortcut.includes('Ctrl') && !shortcut.includes('Alt') && !shortcut.includes('Meta')) {
    return 'Must include at least one modifier key (Ctrl, Alt, or Meta)';
  }

  // Prevent conflicts with system shortcuts
  const systemShortcuts = ['Ctrl+C', 'Ctrl+V', 'Ctrl+X', 'Ctrl+A', 'Ctrl+Z'];
  if (systemShortcuts.includes(shortcut)) {
    return 'Cannot override system shortcut';
  }

  return null; // Valid
}
```

#### Applying Custom Shortcuts

```rust
// Unregister old shortcut
app.global_shortcut().unregister(&old_shortcut)?;

// Register new shortcut
app.global_shortcut().register(&new_shortcut, handler)?;

// Save to settings
save_custom_shortcut("quick_add", &new_shortcut)?;
```

#### Verdict

**Pros:** Power user customization
**Cons:** Complex UI, testing many combinations
**Priority:** Low - most users fine with defaults

**Recommendation:** ⚠️ Nice-to-have for v0.5.0+ if there are user requests

---

### 6.5 Touch Bar Support (macOS)

**Priority:** 🟢 Low | **Status:** ❌ Missing | **Difficulty:** 🔴 Hard | **Time:** 4h | **Impact:** ⭐

#### Description

Customize MacBook Pro Touch Bar with Watchfolio controls.

#### Scope

- MacBook Pro with Touch Bar only (limited audience)
- Requires Objective-C/Swift code
- Complex Tauri integration

**Verdict:** ⚠️ Skip - very niche hardware, dying feature (Apple removed from newer models)

---

## [Continued in next section...]

---

## Implementation Roadmap

### Phase 1: Pre-Release (Week 1) - CRITICAL FIXES

**Goal:** Make v0.1.0 release-ready

| Priority | Feature | Time | Status |
|----------|---------|------|--------|
| 🔴 Critical | Fix icon configuration (add 512x512) | 2m | ❌ |
| 🔴 Critical | macOS notarization setup | 2h | ❌ |
| 🟠 High | Native update notifications | 15m | ❌ |
| 🟠 High | Dynamic tray tooltip | 30m | ❌ |

**Total Time:** ~3 hours

---

### Phase 2: Foundation (Week 2-3) - CORE UX

**Goal:** Professional desktop experience

| Priority | Feature | Time | Status |
|----------|---------|------|--------|
| 🟠 High | App launch on startup | 1h | ❌ |
| 🟠 High | Run in background (close to tray) | 30m | ❌ |
| 🟠 High | Remember window size/position | 45m | ❌ |
| 🟡 Medium | Single instance lock | 30m | ❌ |
| 🟡 Medium | Global search shortcut | 30m | ❌ |
| 🟡 Medium | GPU acceleration | 15m | ❌ |

**Total Time:** ~4 hours

---

### Phase 3: Enhancement (Week 4-5) - POLISH

**Goal:** Delightful interactions

| Priority | Feature | Time | Status |
|----------|---------|------|--------|
| 🟠 High | Drag & drop import | 2h | ❌ |
| 🟡 Medium | Custom URL protocol | 1h | ❌ |
| 🟡 Medium | TMDB URL handler | 30m | ❌ |
| 🟡 Medium | File associations | 30m | ❌ |
| 🟡 Medium | Dedicated tray icon | 1h | ❌ |
| 🟡 Medium | Sync completion notifications | 20m | ❌ |
| 🟢 Low | Custom export location | 30m | ❌ |

**Total Time:** ~6 hours

---

### Phase 4: Advanced (v0.3.0+) - POWER FEATURES

**Goal:** Differentiation & power users

| Priority | Feature | Time | Status |
|----------|---------|------|--------|
| 🟡 Medium | Auto-backup on schedule | 2h | ❌ |
| 🟡 Medium | Compact mode | 2h | ❌ |
| 🟢 Low | Network change detection | 1h | ❌ |
| 🟢 Low | System sleep/wake detection | 1.5h | ❌ |
| 🟢 Low | Manual "Paste Link" button | 30m | ❌ |
| 🟢 Low | Notification actions | 1.5h | ❌ |

**Total Time:** ~9 hours

---

### Phase 5: Enterprise (v0.5.0+) - OPTIONAL

**Goal:** Enterprise/advanced deployments

| Priority | Feature | Time | Status |
|----------|---------|------|--------|
| 🟢 Low | Custom installer UI | 2h | ❌ |
| 🟢 Low | Desktop shortcut option | 30m | ❌ |
| 🟢 Low | Silent install mode | 1h | ❌ |
| 🟢 Low | Portable version | 3h | ❌ |
| 🟢 Low | Windows Jump List | 2h | ❌ |
| 🟢 Low | Custom global shortcuts | 2h | ❌ |

**Total Time:** ~11 hours

---

## Platform Support Matrix

| Feature | Windows | macOS | Linux | Notes |
|---------|---------|-------|-------|-------|
| Auto-start | ✅ | ✅ | ✅ | Registry / LaunchAgent / Autostart |
| Close to tray | ✅ | ⚠️ | ✅ | macOS less common |
| Single instance | ✅ | ✅ | ✅ | Plugin handles all |
| Window persistence | ✅ | ✅ | ✅ | Universal |
| File associations | ✅ | ✅ | ⚠️ | Linux varies by DE |
| Drag & drop | ✅ | ✅ | ✅ | Tauri built-in |
| Custom URL protocol | ✅ | ⚠️ | ⚠️ | macOS requires notarization |
| Native notifications | ✅ | ✅ | ⚠️ | Linux varies by DE |
| Notification actions | ✅ | ✅ | ⚠️ | Limited Linux support |
| Badge count | ❌ | ✅ | ⚠️ | macOS primary |
| Sleep/wake detection | ✅ | ✅ | ⚠️ | Requires platform code |
| Touch Bar | ❌ | ⚠️ | ❌ | Deprecated hardware |
| Jump List | ✅ | ❌ | ❌ | Windows-only |
| Share Sheet | ❌ | ⚠️ | ❌ | macOS-only, complex |

**Legend:**
- ✅ Full support
- ⚠️ Partial/varies
- ❌ Not supported

---

## Decision Framework

When evaluating which features to implement, use this scoring system:

### Scoring Criteria (1-5 scale)

1. **User Impact:** How many users benefit? How significantly?
2. **Implementation Effort:** Development time + testing + maintenance
3. **Platform Parity:** Works consistently across all platforms?
4. **Competitive Advantage:** Does it differentiate from competitors?
5. **Technical Risk:** Complexity, dependencies, potential for bugs

### Formula

```
Priority Score = (User Impact × 3) + (Competitive Advantage × 2) - (Implementation Effort × 2) - (Technical Risk × 1)

High Priority: Score ≥ 8
Medium Priority: Score 4-7
Low Priority: Score < 4
```

### Example Calculation

**Feature: Drag & Drop Import**

- User Impact: 5 (huge convenience, frequently used)
- Implementation Effort: 3 (moderate complexity)
- Platform Parity: 5 (works everywhere)
- Competitive Advantage: 4 (nice differentiation)
- Technical Risk: 2 (well-supported by Tauri)

**Score:** (5×3) + (4×2) - (3×2) - (2×1) = 15 + 8 - 6 - 2 = **15 (High Priority)**

---

## Technical Dependencies

### Required Tauri Plugins

| Plugin | Features Using It | Status |
|--------|------------------|--------|
| `tauri-plugin-autostart` | App launch on startup | ❌ Not installed |
| `tauri-plugin-single-instance` | Single instance lock | ❌ Not installed |
| `tauri-plugin-notification` | All notifications | ✅ Installed |
| `tauri-plugin-updater` | Auto-updates | ✅ Installed |
| `tauri-plugin-deep-link` | URL protocol handling | ✅ Installed |
| `tauri-plugin-global-shortcut` | Global shortcuts | ✅ Installed |
| `tauri-plugin-dialog` | File pickers | ✅ Installed |
| `tauri-plugin-fs` | File operations | ✅ Installed |
| `tauri-plugin-clipboard` | Clipboard monitoring | ❌ Not installed |
| `tauri-plugin-store` | Settings persistence | ❌ Not installed |

### Installation Commands

```bash
# Install missing plugins
pnpm add @tauri-apps/plugin-autostart
pnpm add @tauri-apps/plugin-single-instance
pnpm add @tauri-apps/plugin-store
pnpm add @tauri-apps/plugin-clipboard

# Rust dependencies
cd src-tauri
cargo add tauri-plugin-autostart
cargo add tauri-plugin-single-instance
cargo add tauri-plugin-store
cargo add tauri-plugin-clipboard
```

---

## Resources & References

### Official Documentation

- [Tauri v2 Docs](https://v2.tauri.app/)
- [Tauri Plugins](https://v2.tauri.app/plugin/)
- [Tauri Security Guide](https://v2.tauri.app/security/)
- [Desktop Best Practices](https://tauri.app/v1/guides/building/)

### Platform Guidelines

- [Windows Desktop App Guidelines](https://learn.microsoft.com/en-us/windows/apps/design/)
- [macOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/macos)
- [GNOME Human Interface Guidelines](https://developer.gnome.org/hig/)

### Community Resources

- [Tauri Discord](https://discord.com/invite/tauri)
- [Tauri GitHub Discussions](https://github.com/tauri-apps/tauri/discussions)
- [Awesome Tauri](https://github.com/tauri-apps/awesome-tauri)

### Similar Apps for Inspiration

- **VS Code:** Excellent window management, deep link handling
- **Slack:** Great system tray integration, notifications
- **Spotify:** Compact mode, media shortcuts
- **Discord:** Global shortcuts, overlay mode

---

## Changelog

### Version 1.0 (2025-10-19)
- Initial comprehensive feature matrix
- 57 features categorized across 12 categories
- Implementation roadmap (5 phases)
- Platform support matrix
- Decision framework
- Technical dependencies

---

## Contributing

To propose new desktop features:

1. Add to appropriate category table
2. Include all required fields (priority, status, difficulty, time, impact)
3. Write detailed implementation notes
4. Update roadmap if high priority
5. Submit PR with rationale

---

**Document Maintained By:** Watchfolio Development Team
**Next Review:** After v0.1.0 release
**Questions?** Open an issue on GitHub
