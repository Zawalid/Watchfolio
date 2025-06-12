import { useState } from 'react';
import { useDisclosure } from '@heroui/modal';
import LibraryModal from '@/components/library/LibraryModal';
import { LibraryModalContext } from '../hooks/useLibraryModal';

export function LibraryModalProvider({ children }: { children: React.ReactNode }) {
  const modalDisclosure = useDisclosure();
  const [currentMedia, setCurrentMedia] = useState<Media | LibraryMedia | null>(null);

  const openModal = (media: Media | LibraryMedia) => {
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
