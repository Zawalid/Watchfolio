/**
 * Tauri command wrappers for invoking Rust backend functions
 * These are only available when running in Tauri environment
 */

import { invoke } from '@tauri-apps/api/core';
import { isTauri } from '@/lib/platform';

export interface ExportOptions {
  path: string;
  format: string;
  data: string;
}

export interface PlatformInfo {
  os: string;
  arch: string;
  family: string;
}

/**
 * Export data to the file system (desktop only)
 */
export async function exportData(options: ExportOptions): Promise<string> {
  if (!isTauri()) {
    throw new Error('Export is only available in desktop app');
  }
  return await invoke<string>('export_data', { options });
}

/**
 * Get platform information from Rust backend
 */
export async function getPlatformInfo(): Promise<PlatformInfo> {
  if (!isTauri()) {
    return {
      os: 'web',
      arch: 'unknown',
      family: 'web',
    };
  }
  return await invoke<PlatformInfo>('get_platform_info');
}

/**
 * Check if running in Tauri (from Rust side)
 */
export async function checkIsTauri(): Promise<boolean> {
  if (!isTauri()) return false;
  return await invoke<boolean>('is_tauri');
}
