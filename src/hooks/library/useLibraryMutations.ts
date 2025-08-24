import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToast } from '@heroui/react';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { addOrUpdateLibraryItem, deleteLibraryItem, bulkaddOrUpdateLibraryItem, recreateDB } from '@/lib/rxdb';
import { appwriteService } from '@/lib/appwrite/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { queryKeys } from '@/lib/react-query';

// Helper to invalidate library queries
const useInvalidateLibraryQueries = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.library({}) });
    queryClient.invalidateQueries({ queryKey: queryKeys.libraryCount({}) });
  };
};

export const useAddLibraryItem = () => {
  const invalidateQueries = useInvalidateLibraryQueries();
  const library = useAuthStore((state) => state.user?.profile.library);

  return useMutation({
    mutationFn: (item: Partial<LibraryMedia> & Pick<LibraryMedia, 'id'>) => addOrUpdateLibraryItem(item, library),
    onSuccess: invalidateQueries,
  });
};

export const useRemoveLibraryItem = () => {
  const invalidateQueries = useInvalidateLibraryQueries();

  return useMutation({
    mutationFn: (id: string) => deleteLibraryItem(id),
    onSuccess: invalidateQueries,
  });
};

export const useToggleLibraryFavorite = () => {
  const invalidateQueries = useInvalidateLibraryQueries();
  const queryClient = useQueryClient();
  const library = useAuthStore((state) => state.user?.profile.library);

  return useMutation({
    mutationFn: ({ item, isFavorite }: { item: LibraryMedia; isFavorite: boolean }) =>
      addOrUpdateLibraryItem({ ...item, isFavorite }, library),
    onSuccess: (_, variables) => {
      invalidateQueries();
      queryClient.setQueryData(queryKeys.libraryItem(variables.item.id), (oldData: LibraryMedia) =>
        oldData ? { ...oldData, isFavorite: variables.isFavorite } : undefined
      );
    },
  });
};

export const useImportLibrary = () => {
  const invalidateQueries = useInvalidateLibraryQueries();

  return useMutation({
    mutationFn: (items: LibraryMedia[]) => bulkaddOrUpdateLibraryItem(items),
    onSuccess: invalidateQueries,
  });
};

export const useClearLibrary = () => {
  const invalidateQueries = useInvalidateLibraryQueries();
  const { confirm } = useConfirmationModal();
  const library = useAuthStore((state) => state.user?.profile.library);

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (library?.$id) {
        await appwriteService.library.clearLibrary(library.$id);
      }
      await recreateDB();
    },
    onSuccess: () => {
      invalidateQueries();
      addToast({
        title: 'Library cleared',
        description: 'Your library has been cleared successfully',
        color: 'success',
      });
    },
    onError: (error) => {
      console.error('Failed to clear library:', error);
      addToast({
        title: 'Failed to clear library',
        description: 'An unexpected error occurred. Please try again.',
        color: 'danger',
      });
    },
  });

  const handleClearLibrary = async () => {
    const confirmed = await confirm({
      title: 'Clear Library',
      message: 'Are you sure you want to clear your entire library? This action cannot be undone.',
      confirmVariant: 'danger',
      confirmationKey: 'clear-library',
      confirmText: 'Clear All',
    });

    if (confirmed) {
      clearMutation.mutate();
    }
  };

  return { clearLibrary: handleClearLibrary, isLoading: clearMutation.isPending };
};
