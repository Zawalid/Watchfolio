import { Settings, Palette, Globe, Monitor } from 'lucide-react';
import { addToast } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SettingItem, SettingSection } from '@/components/settings/SettingSection';
import { UserPreferences } from '@/lib/appwrite/types';
import { UpdateSettings } from '@/components/settings/UpdateSettings';
import { isDesktop } from '@/lib/platform';
import { useSystemSettings } from '@/hooks/useSystemSettings';

export default function Preferences() {
  const { user, isAuthenticated, updateUserPreferences, isLoading, userPreferences } = useAuthStore();

  // Desktop-only system settings
  const {
    settings: systemSettings,
    isLoading: isSystemSettingsLoading,
    updateLaunchOnStartup,
    updateStartMinimized,
    updateKeepRunningInBackground,
  } = useSystemSettings();

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
      {/* System (Desktop only) */}
      {isDesktop() && (
        <SettingSection Icon={Monitor} title='System'>
          <SettingItem
            title='Launch Watchfolio on startup'
            description='Automatically start Watchfolio when you log in to your computer'
            isChecked={systemSettings.launchOnStartup}
            onChange={updateLaunchOnStartup}
            isDisabled={isSystemSettingsLoading}
            isSwitchDisabled={isSystemSettingsLoading}
          />

          <SettingItem
            title='Start minimized to tray'
            description='Launch Watchfolio in the background without opening the main window'
            isChecked={systemSettings.startMinimized}
            onChange={updateStartMinimized}
            isDisabled={isSystemSettingsLoading || !systemSettings.launchOnStartup}
            isSwitchDisabled={isSystemSettingsLoading || !systemSettings.launchOnStartup}
          />

          <SettingItem
            title='Keep running in background when window is closed'
            description='Keep Watchfolio running in the system tray when you close the window'
            isChecked={systemSettings.keepRunningInBackground}
            onChange={updateKeepRunningInBackground}
            isDisabled={isSystemSettingsLoading}
            isSwitchDisabled={isSystemSettingsLoading}
          />
        </SettingSection>
      )}

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
