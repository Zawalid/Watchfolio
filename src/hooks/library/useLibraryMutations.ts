import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToast } from '@heroui/react';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { addOrUpdateLibraryItem, deleteLibraryItem, bulkaddOrUpdateLibraryItem, recreateDB, getLibraryItem } from '@/lib/rxdb';
import { appwriteService } from '@/lib/appwrite/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { calculateTotalMinutesRuntime, getRating } from '@/utils/media';

// Helper to invalidate library queries
const useInvalidateLibraryQueries = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['library'] });
};

export const useInfo = () => {
  const userId = useAuthStore((state) => state.user?.$id) || 'guest-user';
  const library = useAuthStore((state) => state.user?.profile.library) || null;
  return { userId, library };
};

const getMediaMetadata = (media: Media): Partial<LibraryMedia> => {
  const title = (media as Movie).title || (media as TvShow).name;
  const releaseDate = (media as Movie).release_date || (media as TvShow).first_air_date || undefined;

  return {
    tmdbId: media.id,
    title: title?.trim() || `${media.media_type} ${media.id}`,
    posterPath: media.poster_path?.trim() || undefined,
    releaseDate: releaseDate?.trim() || undefined,
    genres: media.genre_ids || media.genres?.map((g) => g.id) || [],
    rating: media.vote_average ? +getRating(media.vote_average) : undefined,
    totalMinutesRuntime: calculateTotalMinutesRuntime(media) || undefined,
    networks: (media as TvShow).networks?.map((n) => n.id).filter((id) => typeof id === 'number') || [],
    media_type: media.media_type,
    overview: media.overview?.trim() || undefined,
  };
};

export const useAddOrUpdateLibraryItem = () => {
  const invalidateQueries = useInvalidateLibraryQueries();
  const { userId, library } = useInfo();

  return useMutation({
    mutationFn: async ({
      item,
      media,
    }: {
      item: Partial<LibraryMedia> & Pick<LibraryMedia, 'id'>;
      media?: Media;
      toggleFavorite?: boolean;
    }) => {
      const metadata = media ? getMediaMetadata(media) : {};
      const updates = { ...item, ...metadata, userId };

      // Fetch current item to get complete state
      const currentItem = await getLibraryItem(item.id);

      // Merge current item with updates to get complete state
      const mergedItem = currentItem ? { ...currentItem, ...updates } : updates;

      // Check if item should be removed (no status, not favorite, not rated)
      const shouldRemove =
        (!mergedItem.status || mergedItem.status === 'none') && !mergedItem.isFavorite && !mergedItem.userRating;

      if (shouldRemove) {
        return deleteLibraryItem(item.id);
      }

      return addOrUpdateLibraryItem(updates, { library, userId });
    },
    onSuccess: invalidateQueries,
    onError: (error) => {
      log('ERR', 'Failed to add or update library item:', error);
      addToast({
        title: 'Failed to add or update library item',
        description: 'An unexpected error occurred. Please try again.',
        color: 'danger',
      });
    },
  });
};

export const useRemoveLibraryItem = () => {
  const invalidateQueries = useInvalidateLibraryQueries();

  return useMutation({
    mutationFn: (item: LibraryMedia) => deleteLibraryItem(item.id),
    onSuccess: () => invalidateQueries(),
    onError: (error) => {
      log('ERR', 'Failed to remove library item:', error);
      addToast({
        title: 'Failed to remove library item',
        description: 'An unexpected error occurred. Please try again.',
        color: 'danger',
      });
    },
  });
};
export const useImportLibrary = () => {
  const invalidateQueries = useInvalidateLibraryQueries();
  const { userId, library } = useInfo();

  return useMutation({
    mutationFn: (items: LibraryMedia[]) => bulkaddOrUpdateLibraryItem(items.map((i) => ({ ...i, library, userId }))),
    onSuccess: invalidateQueries,
    onError: (error) => {
      log('ERR', 'Failed to import library items:', error);
      addToast({
        title: 'Failed to import library items',
        description: 'An unexpected error occurred. Please try again.',
        color: 'danger',
      });
    },
  });
};

export const useClearLibrary = () => {
  const invalidateQueries = useInvalidateLibraryQueries();
  const { confirm } = useConfirmationModal();
  const { library } = useInfo();

  const clearMutation = useMutation({
    mutationFn: async () => {
      const clear = async () => {
        if (library) await appwriteService.library.clearLibrary(library);
        await recreateDB();
      };

      return new Promise((resolve) => {
        addToast({
          title: 'Clearing library...',
          description: 'Please wait while we clear your library.',
          color: 'default',
          promise: clear().then(resolve),
        });
      });
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
      log('ERR', 'Failed to clear library:', error);
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
