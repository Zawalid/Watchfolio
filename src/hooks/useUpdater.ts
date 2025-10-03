import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { relaunch } from '@tauri-apps/plugin-process';
import { isDesktop } from '@/lib/platform';
import { addToast } from '@heroui/react';

interface UpdateInfo {
  version: string;
  currentVersion: string;
  date?: string;
  body?: string;
}

interface UpdateProgress {
  chunkLength: number;
  contentLength?: number;
}

export function useUpdater() {
  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [readyToInstall, setReadyToInstall] = useState(false);

  useEffect(() => {
    if (!isDesktop()) return;

    const setupListeners = async () => {
      const unlistenAvailable = await listen<UpdateInfo>(
        'update-available',
        (event) => {
          console.log('Update available:', event.payload);
          setUpdateAvailable(true);
          setUpdateInfo(event.payload);
          setChecking(false);
          addToast({
            title: `Update available: v${event.payload.version}`,
            description: 'A new version is ready to download',
            color: 'success',
          });
        }
      );

      const unlistenNotAvailable = await listen(
        'update-not-available',
        () => {
          console.log('No update available');
          setUpdateAvailable(false);
          setUpdateInfo(null);
          setChecking(false);
        }
      );

      const unlistenProgress = await listen<UpdateProgress>(
        'update-download-progress',
        (event) => {
          const { chunkLength, contentLength } = event.payload;
          if (contentLength) {
            const progress = (chunkLength / contentLength) * 100;
            setDownloadProgress(progress);
          }
        }
      );

      const unlistenReady = await listen('update-ready-to-install', () => {
        console.log('Update ready to install');
        setDownloading(false);
        setReadyToInstall(true);
        addToast({
          title: 'Update downloaded successfully',
          description: 'The app will restart to complete installation',
          color: 'success',
        });
      });

      const unlistenInstalled = await listen('update-installed', () => {
        console.log('Update installed');
        addToast({
          title: 'Update installed!',
          description: 'Restarting app...',
          color: 'success',
        });
      });

      return () => {
        unlistenAvailable();
        unlistenNotAvailable();
        unlistenProgress();
        unlistenReady();
        unlistenInstalled();
      };
    };

    setupListeners();
  }, []);

  const checkForUpdates = useCallback(
    async (showToast = true) => {
      if (!isDesktop()) {
        if (showToast) {
          addToast({
            title: 'Updates are only available in desktop app',
            color: 'danger',
          });
        }
        return;
      }

      setChecking(true);

      try {
        await invoke('manual_check_updates');

        setTimeout(() => {
          if (!updateAvailable && showToast) {
            addToast({
              title: "You're on the latest version!",
              color: 'success',
            });
          }
        }, 1000);
      } catch (error) {
        console.error('Failed to check for updates:', error);
        setChecking(false);
        if (showToast) {
          addToast({
            title: 'Failed to check for updates',
            description: error instanceof Error ? error.message : 'Unknown error',
            color: 'danger',
          });
        }
      }
    },
    [updateAvailable]
  );

  const downloadAndInstall = useCallback(async () => {
    if (!isDesktop()) {
      addToast({
        title: 'Updates are only available in desktop app',
        color: 'danger',
      });
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);

    try {
      await invoke('install_update');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await relaunch();
    } catch (error) {
      console.error('Failed to download/install update:', error);
      setDownloading(false);
      addToast({
        title: 'Failed to install update',
        description: error instanceof Error ? error.message : 'Unknown error',
        color: 'danger',
      });
    }
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
    setUpdateInfo(null);
    setReadyToInstall(false);
  }, []);

  return {
    checking,
    updateAvailable,
    updateInfo,
    downloading,
    downloadProgress,
    readyToInstall,
    checkForUpdates,
    downloadAndInstall,
    dismissUpdate,
  };
}
