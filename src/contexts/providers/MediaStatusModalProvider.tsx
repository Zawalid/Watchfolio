import { useState, useCallback } from 'react';
import { useDisclosure, addToast } from '@heroui/react';
import MediaStatusModal from '@/components/modals/MediaStatusModal';
import { MediaStatusModalContext } from '../MediaStatusModalContext';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAddOrUpdateLibraryItem } from '@/hooks/library/useLibraryMutations';
import { generateMediaId } from '@/utils/library';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

export function MediaStatusModalProvider({ children }: { children: React.ReactNode }) {
  const modalDisclosure = useDisclosure();
  const [currentMedia, setCurrentMedia] = useState<Media | LibraryMedia | null>(null);
  
  const defaultMediaStatus = useAuthStore((state) => state.userPreferences.defaultMediaStatus);
  const { mutate: addOrUpdateItem } = useAddOrUpdateLibraryItem();

  const openModal = useCallback((media: Media | LibraryMedia, libraryItem?: LibraryMedia) => {
    const inLibrary = libraryItem && (libraryItem.status !== 'none' || libraryItem.userRating);

    // Smart logic: If user has default status set and item is not in library, add directly
    if (defaultMediaStatus !== 'none' && !inLibrary) {
      // Determine media type - check if it's a Movie (has 'title') or TvShow (has 'name')
      const mediaType: MediaType = 'title' in media ? 'movie' : 'tv';

      // If media is already a proper Media type (Movie or TvShow), use it
      // Otherwise, pass undefined (library item will have cached TMDB data)
      const mediaForMutation: Media | undefined =
        'id' in media && typeof media.id === 'number'
          ? { ...media, media_type: mediaType } as Media
          : undefined;

      addOrUpdateItem({
        item: {
          id: generateMediaId(media),
          status: defaultMediaStatus,
          media_type: mediaType
        },
        media: mediaForMutation,
      });

      // Show toast confirmation
      const statusLabel = LIBRARY_MEDIA_STATUS.find(s => s.value === defaultMediaStatus)?.label || defaultMediaStatus;
      addToast({
        title: `Added to ${statusLabel}`,
        color: 'success',
      });
    } else {
      // Show modal for editing or when no default status set
      setCurrentMedia(media);
      modalDisclosure.onOpen();
    }
  }, [defaultMediaStatus, addOrUpdateItem, modalDisclosure]);

  return (
    <MediaStatusModalContext.Provider value={{ openModal }}>
      {children}
      {currentMedia && <MediaStatusModal disclosure={modalDisclosure} media={currentMedia} />}
    </MediaStatusModalContext.Provider>
  );
}
