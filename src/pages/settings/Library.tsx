import { Switch } from '@/components/ui/Switch';
import { Button } from '@heroui/react';
import { addToast } from '@heroui/react';
import { useDisclosure } from '@heroui/react';
import { Cloud, Database, Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useSyncStore } from '@/stores/useSyncStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';
import ImportExportModal from '@/components/library/ImportExportModal';
import { useClearLibrary } from '@/hooks/useClearLibrary';
import { LOCAL_STORAGE_PREFIX } from '@/utils/constants';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SettingSection } from '@/components/settings/SettingSection';

export default function Library() {
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(
    localStorage.getItem(`${LOCAL_STORAGE_PREFIX}auto-sync`) !== 'false'
  );
  const { isAuthenticated } = useAuthStore();
  const { library } = useLibraryStore();
  const syncStore = useSyncStore();
  const { handleClearLibrary } = useClearLibrary();
  const importExportDisclosure = useDisclosure();

  usePageTitle('Library - Settings');

  const handleAutoSyncToggle = (enabled: boolean) => {
    if (!isAuthenticated) {
      addToast({ title: 'Sign in required', description: 'Please sign in to sync your library', color: 'warning' });
      return;
    }
    // TODO : Add it as a user preference
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}auto-sync`, enabled.toString());
    setIsAutoSyncEnabled(enabled);
    addToast({
      title: enabled ? 'Auto-sync enabled' : 'Auto-sync disabled',
      description: enabled ? 'Your library will sync automatically' : 'Manual sync only',
      color: 'success',
    });
  };

  const handleManualSync = async () => {
    if (!isAuthenticated) {
      addToast({ title: 'Sign in required', description: 'Please sign in to sync your library', color: 'warning' });
      return;
    }

    try {
      await syncStore.syncToCloud(library);
      addToast({
        title: 'Sync completed',
        description: 'Your library has been synced successfully',
        color: 'success',
      });
    } catch {
      addToast({
        title: 'Sync failed',
        description: 'Failed to sync your library',
        color: 'danger',
      });
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <SettingSection Icon={Cloud} title='Cloud Sync'>
        <div className='relative'>
          {!isAuthenticated && (
            <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl'>
              <p className='text-Grey-300 text-center text-sm'>
                Sign in to sync your library across devices and
                <br />
                keep your data backed up in the cloud.
              </p>
            </div>
          )}
          <div className={!isAuthenticated ? 'pointer-events-none opacity-40 blur-[1px]' : ''}>
            <div className='grid grid-cols-[1fr_auto] items-center gap-6'>
              <div>
                <h4 className='text-Grey-200 font-semibold'>Auto-sync</h4>
                <p className='text-Grey-400 mt-1 text-sm'>Automatically sync your library changes across devices</p>
              </div>
              <Switch checked={isAutoSyncEnabled} onChange={(e) => handleAutoSyncToggle(e.target.checked)} />
            </div>
            <div className='border-t border-white/5 pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='text-Grey-200 font-semibold'>Manual Sync</h4>
                  <p className='text-Grey-400 mt-1 text-sm'>
                    {syncStore.status.lastSyncTime
                      ? `Last synced: ${new Date(syncStore.status.lastSyncTime).toLocaleString()}`
                      : 'Never synced'}
                  </p>
                  {syncStore.status.pendingOperations > 0 && (
                    <p className='mt-1 text-xs text-amber-300'>
                      {syncStore.status.pendingOperations} pending operations
                    </p>
                  )}
                </div>
                <Button
                  color='primary'
                  size='sm'
                  onPress={handleManualSync}
                  isLoading={syncStore.status.isSyncing}
                  isDisabled={!isAuthenticated || !syncStore.status.isOnline}
                  startContent={<RefreshCw className='size-4' />}
                >
                  Sync Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Library Management */}
      <SettingSection Icon={Database} title='Library Management'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='text-Grey-200 font-semibold'>Import & Export</h4>
              <p className='text-Grey-400 mt-1 text-sm'>Backup your library or import data from other sources</p>
            </div>
            <Button
              startContent={<Database className='size-4' />}
              className='button-secondary!'
              onPress={importExportDisclosure.onOpen}
            >
              Import / Export
            </Button>
          </div>

          <div className='text-Grey-400 flex items-center gap-4 text-xs'>
            <div className='flex items-center gap-1'>
              <Download className='size-3' />
              <span>Export to JSON/CSV</span>
            </div>
            <div className='flex items-center gap-1'>
              <Upload className='size-3' />
              <span>Import from backup</span>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Danger Zone */}
      <SettingSection
        Icon={Trash2}
        title='Danger Zone'
        iconClassName='text-red-400'
        iconContainerClassName='border-red-500/20 bg-red-500/10'
      >
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='font-semibold text-red-200'>Clear Library</h4>
            <p className='text-Grey-400 mt-1 text-sm'>
              Permanently delete all items from your library. This action cannot be undone.
            </p>
          </div>
          <Button color='danger' size='sm' onPress={handleClearLibrary} startContent={<Trash2 className='size-4' />}>
            Clear Library
          </Button>
        </div>
      </SettingSection>

      <ImportExportModal disclosure={importExportDisclosure} />
    </div>
  );
}
