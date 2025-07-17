import { useState } from 'react';
import { useDisclosure } from '@heroui/react';
import MediaStatusModal from '../../components/media/MediaStatusModal';
import { MediaStatusModalContext } from '../MediaStatusModalContext';

export function MediaStatusModalProvider({ children }: { children: React.ReactNode }) {
  const modalDisclosure = useDisclosure();
  const [currentMedia, setCurrentMedia] = useState<Media | LibraryMedia | null>(null);

  const openModal = (media: Media | LibraryMedia) => {
    setCurrentMedia(media);
    modalDisclosure.onOpen();
  };

  return (
    <MediaStatusModalContext.Provider value={{ openModal }}>
      {children}
      {currentMedia && <MediaStatusModal disclosure={modalDisclosure} media={currentMedia} />}
    </MediaStatusModalContext.Provider>
  );
}
