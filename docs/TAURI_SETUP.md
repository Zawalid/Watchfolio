# Tauri Setup Guide for Watchfolio

This document outlines the Tauri setup for Watchfolio's desktop and mobile applications.

## Overview

Watchfolio now supports:
- **Web** - Original browser-based app (Netlify)
- **Desktop** - Windows, macOS, and Linux (Tauri)
- **Mobile** - iOS and Android (Tauri 2.x mobile)

## Prerequisites

### Desktop Development
- **Rust** - Install from https://rustup.rs/
- **Node.js** - Already installed (using pnpm)
- **Platform-specific tools**:
  - Windows: Microsoft Visual Studio C++ Build Tools
  - macOS: Xcode Command Line Tools
  - Linux: WebKit2GTK development files

### Mobile Development
- **iOS**:
  - macOS required
  - Xcode 14+
  - iOS Simulator or physical device
- **Android**:
  - Android Studio
  - Android SDK
  - Android NDK
  - JDK 17+

## Installation

All Tauri dependencies are already configured in the project:

```bash
# Desktop development - Already installed
pnpm install

# Initialize mobile targets (one-time setup)
pnpm tauri android init  # For Android
pnpm tauri ios init      # For iOS (macOS only)
```

## Development

### Desktop
```bash
# Run desktop app in development mode
pnpm tauri:dev

# Build desktop app for production
pnpm tauri:build
```

### Mobile

#### Android
```bash
# Run on Android emulator/device
pnpm tauri:dev:android

# Build Android APK/AAB
pnpm tauri:build:android
```

#### iOS
```bash
# Run on iOS simulator/device (macOS only)
pnpm tauri:dev:ios

# Build iOS app (macOS only)
pnpm tauri:build:ios
```

## Project Structure

```
watchfolio/
├── src/                          # React app source
│   ├── lib/
│   │   ├── platform.ts          # Platform detection utilities
│   │   └── tauri/
│   │       ├── commands.ts      # Tauri command wrappers
│   │       ├── desktop.ts       # Desktop-specific features
│   │       └── mobile.ts        # Mobile-specific features
│   ├── hooks/
│   │   └── usePlatform.ts       # React hook for platform detection
│   └── main.tsx                 # Entry point with Tauri initialization
├── src-tauri/                   # Rust backend
│   ├── src/
│   │   ├── lib.rs              # Main Tauri application logic
│   │   └── main.rs             # Desktop entry point
│   ├── Cargo.toml              # Rust dependencies
│   ├── tauri.conf.json         # Tauri configuration
│   └── icons/                  # App icons
└── dist/                        # Vite build output (used by Tauri)
```

## Configuration

### Tauri Config (`src-tauri/tauri.conf.json`)

Key configurations:
- **Identifier**: `com.watchfolio.app`
- **Window**: 1280x800 (min 800x600)
- **CSP**: Configured for TMDB, Appwrite, and Gemini AI APIs
- **Plugins**: OS, Dialog, Notification, Deep Link, Global Shortcuts

### Vite Config (`vite.config.ts`)

Tauri-specific settings:
- **Port**: 5173 (strict)
- **Host**: 127.0.0.1
- **Env Prefix**: VITE_, TAURI_
- **Clear Screen**: false (for Tauri CLI output)

## Platform Detection

Use the platform utilities to detect and adapt to the current environment:

```typescript
import { usePlatform } from '@/hooks/usePlatform';
import { isTauri, isDesktop, isMobile, isWeb } from '@/lib/platform';

function MyComponent() {
  const { platform, capabilities } = usePlatform();

  if (platform === 'desktop') {
    // Desktop-specific UI
  }

  if (capabilities.hasNativeNotifications()) {
    // Use native notifications
  }
}
```

## Tauri Commands

Available Rust commands (invoked from TypeScript):

### Export Data
```typescript
import { exportData } from '@/lib/tauri/commands';

await exportData({
  path: '/path/to/file.json',
  format: 'json',
  data: JSON.stringify(libraryData),
});
```

### Get Platform Info
```typescript
import { getPlatformInfo } from '@/lib/tauri/commands';

const info = await getPlatformInfo();
// { os: "windows", arch: "x86_64", family: "windows" }
```

## Desktop Features

Implemented features:
- ✅ Native window management
- ✅ Native menus (auto-generated)
- ✅ Global keyboard shortcuts
- ✅ File system access
- ✅ Native dialogs
- ✅ Native notifications
- ✅ Deep linking (watchfolio://)

Planned features:
- ⏳ System tray integration
- ⏳ Auto-update mechanism
- ⏳ Custom native menu

## Mobile Features

Implemented features:
- ✅ Platform detection
- ✅ Mobile-optimized UI (existing responsive design)
- ✅ Haptic feedback (web vibration API)

Planned features:
- ⏳ Biometric authentication
- ⏳ Native share sheet
- ⏳ Camera access (for barcode scanning)
- ⏳ Push notifications
- ⏳ Background sync

## Building for Production

### Desktop

```bash
# Build for current platform
pnpm tauri:build

# Output locations:
# Windows: src-tauri/target/release/bundle/msi/
# macOS: src-tauri/target/release/bundle/dmg/
# Linux: src-tauri/target/release/bundle/appimage/
```

### Mobile

```bash
# Android
pnpm tauri:build:android
# Output: src-tauri/gen/android/app/build/outputs/

# iOS
pnpm tauri:build:ios
# Output: src-tauri/gen/ios/build/
```

## Distribution

### Desktop
- **Windows**: MSI installer
- **macOS**: DMG (requires code signing for App Store)
- **Linux**: AppImage, DEB, RPM

### Mobile
- **Android**: Google Play Store or direct APK
- **iOS**: App Store (requires Apple Developer account)

## Code Signing

### macOS
1. Obtain Apple Developer account
2. Create signing certificate
3. Configure in `tauri.conf.json`:
```json
{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Your Name"
    }
  }
}
```

### Windows
Configure in `tauri.conf.json`:
```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_THUMBPRINT",
      "digestAlgorithm": "sha256"
    }
  }
}
```

## Testing

### Desktop
1. Run `pnpm tauri:dev`
2. Test all features:
   - Window management
   - Keyboard shortcuts
   - File operations
   - Notifications
   - Offline functionality

### Mobile
1. Run on simulator: `pnpm tauri:dev:android` or `pnpm tauri:dev:ios`
2. Test on physical device (connect via USB/wireless)
3. Test platform-specific features:
   - Touch gestures
   - Haptics
   - Biometrics (if implemented)
   - Native navigation

## Troubleshooting

### Desktop Build Issues
- Ensure Rust is up to date: `rustup update`
- Clear Cargo cache: `cargo clean` in `src-tauri/`
- Check platform dependencies are installed

### Mobile Build Issues
- Android: Ensure ANDROID_HOME is set
- iOS: Ensure Xcode is properly installed
- Clear build artifacts: Delete `src-tauri/gen/android` or `src-tauri/gen/ios`

### Runtime Issues
- Check browser console for Tauri API errors
- Enable Rust debug logs in `src-tauri/src/lib.rs`
- Use `pnpm tauri dev --verbose` for detailed output

## Development Workflow

1. **Web Development** (default):
   ```bash
   pnpm dev  # Regular Vite dev server
   ```

2. **Desktop Development**:
   ```bash
   pnpm tauri:dev  # Tauri window + Vite dev server
   ```

3. **Mobile Development**:
   ```bash
   pnpm tauri:dev:android  # Android emulator
   pnpm tauri:dev:ios      # iOS simulator (macOS)
   ```

## Environment Variables

Tauri apps can access environment variables prefixed with `TAURI_`:

```env
VITE_APPWRITE_ENDPOINT=...    # Web + Tauri
VITE_TMDB_API_KEY=...         # Web + Tauri
TAURI_CUSTOM_VAR=...          # Tauri only
```

## Resources

- [Tauri Documentation](https://tauri.app)
- [Tauri Discord](https://discord.com/invite/tauri)
- [Tauri GitHub](https://github.com/tauri-apps/tauri)
- [Platform-specific Guides](https://tauri.app/v2/guides/)

## Next Steps

1. ✅ Basic Tauri setup complete
2. ⏳ Test desktop app (`pnpm tauri:dev`)
3. ⏳ Initialize mobile targets
4. ⏳ Implement system tray
5. ⏳ Add auto-update
6. ⏳ Implement biometric auth (mobile)
7. ⏳ Set up CI/CD for builds
8. ⏳ Prepare for distribution

## Notes

- The web app remains the primary platform
- Desktop and mobile are enhanced experiences
- All core features work across all platforms
- Platform-specific features are optional enhancements
- Offline-first architecture benefits all platforms
