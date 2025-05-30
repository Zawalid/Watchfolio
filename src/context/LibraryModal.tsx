import { createContext, useContext, useState } from 'react';
import { useDisclosure } from '@heroui/modal';
import LibraryModal from '@/components/details/LibraryModal';

interface LibraryModalContextType {
  openModal: (mediaType: 'movie' | 'tv', mediaId: number) => void;
}

const LibraryModalContext = createContext<LibraryModalContextType | null>(null);

export function LibraryModalProvider({ children }: { children: React.ReactNode }) {
  const modalDisclosure = useDisclosure();
  const [currentMedia, setCurrentMedia] = useState<{ mediaType: 'movie' | 'tv'; mediaId: number } | null>(null);

  const openModal = (mediaType: 'movie' | 'tv', mediaId: number) => {
    setCurrentMedia({ mediaType, mediaId });
    modalDisclosure.onOpen();
  };

  return (
    <LibraryModalContext.Provider value={{ openModal }}>
      {children}
      {currentMedia && (
        <LibraryModal
          disclosure={modalDisclosure}
          mediaType={currentMedia.mediaType}
          mediaId={currentMedia.mediaId}
        />
      )}
    </LibraryModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLibraryModal = () => {
  const context = useContext(LibraryModalContext);
  if (!context) {
    throw new Error('useLibraryModal must be used within LibraryModalProvider');
  }
  return context;
};