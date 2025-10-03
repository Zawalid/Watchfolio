import { Settings, Palette, Globe } from 'lucide-react';
import { addToast } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SettingItem, SettingSection } from '@/components/settings/SettingSection';
import { UserPreferences } from '@/lib/appwrite/types';
import { UpdateSettings } from '@/components/settings/UpdateSettings';
import { isDesktop } from '@/lib/platform';

export default function Preferences() {
  const { user, isAuthenticated, updateUserPreferences, isLoading, userPreferences } = useAuthStore();

  usePageTitle('Preferences - Settings');

  const handleConfirmationToggle = async (setting: keyof UserPreferences, enabled: boolean) => {
    try {
      await updateUserPreferences({ [setting]: enabled ? 'enabled' : 'disabled' });
      addToast({
        title: 'Preferences updated',
        description: 'Your preferences have been saved successfully.',
        color: 'success',
      });
    } catch (error) {
      log('ERR', 'Failed to update preferences:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update preferences. Please try again.',
        color: 'danger',
      });
    }
  };

  return (
    <div className='flex flex-col gap-6 sm:gap-8'>
      <SettingSection Icon={Settings} title='Preferences'>
        <SettingItem
          title='Remove from library confirmation'
          description='Show confirmation dialog when removing items from library'
          isDisabled={isLoading}
          isChecked={userPreferences?.removeFromLibraryConfirmation === 'enabled'}
          isSwitchDisabled={isLoading}
          onChange={(checked) => handleConfirmationToggle('removeFromLibraryConfirmation', checked)}
        />

        <SettingItem
          title='Clear library confirmation'
          description='Show confirmation dialog when clearing the library'
          isDisabled={isLoading}
          isChecked={userPreferences?.clearLibraryConfirmation === 'enabled'}
          isSwitchDisabled={isLoading}
          onChange={(checked) => handleConfirmationToggle('clearLibraryConfirmation', checked)}
        />

        <SettingItem
          title='Sign out confirmation'
          description='Show confirmation dialog when signing out'
          isDisabled={!isAuthenticated}
          requiresAuth={true}
          isChecked={userPreferences?.signOutConfirmation === 'enabled'}
          onChange={(checked) => handleConfirmationToggle('signOutConfirmation', checked)}
          isSwitchDisabled={isLoading || !isAuthenticated}
        />
      </SettingSection>

      {/* Appearance */}
      <SettingSection Icon={Palette} title='Appearance'>
        <SettingItem
          title='Enable Animations'
          description='Enable UI animations and transitions across the app'
          isDisabled={isLoading}
          tag='(Recommended)'
          isChecked={userPreferences?.enableAnimations === 'enabled'}
          onChange={(checked) => handleConfirmationToggle('enableAnimations', checked)}
          isSwitchDisabled={isLoading}
        />
        <SettingItem title='Theme' description='Choose your preferred theme' isDisabled={true} comingSoon={true} />
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
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${user?.location?.countryCode}.svg`}
              alt={user?.location?.country}
              className='h-3 w-4 rounded-sm sm:h-4 sm:w-5'
            />
            <span className='text-Grey-300 text-xs sm:text-sm'>{user?.location.country}</span>
          </div>
        </SettingItem>
      </SettingSection>

      {/* Updates (Desktop only) */}
      {isDesktop() && <UpdateSettings />}
    </div>
  );
}
