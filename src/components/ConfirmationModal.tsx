'use client';

import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { JSX, useState } from 'react';
import Modal from './ui/Modal';

type Props = {
  disclosure: disclosure;
  icon: JSX.Element;
  heading: string;
  message: string;
  confirmText: string;
  showConfirmation?: boolean;
  action: (confirmation?: 'enabled' | 'disabled') => unknown;
};

export default function ConfirmationModal({
  disclosure,
  icon,
  heading,
  message,
  confirmText,
  showConfirmation = true,
  action,
}: Props) {
  const [confirmation, setConfirmation] = useState<'enabled' | 'disabled'>('enabled');

  return (
    <Modal disclosure={disclosure}>
          <ModalHeader className='flex items-center gap-4'>
            <div className='grid size-10 place-content-center rounded-full bg-Warning/600 text-white'>{icon}</div>
            <h2 className='text-xl font-semibold text-Primary/100'>{heading}</h2>
          </ModalHeader>
          <ModalBody>
            <p className='text-Grey/200'>{message}</p>
            {showConfirmation && (
              <div className='flex items-center gap-3'>
                <Checkbox
                  isSelected={confirmation === 'disabled'}
                  onValueChange={() => setConfirmation(confirmation === 'disabled' ? 'enabled' : 'disabled')}
                  classNames={{ label: 'text-Grey/300 text-sm' }}
                >
                  Don&apos;t show this message again
                </Checkbox>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button className='bg-Grey/800 hover:bg-Grey/700' onPress={disclosure.onClose}>
              Cancel
            </Button>
            <Button
              color='danger'
              onPress={() => {
                action(confirmation);
                disclosure.onClose();
              }}
            >
              {confirmText}
            </Button>
          </ModalFooter>
    </Modal>
  );
}
