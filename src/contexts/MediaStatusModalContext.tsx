import { createContext } from 'react';

interface MediaStatusModalContextType {
  openModal: (media: Media | LibraryMedia) => void;
}

export const MediaStatusModalContext = createContext<MediaStatusModalContextType | null>(null);
