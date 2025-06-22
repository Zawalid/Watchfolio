import { useState, useRef, useCallback } from 'react';
import { useDisclosure } from '@heroui/modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { ConfirmationModalContext, type ConfirmationOptions } from '../ConfirmationModalContext';
import { useAuthStore } from '@/stores/useAuthStore';

export function ConfirmationModalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const modalDisclosure = useDisclosure();
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
  });

  // Store the resolve function to call when user responds
  const resolveRef = useRef<(value: boolean) => void>(null);

  const confirm = useCallback(
    (options: ConfirmationOptions) => {
      // Check user preferences for specific confirmation types
      if (user?.preferences && options.confirmationKey) {
        const { preferences } = user;
        
        // Map confirmation keys to user preference settings
        if (options.confirmationKey === 'sign-out' && preferences.signOutConfirmation === 'disabled') {
          return Promise.resolve(true);
        }
        if (options.confirmationKey === 'remove-from-library' && preferences.removeFromWatchlistConfirmation === 'disabled') {
          return Promise.resolve(true);
        }
      }

      // Update modal options
      setOptions(options);
      modalDisclosure.onOpen();

      // Return a promise that will be resolved when the user makes a choice
      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
      });    },
    [modalDisclosure, user]
  );

  const handleConfirm = (confirmed: boolean, _dontAskAgain: boolean) => {
    console.log(_dontAskAgain)
    if (resolveRef.current) {
      // TODO: If "don't ask again" is checked, update user preferences
      // This would require access to updateUserPreferences function
      // For now, we'll leave this as a future enhancement
      
      // Resolve the promise with the user's choice
      resolveRef.current(confirmed);
      modalDisclosure.onClose();
    }
  };

  return (
    <ConfirmationModalContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationModal
        disclosure={modalDisclosure}
        options={options}
        onConfirm={(dontAskAgain) => handleConfirm(true, dontAskAgain)}
        onCancel={(dontAskAgain) => handleConfirm(false, dontAskAgain)}
      />
    </ConfirmationModalContext.Provider>
  );
}
