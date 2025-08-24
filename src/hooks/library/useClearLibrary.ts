import { addToast } from '@heroui/react';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { useLibraryStore } from '@/stores/useLibraryStore';

export function useClearLibrary() {
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
      message: 'Are you sure you want to clear your entire library? This action cannot be undone.',
      confirmVariant: 'danger',
      confirmationKey: 'clear-library',
      confirmText: 'Clear All',
    });

    if (confirmed) {
      try {
        clearLibrary();
        addToast({
          title: 'Library cleared',
          description: 'Your library has been cleared successfully',
          color: 'success',
        });
      } catch (error) {
        console.error('Failed to clear library:', error);
        addToast({
          title: 'Failed to clear library',
          description: 'Failed to clear library. Please try again.',
          color: 'danger',
        });
      }
    }
  };

  return { handleClearLibrary };
}
