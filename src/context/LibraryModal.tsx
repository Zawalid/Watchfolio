import { useState } from 'react';
import { useDisclosure } from '@heroui/modal';
import LibraryModal from '@/components/details/LibraryModal';
import { LibraryModalContext } from './useLibraryModal';

export function LibraryModalProvider({ children }: { children: React.ReactNode }) {
  const modalDisclosure = useDisclosure();
  const [currentMedia, setCurrentMedia] = useState<Media | null>(null);

  const openModal = (media: Media) => {
    setCurrentMedia(media);
    modalDisclosure.onOpen();
  };

  return (
    <LibraryModalContext.Provider value={{ openModal }}>
      {children}
      {currentMedia && <LibraryModal disclosure={modalDisclosure} media={currentMedia} />}
    </LibraryModalContext.Provider>
  );
}
