import { createContext, useContext } from 'react';

interface MediaStatusModalContextType {
  openModal: (media: Media | LibraryMedia, libraryItem?: LibraryMedia) => void;
}

export const MediaStatusModalContext = createContext<MediaStatusModalContextType | null>(null);

export const useMediaStatusModal = () => {
  const context = useContext(MediaStatusModalContext);
  if (!context) {
    throw new Error('useMediaStatusModal must be used within MediaStatusModalProvider');
  }
  return context;
};
