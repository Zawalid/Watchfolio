import { useContext } from 'react';
import { MediaStatusModalContext } from '@/contexts/MediaStatusModalContext';

export const useMediaStatusModal = () => {
  const context = useContext(MediaStatusModalContext);
  if (!context) {
    throw new Error('useMediaStatusModal must be used within MediaStatusModalProvider');
  }
  return context;
};
