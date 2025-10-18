import { Button, closeToast } from '@heroui/react';
import { addToast } from '@heroui/react';
import { Cloud, Database, Download, Upload, Trash2, RefreshCw, Library as LibraryIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SettingItem, SettingSection } from '@/components/settings/SettingSection';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useSyncStore } from '@/stores/useSyncStore';
import { useClearLibrary } from '@/hooks/library/useLibraryMutations';
import { useViewportSize } from '@/hooks/useViewportSize';
import { useUIStore } from '@/stores/useUIStore';

export default function Library() {
  const { isAuthenticated, userPreferences, updateUserPreferences } = useAuthStore();
  const { syncStatus, lastSyncTime, manualSync, toggleAutoSync } = useSyncStore();
  const { clearLibrary } = useClearLibrary();
  const openImportExport = useUIStore((state) => state.openImportExport);
  const {isBelow} = useViewportSize()

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
      const key = addToast({ title: 'Syncing...', description: 'Your library is being synced.', color: 'secondary' });
      await manualSync();
      if(key) closeToast(key);
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
              <p className='text-Grey-300 text-center font-medium text-xs sm:text-sm'>
                Sign in to sync your library across devices and
                <br className='hidden sm:block' />
                keep your data backed up in the cloud.
              </p>
            </div>
          )}
          <div className={!isAuthenticated ? 'pointer-events-none opacity-40 blur-[1px]' : ''}>
            <SettingItem
              title='Auto-sync'
              description='Automatically sync your library changes across devices'
              requiresAuth={true}
              isChecked={userPreferences?.autoSync}
              isSwitchDisabled={!isAuthenticated}
              onChange={handleAutoSyncToggle}
            />
            <div className='mt-4 flex flex-col gap-3 mobile:mt-6 mobile:flex-row mobile:items-center mobile:justify-between'>
              <div className='flex-1'>
                <h4 className='text-Grey-200 text-sm font-semibold mobile:text-base'>Manual Sync</h4>
                <p className='text-Grey-400 mt-1 text-xs mobile:text-sm'>
                  {lastSyncTime ? `Last synced: ${new Date(lastSyncTime).toLocaleString()}` : 'Not synced yet'}
                </p>
              </div>
              <div className='flex justify-end mobile:justify-start'>
                <Button
                  color='primary'
                  size={isBelow('sm') ? 'sm' : 'md'}
                  onPress={handleManualSync}
                  isLoading={isSyncing}
                  isDisabled={!isAuthenticated || isSyncing}
                  startContent={<RefreshCw className='size-4' />}
                  className='w-full mobile:w-auto'
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
          <div className='flex flex-col gap-3 mobile:flex-row mobile:items-center mobile:justify-between'>
            <div className='flex-1'>
              <h4 className='text-Grey-200 text-sm font-semibold mobile:text-base'>Import & Export</h4>
              <p className='text-Grey-400 mt-1 text-xs mobile:text-sm'>
                Backup your library or import data from other sources
              </p>
            </div>
            <div className='flex justify-end mobile:justify-start'>
              <Button
                startContent={<Database className='size-4' />}
                className='button-secondary! w-full mobile:w-auto'
                onPress={() => openImportExport()}
                size={isBelow('sm') ? 'sm' : 'md'}
              >
                Import / Export
              </Button>
            </div>
          </div>

          <div className='text-Grey-400 flex flex-col gap-2 text-xs xs:flex-row xs:items-center xs:gap-4'>
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
                size={isBelow('sm') ? 'sm' : 'md'}
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
        <div className='flex flex-col gap-3 mobile:flex-row mobile:items-center mobile:justify-between'>
          <div className='flex-1'>
            <h4 className='text-sm font-semibold text-red-200 mobile:text-base'>Clear Library</h4>
            <p className='text-Grey-400 mt-1 text-xs mobile:text-sm'>
              Permanently delete all items from your library. This action cannot be undone.
            </p>
          </div>
          <div className='flex justify-end mobile:justify-start'>
            <Button
              color='danger'
              size={isBelow('sm') ? 'sm' : 'md'}
              onPress={clearLibrary}
              startContent={<Trash2 className='size-4' />}
              className='w-full mobile:w-auto'
            >
              Clear Library
            </Button>
          </div>
        </div>
      </SettingSection>
    </div>
  );
}
