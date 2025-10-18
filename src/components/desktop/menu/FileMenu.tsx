import { DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { useNavigate } from 'react-router';
import { exit } from '@tauri-apps/plugin-process';
import { useUIStore } from '@/stores/useUIStore';
import { useSyncStore } from '@/stores/useSyncStore';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { Zap, RotateCw, Upload, Download, User, Settings, X } from 'lucide-react';
import { getShortcut } from '@/config/shortcuts';

export function FileMenu() {
  const navigate = useNavigate();
  const openQuickAdd = useUIStore((state) => state.openQuickAdd);
  const openImportExport = useUIStore((state) => state.openImportExport);
  const { syncStatus, manualSync } = useSyncStore();
  const { confirm } = useConfirmationModal();

  const handleImport = () => openImportExport('import');
  const handleExport = () => openImportExport('export');

  const handleQuit = async () => {
    const confirmed = await confirm({
      title: 'Quit Watchfolio',
      message: 'Are you sure you want to quit? Any pending sync will be interrupted.',
      confirmText: 'Quit',
      cancelText: 'Cancel',
      confirmVariant: 'danger',
    });

    if (confirmed) {
      await exit(0);
    }
  };

  return (
    <DropdownMenu
      aria-label='File menu'
      itemClasses={{
        base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm text-Grey-200 hover:text-Primary-50 data-[focus=true]:text-Primary-50',
      }}
    >
      <DropdownSection showDivider>
        <DropdownItem
          key='quick-add'
          startContent={<Zap className='size-4' />}
          onPress={openQuickAdd}
          endContent={
            getShortcut('toggleQuickAdd') && (
              <span className='text-Grey-500 kbd-sm'>{getShortcut('toggleQuickAdd')?.label}</span>
            )
          }
        >
          Quick Add
        </DropdownItem>
      </DropdownSection>

      <DropdownSection title='Library' showDivider>
        <DropdownItem key='sync' startContent={<RotateCw className='size-4' />} onPress={manualSync}>
          {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Library'}
        </DropdownItem>
        <DropdownItem
          key='import'
          startContent={<Upload className='size-4' />}
          onPress={handleImport}
          endContent={
            getShortcut('openImport') && (
              <span className='text-Grey-500 kbd-sm'>{getShortcut('openImport')?.label}</span>
            )
          }
        >
          Import
        </DropdownItem>
        <DropdownItem
          key='export'
          startContent={<Download className='size-4' />}
          onPress={handleExport}
          endContent={
            getShortcut('openExport') && (
              <span className='text-Grey-500 kbd-sm'>{getShortcut('openExport')?.label}</span>
            )
          }
        >
          Export
        </DropdownItem>
      </DropdownSection>

      <DropdownSection title='Settings' showDivider>
        <DropdownItem key='profile' startContent={<User className='size-4' />} onPress={() => navigate('/settings/profile')}>
          Profile
        </DropdownItem>
        <DropdownItem
          key='preferences'
          startContent={<Settings className='size-4' />}
          onPress={() => navigate('/settings/preferences')}
          endContent={
            getShortcut('goToSettings') && (
              <span className='text-Grey-500 kbd-sm'>{getShortcut('goToSettings')?.label}</span>
            )
          }
        >
          Preferences
        </DropdownItem>
      </DropdownSection>

      <DropdownSection>
        <DropdownItem
          key='quit'
          startContent={<X className='size-4' />}
          onPress={handleQuit}
          className='text-red-400! hover:text-red-300! hover:bg-red-500/10!'
        >
          Quit Watchfolio
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}
