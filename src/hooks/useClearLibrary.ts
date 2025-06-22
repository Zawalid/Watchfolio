import { addToast } from '@heroui/toast';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useSyncStore } from '@/stores/useSyncStore';
import { useAuthStore } from '@/stores/useAuthStore';

export function useClearLibrary() {
  const { isAuthenticated } = useAuthStore();
  const { clearLibrary } = useLibraryStore();
  const syncStore = useSyncStore();
  const { confirm } = useConfirmationModal();

  const handleClearLibrary = async () => {
    const confirmed = await confirm({
      title: 'Clear Library',
      message: isAuthenticated
        ? 'Are you sure you want to clear your entire library? This will clear both your local library and cloud backup. This action cannot be undone.'
        : 'Are you sure you want to clear your entire library? This action cannot be undone.',
      confirmVariant: 'danger',
      confirmationKey: 'clear-library',
      confirmText: 'Clear All',
    });

    if (confirmed) {
      try {
        // Always clear local library
        clearLibrary();

        // Only clear cloud if authenticated
        if (isAuthenticated) {
          await syncStore.clearCloudLibrary();
          addToast({
            title: 'Library cleared',
            description: 'Your local library and cloud backup have been cleared successfully',
            color: 'success',
          });
        } else {
          addToast({
            title: 'Library cleared',
            description: 'Your library has been cleared successfully',
            color: 'success',
          });
        }
      } catch (error) {
        console.error('Failed to clear library:', error);
        addToast({
          title: 'Failed to clear library',
          description: isAuthenticated
            ? 'Local library cleared, but failed to clear cloud backup'
            : 'Failed to clear library. Please try again.',
          color: 'danger',
        });
      }
    }
  };

  return { handleClearLibrary };
}