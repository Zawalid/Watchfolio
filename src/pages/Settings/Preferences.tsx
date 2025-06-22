import { ReactNode } from 'react';
import { Settings, Palette, Globe, Lock } from 'lucide-react';
import { addToast } from '@heroui/toast';
import { Switch } from '@/components/ui/Switch';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils';

export default function Preferences() {
  const { user, isAuthenticated, updateUserPreferences, isLoading } = useAuthStore();

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

  return (
    <div className='flex flex-col gap-8'>
      <section className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/10 border-Primary-500/20 rounded-lg border p-2'>
            <Settings className='text-Primary-400 size-4' />
          </div>
          <h3 className='text-Primary-100 text-xl font-semibold'>
            Preferences
          </h3>
        </div>
        <div className='space-y-6 rounded-xl border border-white/5 bg-white/[0.015] p-6 backdrop-blur-sm'>
          <SettingItem
            title='Remove from library confirmation'
            description='Show confirmation dialog when removing items from library'
            isDisabled={isLoading}
          >
            <Switch
              checked={user?.preferences?.removeFromWatchlistConfirmation === 'enabled'}
              onChange={(e) => handleConfirmationToggle('removeFromWatchlistConfirmation', e.target.checked)}
              disabled={isLoading}
            />
          </SettingItem>

          <SettingItem
            title='Clear library confirmation'
            description='Show confirmation dialog when clearing the library'
            isDisabled={isLoading}
          >
            <Switch
              checked={user?.preferences?.removeFromWatchlistConfirmation === 'enabled'}
              onChange={(e) => handleConfirmationToggle('removeFromWatchlistConfirmation', e.target.checked)}
              disabled={isLoading}
            />
          </SettingItem>

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
          <SettingItem title='Theme' description='Choose your preferred theme' isDisabled={true} comingSoon={true}>
            <div className='flex items-center gap-2'>
              <span className='text-Grey-300 text-sm'>Dark</span>
              <span className='text-Grey-500 text-xs'>(System)</span>
            </div>
          </SettingItem>

          <SettingItem title='Compact view' description='Use a more dense layout for lists and cards' isDisabled={true} comingSoon={true}>
            <Switch checked={false} onChange={() => {}} disabled={true} />
          </SettingItem>
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
          <SettingItem title='Language' description='Choose your preferred language' isDisabled={true} comingSoon={true}>
            <div className='flex items-center gap-2'>
              <span className='text-Grey-300 text-sm'>English</span>
            </div>
          </SettingItem>

          <SettingItem title='Region' description='Your current region for content availability' isDisabled={true} comingSoon={true}>
            <div className='flex items-center gap-2'>
              <img
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${user?.location.countryCode}.svg`}
                alt={user?.location.country}
                className='h-4 w-5 rounded-sm'
              />
              <span className='text-Grey-300 text-sm'>{user?.location.country}</span>
            </div>
          </SettingItem>
        </div>
      </section>
    </div>
  );
}

interface SettingItemProps {
  title: string;
  description: string;
  children: ReactNode;
  isDisabled?: boolean;
  requiresAuth?: boolean;
  className?: string;
  comingSoon?: boolean;
}

export function SettingItem({
  title,
  description,
  children,
  isDisabled = false,
  requiresAuth = false,
  className,
  comingSoon = false,
}: SettingItemProps) {
  return (
    <div className={cn('relative grid grid-cols-[1fr_auto] items-center gap-6', className)}>
      <div className={cn('transition-all duration-200', isDisabled && 'opacity-40')}>
        <div className='flex items-center gap-2'>
          <h4 className='text-Grey-200 font-semibold'>{title}</h4>
          {requiresAuth && isDisabled && <Lock className='text-Grey-500 size-3' />}
          {comingSoon && <span className='text-Grey-500 text-xs'>Coming Soon</span>}
        </div>
        <p className='text-Grey-400 mt-1 text-sm'>{description}</p>
      </div>
      <div className={cn('transition-all duration-200', isDisabled && 'pointer-events-none opacity-40')}>
        {children}
      </div>
    </div>
  );
}
