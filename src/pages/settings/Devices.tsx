import { SettingSection } from '@/components/settings/SettingSection';
import DeviceManager from '@/components/settings/DeviceManager';
import SyncStatusWidget from '@/components/settings/SyncStatusWidget';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuthStore } from '@/stores/useAuthStore';
import { HardDrive, ShieldCheck, Cloud } from 'lucide-react';

export default function Devices() {
  const { isAuthenticated } = useAuthStore();
  usePageTitle('Device Management - Settings');

  if (!isAuthenticated) {
    return (
      <div className='flex flex-col gap-8 mt-12 lg:mt-0'>
        <div className='flex flex-col items-center gap-6 rounded-xl border border-Primary-500/20 bg-gradient-to-br from-Primary-500/5 to-Primary-600/10 p-8 text-center'>
          <div className='rounded-full border border-Primary-500/20 bg-Primary-500/10 p-4'>
            <HardDrive className='size-8 text-Primary-400' />
          </div>

          <div className='space-y-2'>
            <h3 className='text-xl font-semibold text-Primary-200'>View & Manage Your Devices</h3>
            <p className='text-Grey-300 max-w-md text-sm'>
              Sign in to see your sync status and manage all the devices connected to your Watchfolio account.
            </p>
          </div>
        </div>
        
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-lg border border-Primary-500/10 bg-Primary-500/[0.02] p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div className='rounded-lg bg-Primary-500/10 p-2'>
                <Cloud className='size-4 text-Primary-400' />
              </div>
              <h4 className='text-Grey-200 font-medium'>Sync Status</h4>
            </div>
            <p className='text-Grey-400 text-sm'>Get a real-time overview of your library sync status.</p>
          </div>

          <div className='rounded-lg border border-Primary-500/10 bg-Primary-500/[0.02] p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div className='rounded-lg bg-Primary-500/10 p-2'>
                <ShieldCheck className='size-4 text-Primary-400' />
              </div>
              <h4 className='text-Grey-200 font-medium'>Active Sessions</h4>
            </div>
            <p className='text-Grey-400 text-sm'>Remotely sign out of devices you no longer use.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <SettingSection 
        Icon={HardDrive} 
        title='Device & Sync Status'
      >
        <p className='text-Grey-400 -mt-2 mb-6 text-sm'>
            A real-time overview of your library sync status and all connected devices.
        </p>
        <SyncStatusWidget />
      </SettingSection>

      <div className="border-t border-white/10"></div>

      <DeviceManager />
    </div>
  );
}
