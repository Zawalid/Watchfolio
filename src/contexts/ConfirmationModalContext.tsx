import { createContext, useContext } from 'react';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'warning';
  confirmationKey?: ConfirmationKeys;
}

export interface ConfirmationModalContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

export const ConfirmationModalContext = createContext<ConfirmationModalContextType | null>(null);


export const useConfirmationModal = () => {
  const context = useContext(ConfirmationModalContext);
  if (!context) {
    throw new Error('useConfirmationModal must be used within ConfirmationModalProvider');
  }
  return context;
};