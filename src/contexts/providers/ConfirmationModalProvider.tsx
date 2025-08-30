import { useState, useRef, useCallback } from 'react';
import { useDisclosure } from '@heroui/react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { ConfirmationModalContext, type ConfirmationOptions } from '../ConfirmationModalContext';
import { useAuthStore } from '@/stores/useAuthStore';

const kebabToCamelCase = (str: string): string => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

export function ConfirmationModalProvider({ children }: { children: React.ReactNode }) {
  const { userPreferences, updateUserPreferences } = useAuthStore();
  const modalDisclosure = useDisclosure();
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
  });

  const resolveRef = useRef<(value: boolean) => void>(null);

  const shouldSkipConfirmation = useCallback(
    (confirmationKey: ConfirmationKeys): boolean => {
      if (!userPreferences) return false;

      const preferenceKey = (kebabToCamelCase(confirmationKey) + 'Confirmation') as ConfirmationPreferences;

      return userPreferences[preferenceKey] === 'disabled';
    },
    [userPreferences]
  );

  const savePreference = async (dontAskAgain: boolean) => {
    if (!dontAskAgain || !options.confirmationKey) return;

    const preferenceKey = (kebabToCamelCase(options.confirmationKey) + 'Confirmation') as ConfirmationPreferences;

    if (preferenceKey) {
      try {
        await updateUserPreferences({ [preferenceKey]: 'disabled' });
      } catch (error) {
        log('ERR', 'Failed to update user preferences:', error);
      }
    }
  };

  const confirm = useCallback(
    (options: ConfirmationOptions) => {
      if (options.confirmationKey && shouldSkipConfirmation(options.confirmationKey)) {
        return Promise.resolve(true);
      }

      setOptions(options);
      modalDisclosure.onOpen();

      return new Promise<boolean>((resolve) => (resolveRef.current = resolve));
    },
    [shouldSkipConfirmation, modalDisclosure]
  );

  const handleConfirm = async (dontAskAgain: boolean) => {
    if (resolveRef.current) {
      await savePreference(dontAskAgain);
      resolveRef.current(true);
      modalDisclosure.onClose();
    }
  };

  const handleCancel = async () => {
    if (resolveRef.current) {
      resolveRef.current(false);
      modalDisclosure.onClose();
    }
  };

  return (
    <ConfirmationModalContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationModal
        disclosure={modalDisclosure}
        options={options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationModalContext.Provider>
  );
}
