import { createContext, useContext } from 'react';

interface LibraryModalContextType {
  openModal: (media: Media) => void;
}

export const LibraryModalContext = createContext<LibraryModalContextType | null>(null);

export const useLibraryModal = () => {
  const context = useContext(LibraryModalContext);
  if (!context) {
    throw new Error('useLibraryModal must be used within LibraryModalProvider');
  }
  return context;
};
