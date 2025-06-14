import { useState, useRef, useCallback } from 'react';
import { useDisclosure } from '@heroui/modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { ConfirmationModalContext, type ConfirmationOptions } from '../ConfirmationModalContext';

export function ConfirmationModalProvider({ children }: { children: React.ReactNode }) {
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
      // Check if "don't ask again" was previously set for this confirmation
      const confirmationKey = options.confirmationKey;
      if (confirmationKey) {
        const dontAskAgainValue = localStorage.getItem(`confirmation_${confirmationKey}`);
        if (dontAskAgainValue === 'true') {
          return Promise.resolve(true); // Auto-confirm if "don't ask again" was selected
        }
      }

      // Update modal options
      setOptions(options);
      modalDisclosure.onOpen();

      // Return a promise that will be resolved when the user makes a choice
      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    [modalDisclosure]
  );

  const handleConfirm = (confirmed: boolean, dontAskAgain: boolean) => {
    if (resolveRef.current) {
      // If "don't ask again" is checked, store the preference
      if (dontAskAgain && options.confirmationKey) {
        localStorage.setItem(`confirmation_${options.confirmationKey}`, 'true');
      }

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
