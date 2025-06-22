import { useState, useRef, useCallback } from 'react';
import { useDisclosure } from '@heroui/modal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { ConfirmationModalContext, type ConfirmationOptions } from '../ConfirmationModalContext';
import { LOCAL_STORAGE_PREFIX } from '@/utils/constants';
import { useAuthStore } from '@/stores/useAuthStore';

// Helper function to convert kebab-case to camelCase
const kebabToCamelCase = (str: string): string => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const isConfirmationSetting = (value: unknown): value is 'enabled' | 'disabled' => {
  return typeof value === 'string' && (value === 'enabled' || value === 'disabled');
};

const saveToLocalStorage = (key: string) =>
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}confirmation-${key}`, 'disabled');

export function ConfirmationModalProvider({ children }: { children: React.ReactNode }) {
  const { user, updateUserPreferences, isAuthenticated } = useAuthStore();
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

  // Helper function to check if confirmation should be skipped
  const shouldSkipConfirmation = useCallback(
    (confirmationKey: string): boolean => {
      const preferenceKey = (kebabToCamelCase(confirmationKey) + 'Confirmation') as ConfirmationPreferences;

      if (isAuthenticated && user?.preferences) {
        // Check if this preference exists in user preferences and is a confirmation setting
        const preferences = user.preferences;
        if (preferenceKey in preferences) {
          const value = preferences[preferenceKey];
          if (isConfirmationSetting(value)) return value === 'disabled';
        }
      }

      // For unauthenticated users or missing preferences, check localStorage
      const dontAskAgainValue = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}confirmation-${confirmationKey}`);
      return dontAskAgainValue === 'disabled';
    },
    [isAuthenticated, user]
  );

  const confirm = useCallback(
    (options: ConfirmationOptions) => {
      // Auto-confirm if "don't ask again" was selected
      if (options.confirmationKey && shouldSkipConfirmation(options.confirmationKey)) return Promise.resolve(true);

      setOptions(options);
      modalDisclosure.onOpen();

      // Return a promise that will be resolved when the user makes a choice
      return new Promise<boolean>((resolve) => (resolveRef.current = resolve));
    },
    [shouldSkipConfirmation, modalDisclosure]
  );

  // Helper function to save preference
  const savePreference = async (dontAskAgain: boolean) => {
    if (dontAskAgain && options.confirmationKey) {
      // Convert kebab-case key to camelCase preference key
      const preferenceKey = (kebabToCamelCase(options.confirmationKey) + 'Confirmation') as ConfirmationPreferences;

      if (isAuthenticated && updateUserPreferences) {
        // Check if this preference exists in user preferences
        const preferences = user?.preferences;
        if (preferences && preferenceKey in preferences) {
          const currentValue = preferences[preferenceKey];
          // Only update if it's a confirmation setting
          if (isConfirmationSetting(currentValue)) {
            try {
              await updateUserPreferences({ [preferenceKey]: 'disabled' });
            } catch (error) {
              console.error('Failed to update user preferences:', error);
              // Fallback to localStorage if database update fails
              saveToLocalStorage(options.confirmationKey);
            }
          } else {
            // If not a confirmation setting, use localStorage
            saveToLocalStorage(options.confirmationKey);
          }
        } else {
          // If preference doesn't exist in user model, use localStorage
          saveToLocalStorage(options.confirmationKey);
        }
      } else {
        // For unauthenticated users, keep using localStorage
        saveToLocalStorage(options.confirmationKey);
      }
    }
  };

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
