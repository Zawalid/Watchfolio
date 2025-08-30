import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToast } from '@heroui/react';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { addOrUpdateLibraryItem, deleteLibraryItem, bulkaddOrUpdateLibraryItem, recreateDB } from '@/lib/rxdb';
import { appwriteService } from '@/lib/appwrite/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { GENRES } from '@/utils/constants/TMDB';
import { calculateTotalMinutesRuntime, getRating } from '@/utils/media';

// Helper to invalidate library queries
const useInvalidateLibraryQueries = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['library'] });
};

const getMediaMetadata = (media: Media): Partial<LibraryMedia> => {
  const title = (media as Movie).title || (media as TvShow).name;
  const releaseDate = (media as Movie).release_date || (media as TvShow).first_air_date || undefined;

  return {
    tmdbId: media.id,
    title: title?.trim() || `${media.media_type} ${media.id}`,
    posterPath: media.poster_path?.trim() || undefined,
    releaseDate: releaseDate?.trim() || undefined,
    genres:
      (media.genres?.map((g: { id: number; name: string }) => g.name?.trim()).filter(Boolean) as string[]) ||
      (media.genre_ids?.map((id) => GENRES.find((g) => g.id === id)?.label?.trim()).filter(Boolean) as string[]) ||
      [],
    rating: media.vote_average ? +getRating(media.vote_average) : undefined,
    totalMinutesRuntime: calculateTotalMinutesRuntime(media) || undefined,
    networks: (media as TvShow).networks?.map((n) => n.id).filter((id) => typeof id === 'number') || [],
    media_type: media.media_type,
    overview: media.overview?.trim() || undefined,
  };
};

export const useAddOrUpdateLibraryItem = () => {
  const invalidateQueries = useInvalidateLibraryQueries();
  const library = useAuthStore((state) => state.user?.profile.library);

  return useMutation({
    mutationFn: ({
      item,
      media,
    }: {
      item: Partial<LibraryMedia> & Pick<LibraryMedia, 'id'>;
      media?: Media;
      toggleFavorite?: boolean;
    }) => {
      const metadata = media ? getMediaMetadata(media) : {};
      const updatedItem = { ...item, ...metadata };

      return addOrUpdateLibraryItem(updatedItem, library?.$id || null);
    },
    onSuccess: invalidateQueries,
  });
};

export const useRemoveLibraryItem = () => {
  const invalidateQueries = useInvalidateLibraryQueries();

  return useMutation({
    mutationFn: (item: LibraryMedia) => deleteLibraryItem(item.id),
    onSuccess: () => invalidateQueries(),
  });
};
export const useImportLibrary = () => {
  const invalidateQueries = useInvalidateLibraryQueries();
  const userId = useAuthStore((state) => state.user?.$id) || null;
  const library = useAuthStore((state) => state.user?.profile.library?.$id) || null;

  return useMutation({
    mutationFn: (items: LibraryMedia[]) => bulkaddOrUpdateLibraryItem(items.map((i) => ({ ...i, library, userId }))),
    onSuccess:  invalidateQueries
  });
};

export const useClearLibrary = () => {
  const invalidateQueries = useInvalidateLibraryQueries();
  const { confirm } = useConfirmationModal();
  const library = useAuthStore((state) => state.user?.profile.library);

  const clearMutation = useMutation({
    mutationFn: async () => {
      const clear = async () => {
        if (library?.$id) await appwriteService.library.clearLibrary(library.$id);
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
