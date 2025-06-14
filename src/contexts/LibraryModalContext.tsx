import { createContext } from 'react';

interface LibraryModalContextType {
  openModal: (media: Media | LibraryMedia) => void;
}

export const LibraryModalContext = createContext<LibraryModalContextType | null>(null);
