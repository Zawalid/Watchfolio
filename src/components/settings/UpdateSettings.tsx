import { Download } from 'lucide-react';
import { Button } from '@heroui/react';
import { SettingSection } from './SettingSection';
import { useUpdater } from '@/hooks/desktop/useUpdater';
import { isDesktop } from '@/lib/platform';

export function UpdateSettings() {
  const { checking, updateAvailable, updateInfo, checkForUpdates } = useUpdater();

  if (!isDesktop()) {
    return null;
  }

  return (
    <SettingSection Icon={Download} title='Updates'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-white'>App Version</h3>
            <p className='mt-1 text-xs text-white/60'>Current version: 0.1.0</p>
            {updateAvailable && updateInfo && (
              <p className='text-success mt-1 text-xs'>Update available: v{updateInfo.version}</p>
            )}
          </div>
          <Button
            onClick={() => checkForUpdates(true)}
            isLoading={checking}
            isDisabled={checking}
            size='sm'
            className='button-secondary'
          >
            {checking ? 'Checking...' : 'Check for Updates'}
          </Button>
        </div>

        <div className='text-xs text-white/50'>
          <p>Updates are checked automatically every 24 hours. You can manually check for updates at any time.</p>
        </div>
      </div>
    </SettingSection>
  );
}
