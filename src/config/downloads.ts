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
export const getVersionedFilename = (baseFilename: string): string => {
  const parts = baseFilename.split('.');
  const extension = parts.pop();
  const name = parts.join('.');
  return `${name}_${APP_VERSION}.${extension}`;
};

/**
 * Platform-specific download URLs
 */
export const PLATFORM_DOWNLOADS = {
  macOS: {
    appleSilicon: {
      filename: getVersionedFilename('Watchfolio_aarch64.dmg'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
    intel: {
      filename: getVersionedFilename('Watchfolio_x64.dmg'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
  },
  windows: {
    filename: getVersionedFilename('Watchfolio_x64-setup.exe'),
    get url() {
      return getDownloadUrl(this.filename);
    },
  },
  linux: {
    deb: {
      filename: getVersionedFilename('Watchfolio_amd64.deb'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
    appImage: {
      filename: getVersionedFilename('Watchfolio_x86_64.AppImage'),
      get url() {
        return getDownloadUrl(this.filename);
      },
    },
  },
} as const;
