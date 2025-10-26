import packageJson from '../../package.json';

export const APP_VERSION = packageJson.version;
export const GITHUB_REPO = 'Zawalid/Watchfolio';
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
export const DOWNLOAD_BASE_URL = `${GITHUB_URL}/releases/latest/download`;

/**
 * Generate download URL for a specific file
 */
export const getDownloadUrl = (filename: string): string => {
  return `${DOWNLOAD_BASE_URL}/${filename}`;
};

/**
 * Generate versioned filename
 */
export const getVersionedFilename = (platform: string): string => {
  return `Watchfolio_${APP_VERSION}_${platform}`;
};

/**
 * Platform-specific download URLs
 */
export const PLATFORM_DOWNLOADS = {
  macOS: {
    appleSilicon: {
      filename: getVersionedFilename('aarch64.dmg'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
    intel: {
      filename: getVersionedFilename('x64.dmg'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
  },
  windows: {
    setup: {
      filename: getVersionedFilename('x64-setup.exe'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
    msi: {
      filename: getVersionedFilename('x64_en-US.msi'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
  },
  linux: {
    deb: {
      filename: getVersionedFilename('amd64.deb'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
    appImage: {
      filename: getVersionedFilename('amd64.AppImage'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
  },
} as const;
