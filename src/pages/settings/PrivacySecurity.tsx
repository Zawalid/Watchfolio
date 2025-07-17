import ChangePassword from '@/components/settings/ChangePassword';
import DeleteAccount from '@/components/settings/DeleteAccount';
import { SettingSection } from '@/components/settings/SettingSection';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuthStore } from '@/stores/useAuthStore';
import { AlertTriangle, ShieldCheck, Lock } from 'lucide-react';

export default function PrivacySecurity() {
  const { isAuthenticated } = useAuthStore();

  usePageTitle(' Privacy & Security - Settings');

  if (!isAuthenticated) {
    return (
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col items-center gap-6 rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-600/10 p-8 text-center'>
          <div className='rounded-full border border-red-500/20 bg-red-500/10 p-4'>
            <ShieldCheck className='size-8 text-red-400' />
          </div>

          <div className='space-y-2'>
            <h3 className='text-xl font-semibold text-red-200'>Account Security Required</h3>
            <p className='text-Grey-300 max-w-md text-sm'>
              Sign in to access security settings, change your password, and manage your account preferences.
            </p>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='border-Primary-500/10 bg-Primary-500/[0.02] rounded-lg border p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div className='bg-Primary-500/10 rounded-lg p-2'>
                <Lock className='text-Primary-400 size-4' />
              </div>
              <h4 className='text-Grey-200 font-medium'>Password Security</h4>
            </div>
            <p className='text-Grey-400 text-sm'>Change your password and enable two-factor authentication</p>
          </div>

          <div className='rounded-lg border border-red-500/10 bg-red-500/[0.02] p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div className='rounded-lg bg-red-500/10 p-2'>
                <AlertTriangle className='size-4 text-red-400' />
              </div>
              <h4 className='text-Grey-200 font-medium'>Account Management</h4>
            </div>
            <p className='text-Grey-400 text-sm'>Manage account deletion and data export options</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <SettingSection Icon={ShieldCheck} title='Security'>
        <ChangePassword />
      </SettingSection>

      <SettingSection
        Icon={AlertTriangle}
        title='Danger Zone'
        iconClassName='text-red-400'
        iconContainerClassName='border-red-500/20 bg-red-500/10'
      >
        <DeleteAccount />
      </SettingSection>
    </div>
  );
}
