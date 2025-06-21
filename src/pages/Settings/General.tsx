import { Switch } from '@/components/ui/Switch';
import { useAuthStore } from '@/stores/useAuthStore';
import { addToast } from '@heroui/toast';

export default function General() {
  const { user, updateUserPreferences, isLoading } = useAuthStore();

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
        <h3 className='text-Primary-100 text-xl font-semibold'>Preferences</h3>
        <p className='text-Grey-400'>Please sign in to manage your preferences.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <h3 className='text-Primary-100 text-xl font-semibold'>Preferences</h3>

      <div className='xs:grid xs:grid-cols-[auto_144px] xs:items-center xs:gap-x-6 flex flex-col gap-x-3 gap-y-3 sm:gap-x-10'>
        <div>
          <h4 className='text-Grey-200 font-bold'>Sign out confirmation</h4>
          <p className='text-Grey-400 mt-2'>Display a confirmation dialog when you want to sign out.</p>
        </div>
        <Switch
          className='scale-150'
          checked={user.preferences?.signOutConfirmation === 'enabled'}
          onChange={(e) => handleConfirmationToggle('signOutConfirmation', e.target.checked)}
          disabled={isLoading}
        />
      </div>

      <div className='xs:grid xs:grid-cols-[auto_144px] xs:items-center xs:gap-x-6 flex flex-col gap-x-3 gap-y-3 sm:gap-x-10'>
        <div>
          <h4 className='text-Grey-200 font-bold'>Remove from library confirmation</h4>
          <p className='text-Grey-400 mt-2'>
            Display a confirmation dialog when you want to remove an item from your library.
          </p>
        </div>
        <Switch
          className='scale-150'
          checked={user.preferences?.removeFromWatchlistConfirmation === 'enabled'}
          onChange={(e) => handleConfirmationToggle('removeFromWatchlistConfirmation', e.target.checked)}
          disabled={isLoading}
        />
      </div>

      {/* <hr className='border-border border-t-2' />
      <div className='space-y-2'>
        <h3 className='text-Primary-100 text-xl font-semibold'></h3>
      </div> */}
    </div>
  );
}
