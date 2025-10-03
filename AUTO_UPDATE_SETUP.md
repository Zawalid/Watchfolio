# Auto-Update Setup Guide

This guide explains how to set up the auto-update system for Watchfolio desktop app using Tauri and GitHub Releases.

## Table of Contents
1. [Overview](#overview)
2. [Generate Signing Keys](#generate-signing-keys)
3. [Configure GitHub Secrets](#configure-github-secrets)
4. [Update Configuration](#update-configuration)
5. [Creating Releases](#creating-releases)
6. [Testing Updates](#testing-updates)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The auto-update system uses:
- **Tauri Updater Plugin** - Built-in update mechanism
- **GitHub Releases** - Hosting for update files
- **Digital Signatures** - Security via public/private key pairs
- **GitHub Actions** - Automated build and release process

### How It Works

1. User installs app version 1.0.0
2. App checks GitHub Releases every 24 hours (or manually)
3. If version 1.0.1 is available, app notifies user
4. User downloads update
5. App verifies signature (security)
6. App installs and restarts

---

## Generate Signing Keys

**This is a ONE-TIME setup!**

### Step 1: Install Tauri CLI (if not already installed)

```bash
pnpm install --global @tauri-apps/cli
```

### Step 2: Generate Key Pair

```bash
# Navigate to your project root
cd D:\Code\Projects\Watchfolio

# Generate signing keys
pnpm tauri signer generate -w .tauri-key

# You'll be prompted to set a password - REMEMBER THIS!
```

This creates two files:
- **`.tauri-key`** - Your PRIVATE key (NEVER commit this!)
- **`.tauri-key.pub`** - Your PUBLIC key

### Step 3: Add Private Key to .gitignore

```bash
echo ".tauri-key" >> .gitignore
```

**CRITICAL: Never commit .tauri-key to git!**

### Step 4: Get the Public Key

```bash
# Display the public key
cat .tauri-key.pub
```

You'll see output like:
```
dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IEJDQ...
```

**Copy this entire string - you'll need it in the next step!**

---

## Configure GitHub Secrets

These secrets are used by GitHub Actions to sign releases.

### Step 1: Get Private Key Content

```bash
# Windows (PowerShell)
Get-Content .tauri-key | Set-Clipboard

# macOS/Linux
cat .tauri-key | pbcopy  # macOS
cat .tauri-key | xclip   # Linux
```

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

**Add these two secrets:**

**Secret 1: TAURI_SIGNING_PRIVATE_KEY**
- Name: `TAURI_SIGNING_PRIVATE_KEY`
- Value: Paste the ENTIRE content of `.tauri-key` file
- Click **Add secret**

**Secret 2: TAURI_SIGNING_PRIVATE_KEY_PASSWORD**
- Name: `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- Value: The password you set when generating the key
- Click **Add secret**

---

## Update Configuration

### Step 1: Add Public Key to tauri.conf.json

Open `src-tauri/tauri.conf.json` and replace the placeholder:

```json
{
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://github.com/{{owner}}/{{repo}}/releases/latest/download/latest.json"
      ],
      "dialog": false,
      "pubkey": "PASTE_YOUR_PUBLIC_KEY_HERE"
    }
  }
}
```

Replace `PASTE_YOUR_PUBLIC_KEY_HERE` with the public key you copied earlier.

### Step 2: Update GitHub Owner/Repo

In the same file, the `{{owner}}` and `{{repo}}` placeholders are automatically filled by Tauri, but you need to ensure your GitHub repository is set up correctly.

**Example:**
- If your GitHub repo is `https://github.com/username/watchfolio`
- `{{owner}}` = `username`
- `{{repo}}` = `watchfolio`

The endpoint becomes:
```
https://github.com/username/watchfolio/releases/latest/download/latest.json
```

---

## Creating Releases

### Method 1: Via Git Tags (Recommended)

```bash
# Create and push a new version tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically:
# 1. Build for Windows, macOS (Intel + Apple Silicon), Linux
# 2. Sign all binaries
# 3. Generate latest.json
# 4. Create a draft release
# 5. Publish the release
```

### Method 2: Manual Workflow Dispatch

1. Go to GitHub → **Actions** → **Release Desktop App**
2. Click **Run workflow**
3. Enter version (e.g., `v1.0.0`)
4. Click **Run workflow**

### Version Naming

**ALWAYS use semantic versioning with 'v' prefix:**
- ✅ `v1.0.0`
- ✅ `v1.0.1`
- ✅ `v2.0.0-beta.1`
- ❌ `1.0.0` (missing 'v')
- ❌ `release-1.0.0` (wrong format)

---

## Release Workflow Details

When you push a tag, GitHub Actions:

1. **Builds on 4 platforms:**
   - Windows x64 (`.exe` installer)
   - macOS Apple Silicon (`.dmg`)
   - macOS Intel (`.dmg`)
   - Linux x64 (`.AppImage`, `.deb`)

2. **Signs each binary** with your private key

3. **Generates `latest.json`:**
   ```json
   {
     "version": "1.0.0",
     "notes": "Bug fixes and improvements",
     "pub_date": "2025-10-03T10:00:00Z",
     "platforms": {
       "windows-x86_64": {
         "signature": "dW50cnVzdGVk...",
         "url": "https://github.com/user/repo/releases/download/v1.0.0/watchfolio_1.0.0_x64-setup.exe"
       },
       "darwin-aarch64": { ... },
       "darwin-x86_64": { ... },
       "linux-x86_64": { ... }
     }
   }
   ```

4. **Creates draft release** on GitHub

5. **Publishes release** (makes it available)

---

## Testing Updates

### Test Locally (Before Release)

1. Build your app:
   ```bash
   pnpm tauri build
   ```

2. Install the built version on your machine

3. Create a test release on GitHub with a higher version number

4. Open the app and go to **Settings** → **Updates** → **Check for Updates**

5. Verify:
   - Update notification appears
   - Download works
   - Installation succeeds
   - App restarts with new version

### Test Update Flow

**Scenario: Update from v1.0.0 to v1.0.1**

1. Install v1.0.0 on your machine
2. Create and publish v1.0.1 release on GitHub
3. Open app
4. Update banner should appear (or check manually)
5. Click "Download & Install"
6. Progress bar shows download
7. When complete, click "Restart to Install"
8. App restarts with v1.0.1

---

## Troubleshooting

### Update Check Fails

**Problem:** "Failed to check for updates"

**Solutions:**
1. Check internet connection
2. Verify GitHub repository is public (or access token is set)
3. Check `tauri.conf.json` endpoint URL is correct
4. Verify `latest.json` exists in the latest release

### Signature Verification Failed

**Problem:** "Update signature verification failed"

**Solutions:**
1. Ensure public key in `tauri.conf.json` matches the private key used to sign
2. Verify GitHub secrets are set correctly
3. Check that Tauri Action used the `TAURI_SIGNING_PRIVATE_KEY` secret
4. Re-generate keys if corrupted

### Download Hangs or Fails

**Problem:** Update downloads but never completes

**Solutions:**
1. Check GitHub release assets are uploaded correctly
2. Verify file URLs in `latest.json` are accessible
3. Check firewall/antivirus isn't blocking download
4. Ensure sufficient disk space

### App Doesn't Restart After Update

**Problem:** Update installs but app doesn't restart

**Solutions:**
1. On Windows: Check if app has admin permissions
2. On macOS: Verify app is in `/Applications`
3. Check system logs for errors
4. Try manual restart

---

## Security Best Practices

1. **NEVER commit `.tauri-key`** to git
2. **Rotate keys yearly** or if compromised
3. **Keep password secure** - store in password manager
4. **Test releases** before marking as latest
5. **Use draft releases** for testing
6. **Monitor release downloads** for suspicious activity

---

## Updating the Updater

If you need to change the update system:

1. **Change endpoints:** Update `tauri.conf.json`
2. **Rotate keys:**
   - Generate new key pair
   - Update GitHub secrets
   - Update `tauri.conf.json` with new public key
   - Create new release (all future updates will use new key)
3. **Disable auto-update:** Set `"active": false` in config

---

## Release Checklist

Before creating a release:

- [ ] Update version in `package.json`
- [ ] Update version in `src-tauri/Cargo.toml`
- [ ] Update version in `src-tauri/tauri.conf.json`
- [ ] Update CHANGELOG.md
- [ ] Test build locally
- [ ] Commit changes
- [ ] Create and push git tag
- [ ] Wait for GitHub Actions to complete
- [ ] Test draft release
- [ ] Publish release
- [ ] Test auto-update from previous version

---

## Quick Reference

### Generate Keys
```bash
pnpm tauri signer generate -w .tauri-key
```

### Create Release
```bash
git tag v1.0.0
git push origin v1.0.0
```

### View Public Key
```bash
cat .tauri-key.pub
```

### Test Build
```bash
pnpm tauri build
```

---

## Support

If you encounter issues:

1. Check Tauri updater docs: https://v2.tauri.app/plugin/updater/
2. Check GitHub Actions logs
3. Review this guide
4. Check Tauri Discord: https://discord.gg/tauri

---

**Last Updated:** 2025-10-03
**Tauri Version:** 2.8.5
**Updater Plugin Version:** 2.0
