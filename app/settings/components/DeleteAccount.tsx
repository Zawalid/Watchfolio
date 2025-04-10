'use client';

import ConfirmationModal from '@/components/ConfirmationModal';
import { WARNING_ICON } from '@/components/ui/Icons';
import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/modal';
import { deleteAccount } from '../actions/account';

export default function DeleteAccount() {
  const disclosure = useDisclosure();

  return (
    <>
      <div className='flex flex-col gap-2'>
        <h4 className='font-semibold text-Grey/300'>Delete Account</h4>
        <p className='text-sm text-Grey/300'>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button color='danger' size='sm' className='w-fit' onPress={disclosure.onOpen}>
          Delete Account
        </Button>
      </div>
      <ConfirmationModal
        disclosure={disclosure}
        icon={WARNING_ICON}
        heading='Delete Account'
        message='Are you sure you want to delete your account? This action is irreversible.'
        confirmText='Delete'
        showConfirmation={false}
        action={async () => await deleteAccount()}
      />
    </>
  );
}
