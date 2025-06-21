import { useState } from 'react';
import { Button } from '@heroui/button';
import { ModalBody, ModalFooter } from '@heroui/modal';
import { Checkbox } from '@heroui/checkbox';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { type ConfirmationOptions } from '@/contexts/ConfirmationModalContext';
import { cn } from '@/utils';

interface Disclosure {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

interface ConfirmationModalProps {
  disclosure: Disclosure;
  options: ConfirmationOptions;
  onConfirm: (dontAskAgain: boolean) => void;
  onCancel: (dontAskAgain: boolean) => void;
}

export default function ConfirmationModal({ disclosure, options, onConfirm, onCancel }: ConfirmationModalProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  // Reset "don't ask again" when modal opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) setDontAskAgain(false);
    disclosure.onOpenChange(isOpen);
  };

  const { title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmVariant = 'danger' } = options;

  // Get button style based on variant
  const getButtonStyle = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-Error-500 hover:bg-Error-600 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'primary':
      default:
        return 'bg-Primary-500 hover:bg-Primary-600 text-white';
    }
  };

  return (
    <Modal disclosure={{ ...disclosure, onOpenChange: handleOpenChange }} hideCloseButton>
      <ModalBody className='p-6'>
        <div className='flex items-start gap-4'>
          <div
            className={cn(
              'rounded-full p-3',
              confirmVariant === 'danger'
                ? 'bg-Error-500/10 text-Error-400'
                : confirmVariant === 'warning'
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'bg-Primary-500/10 text-Primary-400'
            )}
          >
            <AlertTriangle className='size-6' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-xl font-semibold text-white'>{title}</h3>
            <p className='text-Grey-300'>{message}</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className='flex flex-col gap-4 px-6 pb-6'>
        {options.confirmationKey && (
          <div className='flex items-center'>
            <Checkbox isSelected={dontAskAgain} onValueChange={setDontAskAgain} id='dont-ask-again' color='primary' />
            <label htmlFor='dont-ask-again' className='text-Grey-300 ml-2 cursor-pointer text-sm'>
              Don&apos;t show this message again
            </label>
          </div>
        )}

        <div className='flex w-full justify-end gap-3'>
          <Button className='text-Grey-300 hover:bg-white/5' variant='ghost' onPress={() => onCancel(dontAskAgain)}>
            {cancelText}
          </Button>
          <Button className={getButtonStyle()} onPress={() => onConfirm(dontAskAgain)}>
            {confirmText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
