import { Cloud, Heart, User } from 'lucide-react';
import Details from '@/components/settings/Details';
import ViewingTaste from '@/components/settings/ViewingTaste';
import { SettingSection } from '@/components/settings/SettingSection';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Profile() {
  const { isAuthenticated } = useAuthStore();

  usePageTitle('Profile - Settings');

  if (!isAuthenticated) {
    return (
      <div className='space-y-6'>
        <div className='border-Primary-500/20 from-Primary-500/5 to-Primary-600/10 flex flex-col items-center gap-6 rounded-xl border bg-gradient-to-br p-8 text-center'>
          <div className='bg-Primary-500/10 border-Primary-500/20 rounded-full border p-4'>
            <User className='text-Primary-400 size-8' />
          </div>

          <div className='space-y-2'>
            <h3 className='text-Primary-100 text-xl font-semibold'>Create Your Profile</h3>
            <p className='text-Grey-300 max-w-md text-sm'>
              Sign in to personalize your Watchfolio experience and keep your data synced across all devices.
            </p>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='border-Primary-500/10 bg-Primary-500/[0.02] rounded-lg border p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div className='bg-Primary-500/10 rounded-lg p-2'>
                <User className='text-Primary-400 size-4' />
              </div>
              <h4 className='text-Grey-200 font-medium'>Personal Profile</h4>
            </div>
            <p className='text-Grey-400 text-sm'>Customize your avatar, bio, and preferences</p>
          </div>

          <div className='border-Primary-500/10 bg-Primary-500/[0.02] rounded-lg border p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div className='bg-Primary-500/10 rounded-lg p-2'>
                <Cloud className='text-Primary-400 size-4' />
              </div>
              <h4 className='text-Grey-200 font-medium'>Cloud Sync</h4>
            </div>
            <p className='text-Grey-400 text-sm'>Keep your library synced across all devices</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='flex min-w-0 flex-col gap-8'>
      <SettingSection Icon={User} title='Profile Information'>
        <Details />
      </SettingSection>
      <SettingSection Icon={Heart} title='Viewing Taste'>
        {/* <ViewingTaste /> */}
      </SettingSection>
    </div>
  );
}
