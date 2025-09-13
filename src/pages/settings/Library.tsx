import { Switch } from '@/components/ui/Switch';
import { Button } from '@heroui/react';
import { addToast } from '@heroui/react';
import { useDisclosure } from '@heroui/react';
import { Cloud, Database, Download, Upload, Trash2, RefreshCw, Library as LibraryIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import ImportExportModal from '@/components/library/ImportExportModal';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SettingSection } from '@/components/settings/SettingSection';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useSyncStore } from '@/stores/useSyncStore';
import { useClearLibrary } from '@/hooks/library/useLibraryMutations';

export default function Library() {
  const { isAuthenticated, userPreferences, updateUserPreferences } = useAuthStore();
  const { syncStatus, lastSyncTime, manualSync, toggleAutoSync } = useSyncStore();

  const { clearLibrary } = useClearLibrary();

  const importExportDisclosure = useDisclosure();

  const isSyncing = syncStatus === 'syncing' || syncStatus === 'connecting';

  usePageTitle('Library - Settings');

  const handleAutoSyncToggle = async (enabled: boolean) => {
    if (!isAuthenticated) {
      addToast({ title: 'Sign in required', description: 'Please sign in to sync your library', color: 'warning' });
      return;
    }
    try {
      await toggleAutoSync(enabled);
      addToast({
        title: enabled ? 'Auto-sync enabled' : 'Auto-sync disabled',
        description: enabled ? 'Your library will sync automatically' : 'Manual sync only',
        color: 'success',
      });
    } catch {
      addToast({ title: 'Error', description: 'Failed to update auto-sync preference.', color: 'danger' });
    }
  };

  const handleManualSync = async () => {
    if (!isAuthenticated) {
      addToast({ title: 'Sign in required', description: 'Please sign in to sync your library', color: 'warning' });
      return;
    }
    try {
      addToast({ title: 'Syncing...', description: 'Your library is being synced.', color: 'secondary' });
      await manualSync();
      addToast({
        title: 'Sync completed',
        description: 'Your library has been synced successfully',
        color: 'success',
      });
    } catch {
      addToast({ title: 'Sync failed', description: 'Failed to sync your library', color: 'danger' });
    }
  };

  const handleDefaultStatusChange = async (status: WatchStatus) => {
    try {
      const shouldReset = userPreferences.defaultMediaStatus === status;
      await updateUserPreferences({ defaultMediaStatus: shouldReset ? 'none' : status });
      addToast({
        title: 'Default status updated',
        description: shouldReset
          ? 'No default status will be set when adding items to your library.'
          : `Items will now be added with "${LIBRARY_MEDIA_STATUS.find((s) => s.value === status)?.label}" status by default.`,
        color: 'success',
      });
    } catch (error) {
      log('ERR', 'Failed to update default status:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update default status. Please try again.',
        color: 'danger',
      });
    }
  };

  return (
    <div className='flex flex-col gap-6 sm:gap-8'>
      <SettingSection Icon={Cloud} title='Cloud Sync'>
        <div className='relative'>
          {!isAuthenticated && (
            <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl'>
              <p className='text-Grey-300 text-center text-xs sm:text-sm'>
                Sign in to sync your library across devices and
                <br className='hidden sm:block' />
                keep your data backed up in the cloud.
              </p>
            </div>
          )}
          <div className={!isAuthenticated ? 'pointer-events-none opacity-40 blur-[1px]' : ''}>
            <div className='flex flex-col gap-3 sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4 lg:gap-6'>
              <div>
                <h4 className='text-Grey-200 text-sm font-semibold sm:text-base'>Auto-sync</h4>
                <p className='text-Grey-400 mt-1 text-xs sm:text-sm'>
                  Automatically sync your library changes across devices
                </p>
              </div>
              <div className='flex justify-end sm:justify-start'>
                <Switch checked={userPreferences?.autoSync} onChange={(e) => handleAutoSyncToggle(e.target.checked)} />
              </div>
            </div>
            <div className='mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex-1'>
                <h4 className='text-Grey-200 text-sm font-semibold sm:text-base'>Manual Sync</h4>
                <p className='text-Grey-400 mt-1 text-xs sm:text-sm'>
                  {lastSyncTime ? `Last synced: ${new Date(lastSyncTime).toLocaleString()}` : 'Not synced yet'}
                </p>
              </div>
              <div className='flex justify-end sm:justify-start'>
                <Button
                  color='primary'
                  size='sm'
                  onPress={handleManualSync}
                  isLoading={isSyncing}
                  isDisabled={!isAuthenticated || isSyncing}
                  startContent={<RefreshCw className='size-4' />}
                  className='w-full sm:w-auto'
                >
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Library Management */}
      <SettingSection Icon={Database} title='Library Management'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex-1'>
              <h4 className='text-Grey-200 text-sm font-semibold sm:text-base'>Import & Export</h4>
              <p className='text-Grey-400 mt-1 text-xs sm:text-sm'>
                Backup your library or import data from other sources
              </p>
            </div>
            <div className='flex justify-end sm:justify-start'>
              <Button
                startContent={<Database className='size-4' />}
                className='button-secondary! w-full sm:w-auto'
                onPress={importExportDisclosure.onOpen}
              >
                Import / Export
              </Button>
            </div>
          </div>

          <div className='text-Grey-400 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-4'>
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

      {/* Library Preferences */}
      <SettingSection Icon={LibraryIcon} title='Library Preferences'>
        <div className='space-y-4'>
          <div>
            <h4 className='text-Grey-200 text-sm font-semibold sm:text-base'>Default Media Status</h4>
            <p className='text-Grey-400 mt-1 text-xs sm:text-sm'>
              Automatically set this status when adding items to your library (bypasses the status selection modal)
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {LIBRARY_MEDIA_STATUS.filter((status) => status.value !== 'favorites').map((status) => (
              <Button
                key={status.value}
                size='sm'
                className='selectable-button! text-xs sm:text-sm'
                data-is-selected={userPreferences.defaultMediaStatus === status.value}
                onPress={() => handleDefaultStatusChange(status.value as WatchStatus)}
              >
                <status.icon className='size-3 sm:size-3.5' />
                {status.label}
              </Button>
            ))}
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
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex-1'>
            <h4 className='text-sm font-semibold text-red-200 sm:text-base'>Clear Library</h4>
            <p className='text-Grey-400 mt-1 text-xs sm:text-sm'>
              Permanently delete all items from your library. This action cannot be undone.
            </p>
          </div>
          <div className='flex justify-end sm:justify-start'>
            <Button
              color='danger'
              size='sm'
              onPress={clearLibrary}
              startContent={<Trash2 className='size-4' />}
              className='w-full sm:w-auto'
            >
              Clear Library
            </Button>
          </div>
        </div>
      </SettingSection>

      <ImportExportModal disclosure={importExportDisclosure} />
    </div>
  );
}
