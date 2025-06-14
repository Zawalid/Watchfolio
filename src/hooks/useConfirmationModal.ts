import { useContext } from 'react';
import { ConfirmationModalContext } from '@/contexts/ConfirmationModalContext';

export const useConfirmationModal = () => {
  const context = useContext(ConfirmationModalContext);
  if (!context) {
    throw new Error('useConfirmationModal must be used within ConfirmationModalProvider');
  }
  return context;
};
