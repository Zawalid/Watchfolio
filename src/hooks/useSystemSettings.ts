import { useState, useEffect, useCallback } from 'react';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { addToast } from '@heroui/react';
import { isDesktop } from '@/lib/platform';

interface SystemSettings {
  launchOnStartup: boolean;
  startMinimized: boolean;
  keepRunningInBackground: boolean;
}

const STORAGE_KEY = 'watchfolio_system_settings';

const DEFAULT_SETTINGS: SystemSettings = {
  launchOnStartup: false,
  startMinimized: false,
  keepRunningInBackground: true,
};

function getSettingsFromStorage(): SystemSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to parse system settings:', error);
  }
  return DEFAULT_SETTINGS;
}

function saveSettingsToStorage(settings: SystemSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save system settings:', error);
  }
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(getSettingsFromStorage);
  const [isLoading, setIsLoading] = useState(false);

  // Load autostart status and sync with Rust on mount
  useEffect(() => {
    if (!isDesktop()) return;

    const initialize = async () => {
      try {
        // Load autostart status
        const enabled = await isEnabled();
        setSettings((prev) => ({ ...prev, launchOnStartup: enabled }));

        // Sync keepRunningInBackground with Rust
        const stored = getSettingsFromStorage();
        await invoke('set_keep_running_in_background', {
          enabled: stored.keepRunningInBackground,
        });

        // Check if app was autostarted and handle window visibility
        const isAutostarted = await invoke<boolean>('was_autostarted');

        if (isAutostarted && !stored.startMinimized) {
          // User wants window visible on startup
          const window = getCurrentWindow();
          await window.show();
          await window.setFocus();
        }
      } catch (error) {
        console.error('Failed to initialize system settings:', error);
      }
    };

    initialize();
  }, []);

  const updateLaunchOnStartup = useCallback(async (enabledValue: boolean) => {
    if (!isDesktop()) return;

    setIsLoading(true);
    try {
      // Use plugin's enable/disable functions
      if (enabledValue) {
        await enable();
      } else {
        await disable();
      }

      const newSettings = { ...settings, launchOnStartup: enabledValue };
      setSettings(newSettings);
      saveSettingsToStorage(newSettings);

      addToast({
        title: 'Settings updated',
        description: `Launch on startup ${enabledValue ? 'enabled' : 'disabled'}`,
        color: 'success',
      });
    } catch (error) {
      console.error('Failed to update autostart:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update launch on startup setting',
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const updateStartMinimized = useCallback(
    (enabled: boolean) => {
      const newSettings = { ...settings, startMinimized: enabled };
      setSettings(newSettings);
      saveSettingsToStorage(newSettings);

      addToast({
        title: 'Settings updated',
        description: `Start minimized ${enabled ? 'enabled' : 'disabled'}`,
        color: 'success',
      });
    },
    [settings]
  );

  const updateKeepRunningInBackground = useCallback(
    async (enabled: boolean) => {
      const newSettings = { ...settings, keepRunningInBackground: enabled };
      setSettings(newSettings);
      saveSettingsToStorage(newSettings);

      // Sync with Rust
      try {
        await invoke('set_keep_running_in_background', { enabled });
      } catch (error) {
        console.error('Failed to sync keep running setting with Rust:', error);
      }

      addToast({
        title: 'Settings updated',
        description: enabled
          ? 'App will keep running in background when closed'
          : 'App will quit when window is closed',
        color: 'success',
      });
    },
    [settings]
  );

  return {
    settings,
    isLoading,
    updateLaunchOnStartup,
    updateStartMinimized,
    updateKeepRunningInBackground,
  };
}
