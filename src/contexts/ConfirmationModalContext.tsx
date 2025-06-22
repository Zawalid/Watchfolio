import { createContext } from 'react';

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
