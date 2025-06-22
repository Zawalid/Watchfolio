import { Switch } from '@/components/ui/Switch';
import { useAuthStore } from '@/stores/useAuthStore';
import { addToast } from '@heroui/toast';
import { Settings, Palette, Globe } from 'lucide-react';

export default function Preferences() {
  const { user,isAuthenticated, updateUserPreferences, isLoading } = useAuthStore();

  const handleConfirmationToggle = async (
    setting: 'signOutConfirmation' | 'removeFromWatchlistConfirmation',
    enabled: boolean
  ) => {
    if (!user?.preferences) return;

    try {
      await updateUserPreferences({ [setting]: enabled ? 'enabled' : 'disabled' });
      addToast({
        title: 'Preferences updated',
        description: 'Your preferences have been saved successfully.',
        color: 'success',
      });
    } catch (error) {
      console.error('Failed to update preferences:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update preferences. Please try again.',
        color: 'danger',
      });
    }
  };

  if (!user) {
    return (
      <div className='flex flex-col gap-8'>
        <p className='text-Grey-400'>Please sign in to manage your preferences.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* User Experience */}
      <section className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/10 border-Primary-500/20 rounded-lg border p-2'>
            <Settings className='text-Primary-400 size-4' />
          </div>
          <h3 className='text-Primary-100 text-xl font-semibold'>User Experience</h3>
        </div>
        <div className='space-y-6 rounded-xl border border-white/5 bg-white/[0.015] p-6 backdrop-blur-sm'>
          <SettingItem
            title='Sign out confirmation'
            description='Show confirmation dialog when signing out'
            isDisabled={!isAuthenticated}
            requiresAuth={true}
          >
            <Switch
              checked={user?.preferences?.signOutConfirmation === 'enabled'}
              onChange={(e) => handleConfirmationToggle('signOutConfirmation', e.target.checked)}
              disabled={isLoading || !isAuthenticated}
            />
          </SettingItem>

          <div className='grid grid-cols-[1fr_auto] items-center gap-6'>
            <div>
              <h4 className='text-Grey-200 font-semibold'>Remove from library confirmation</h4>
              <p className='text-Grey-400 mt-1 text-sm'>Show confirmation dialog when removing items from library</p>
            </div>
            <Switch
              checked={user.preferences?.removeFromWatchlistConfirmation === 'enabled'}
              onChange={(e) => handleConfirmationToggle('removeFromWatchlistConfirmation', e.target.checked)}
              disabled={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/10 border-Primary-500/20 rounded-lg border p-2'>
            <Palette className='text-Primary-400 size-4' />
          </div>
          <h3 className='text-Primary-100 text-xl font-semibold'>Appearance</h3>
        </div>
        <div className='space-y-6 rounded-xl border border-white/5 bg-white/[0.015] p-6 backdrop-blur-sm'>
          <div className='grid grid-cols-[1fr_auto] items-center gap-6'>
            <div>
              <h4 className='text-Grey-200 font-semibold'>Theme</h4>
              <p className='text-Grey-400 mt-1 text-sm'>Choose your preferred theme</p>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-Grey-300 text-sm'>Dark</span>
              <span className='text-Grey-500 text-xs'>(System)</span>
            </div>
          </div>

          <div className='grid grid-cols-[1fr_auto] items-center gap-6'>
            <div>
              <h4 className='text-Grey-200 font-semibold'>Compact view</h4>
              <p className='text-Grey-400 mt-1 text-sm'>Use a more dense layout for lists and cards</p>
            </div>
            <Switch checked={false} onChange={() => {}} disabled={true} />
          </div>
        </div>
      </section>

      {/* Localization */}
      <section className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/10 border-Primary-500/20 rounded-lg border p-2'>
            <Globe className='text-Primary-400 size-4' />
          </div>
          <h3 className='text-Primary-100 text-xl font-semibold'>Localization</h3>
        </div>
        <div className='space-y-6 rounded-xl border border-white/5 bg-white/[0.015] p-6 backdrop-blur-sm'>
          <div className='grid grid-cols-[1fr_auto] items-center gap-6'>
            <div>
              <h4 className='text-Grey-200 font-semibold'>Language</h4>
              <p className='text-Grey-400 mt-1 text-sm'>Choose your preferred language</p>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-Grey-300 text-sm'>English</span>
            </div>
          </div>

          <div className='grid grid-cols-[1fr_auto] items-center gap-6'>
            <div>
              <h4 className='text-Grey-200 font-semibold'>Region</h4>
              <p className='text-Grey-400 mt-1 text-sm'>Your current region for content availability</p>
            </div>
            <div className='flex items-center gap-2'>
              <img
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${user.location.countryCode}.svg`}
                alt={user.location.country}
                className='h-4 w-5 rounded-sm'
              />
              <span className='text-Grey-300 text-sm'>{user.location.country}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { ReactNode } from 'react';
import {  Lock } from 'lucide-react';
import { cn } from '@/utils';

interface SettingItemProps {
  title: string;
  description: string;
  children: ReactNode;
  isDisabled?: boolean;
  requiresAuth?: boolean;
  className?: string;
}

function SettingItem({
  title,
  description,
  children,
  isDisabled = false,
  requiresAuth = false,
  className,
}: SettingItemProps) {
  return (
    <div className={cn('relative grid grid-cols-[1fr_auto] items-center gap-6', className)}>
      <div className={cn('transition-all duration-200', isDisabled && 'opacity-40')}>
        <div className='flex items-center gap-2'>
          <h4 className='text-Grey-200 font-semibold'>{title}</h4>
          {requiresAuth && isDisabled && <Lock className='text-Grey-500 size-3' />}
        </div>
        <p className='text-Grey-400 mt-1 text-sm'>{description}</p>
      </div>
      <div className={cn('transition-all duration-200', isDisabled && 'pointer-events-none opacity-40')}>
        {children}
      </div>
    </div>
  );
}
