import { Switch } from '@/components/ui/Switch';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { useDisclosure } from '@heroui/modal';
import { Cloud, Database, Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useSyncStore } from '@/stores/useSyncStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import ImportExportModal from '@/components/library/ImportExportModal';
import SettingGuard from '@/components/settings/SettingGuard';

export default function Library() {
  const { isAuthenticated } = useAuthStore();
  const { library, clearLibrary } = useLibraryStore();
  const syncStore = useSyncStore();
  const { confirm } = useConfirmationModal();
  const importExportDisclosure = useDisclosure();
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(localStorage.getItem('watchfolio-auto-sync') !== 'false');

  const handleAutoSyncToggle = (enabled: boolean) => {
    // TODO : Add it as a user preference
    localStorage.setItem('watchfolio-auto-sync', enabled.toString());
    setIsAutoSyncEnabled(enabled);
    addToast({
      title: enabled ? 'Auto-sync enabled' : 'Auto-sync disabled',
      description: enabled ? 'Your library will sync automatically' : 'Manual sync only',
      color: 'success',
    });
  };

  const handleManualSync = async () => {
    if (!isAuthenticated) {
      addToast({
        title: 'Sign in required',
        description: 'Please sign in to sync your library',
        color: 'warning',
      });
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
  const handleClearCloudLibrary = async () => {
    if (!isAuthenticated) {
      addToast({
        title: 'Sign in required',
        description: 'Please sign in to manage your cloud library',
        color: 'warning',
      });
      return;
    }

    const confirmed = await confirm({
      title: 'Clear Cloud Library',
      message: 'Are you sure you want to clear your cloud library? This will not affect your local library.',
      confirmText: 'Clear Cloud',
      confirmVariant: 'danger',
      confirmationKey: 'clear-cloud-library',
    });

    if (confirmed) {
      try {
        await syncStore.clearCloudLibrary();
        addToast({
          title: 'Cloud library cleared',
          description: 'Your cloud library has been cleared successfully',
          color: 'success',
        });
      } catch {
        addToast({
          title: 'Failed to clear cloud library',
          description: 'An error occurred while clearing your cloud library',
          color: 'danger',
        });
      }
    }
  };

  const handleClearLibrary = async () => {
    const confirmed = await confirm({
      title: 'Clear Library',
      message: 'Are you sure you want to clear your entire library? This action cannot be undone.',
      confirmText: 'Clear Library',
      confirmVariant: 'danger',
      confirmationKey: 'clear-library',
    });

    if (confirmed) {
      clearLibrary();
      addToast({
        title: 'Library cleared',
        description: 'Your library has been cleared successfully',
        color: 'success',
      });
    }
  };

  return (
    <div className='flex flex-col gap-8'>
        {/* Sync Settings */}
      <section className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/10 border-Primary-500/20 rounded-lg border p-2'>
            <Cloud className='text-Primary-400 size-4' />
          </div>
          <h3 className='text-Primary-100 text-xl font-semibold'>Cloud Sync</h3>
        </div>
        
        <SettingGuard
          isDisabled={isAuthenticated}
          title="Authentication Required"
          description="Sign in to sync your library across devices and keep your data backed up in the cloud."
          icon={Cloud}
          actionText="Sign In"
          onAction={() => {
            addToast({
              title: 'Sign in required',
              description: 'Please sign in to access cloud sync features',
              color: 'warning',
            });
          }}
        >
          <div className='space-y-6 rounded-xl border border-white/5 bg-white/[0.015] p-6 backdrop-blur-sm'>
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
                    <p className='mt-1 text-xs text-amber-300'>{syncStore.status.pendingOperations} pending operations</p>
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
        </SettingGuard>
      </section>

      {/* Library Management */}
      <section className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/10 border-Primary-500/20 rounded-lg border p-2'>
            <Database className='text-Primary-400 size-4' />
          </div>
          <h3 className='text-Primary-100 text-xl font-semibold'>Library Management</h3>
        </div>
        <div className='space-y-6 rounded-xl border border-white/5 bg-white/[0.015] p-6 backdrop-blur-sm'>
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
        </div>
      </section>

      {/* Danger Zone */}
      <section className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='rounded-lg border border-red-500/20 bg-red-500/10 p-2'>
            <Trash2 className='size-4 text-red-400' />
          </div>
          <h3 className='text-Primary-100 text-xl font-semibold'>Danger Zone</h3>
        </div>
        <div className='space-y-6 rounded-xl border border-white/5 bg-white/[0.015] p-6 backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-semibold text-red-200'>Clear Local Library</h4>
              <p className='text-Grey-400 mt-1 text-sm'>
                Permanently delete all items from your local library. This action cannot be undone.
              </p>
            </div>
            <Button color='danger' size='sm' onPress={handleClearLibrary} startContent={<Trash2 className='size-4' />}>
              Clear Library
            </Button>
          </div>

          {isAuthenticated && (
            <div className='border-t border-white/5 pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='font-semibold text-red-200'>Clear Cloud Library</h4>
                  <p className='text-Grey-400 mt-1 text-sm'>
                    Clear your synced library in the cloud. Your local library will remain unchanged.
                  </p>
                </div>
                <Button
                  color='danger'
                  variant='bordered'
                  size='sm'
                  onPress={handleClearCloudLibrary}
                  startContent={<Cloud className='size-4' />}
                >
                  Clear Cloud
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <ImportExportModal disclosure={importExportDisclosure} />
    </div>
  );
}




