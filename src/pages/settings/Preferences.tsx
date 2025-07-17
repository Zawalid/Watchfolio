import { Settings, Palette, Globe } from 'lucide-react';
import { addToast } from '@heroui/toast';
import { Switch } from '@/components/ui/Switch';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SettingItem, SettingSection } from '@/components/settings/SettingSection';

export default function Preferences() {
  const { user, isAuthenticated, updateUserPreferences, isLoading } = useAuthStore();

  usePageTitle('Preferences - Settings');

  const handleConfirmationToggle = async (setting: ConfirmationPreferences, enabled: boolean) => {
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
      <SettingSection Icon={Settings} title='Preferences'>
        <SettingItem
          title='Remove from library confirmation'
          description='Show confirmation dialog when removing items from library'
          isDisabled={isLoading}
        >
          <Switch
            checked={user?.preferences?.removeFromLibraryConfirmation === 'enabled'}
            onChange={(e) => handleConfirmationToggle('removeFromLibraryConfirmation', e.target.checked)}
            disabled={isLoading}
          />
        </SettingItem>

        <SettingItem
          title='Clear library confirmation'
          description='Show confirmation dialog when clearing the library'
          isDisabled={isLoading}
        >
          <Switch
            checked={user?.preferences?.clearLibraryConfirmation === 'enabled'}
            onChange={(e) => handleConfirmationToggle('clearLibraryConfirmation', e.target.checked)}
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
      </SettingSection>

      {/* Appearance */}
      <SettingSection Icon={Palette} title='Appearance'>
        <SettingItem title='Theme' description='Choose your preferred theme' isDisabled={true} comingSoon={true}>
          <div className='flex items-center gap-2'>
            <span className='text-Grey-300 text-sm'>Dark</span>
            <span className='text-Grey-500 text-xs'>(System)</span>
          </div>
        </SettingItem>

        <SettingItem
          title='Compact view'
          description='Use a more dense layout for lists and cards'
          isDisabled={true}
          comingSoon={true}
        >
          <Switch checked={false} onChange={() => {}} disabled={true} />
        </SettingItem>
      </SettingSection>

      {/* Localization */}
      <SettingSection Icon={Globe} title='Localization'>
        <SettingItem title='Language' description='Choose your preferred language' isDisabled={true} comingSoon={true}>
          <div className='flex items-center gap-2'>
            <span className='text-Grey-300 text-sm'>English</span>
          </div>
        </SettingItem>

        <SettingItem
          title='Region'
          description='Your current region for content availability'
          isDisabled={true}
          comingSoon={true}
        >
          <div className='flex items-center gap-2'>
            <img
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${user?.location.countryCode}.svg`}
              alt={user?.location.country}
              className='h-4 w-5 rounded-sm'
            />
            <span className='text-Grey-300 text-sm'>{user?.location.country}</span>
          </div>
        </SettingItem>
      </SettingSection>
    </div>
  );
}
