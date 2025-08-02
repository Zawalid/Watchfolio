import { addToast } from '@heroui/react';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useAuthStore } from '@/stores/useAuthStore';

export function useClearLibrary() {
  const { isAuthenticated } = useAuthStore();
  const { clearLibrary, getCount } = useLibraryStore();
  const { confirm } = useConfirmationModal();

  const handleClearLibrary = async () => {
    if (getCount('all') === 0) {
      addToast({
        title: 'No library to clear',
        description: 'Your library is already empty',
        color: 'warning',
      });
      return;
    }
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
        clearLibrary();

        if (isAuthenticated) {
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
