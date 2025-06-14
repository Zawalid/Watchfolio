import { useContext } from 'react';
import { LibraryModalContext } from '@/contexts/LibraryModalContext';

export const useLibraryModal = () => {
  const context = useContext(LibraryModalContext);
  if (!context) {
    throw new Error('useLibraryModal must be used within LibraryModalProvider');
  }
  return context;
};
