'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { changePasswordSchema } from '@/lib/validation';
import Modal from '@/components/ui/Modal';
import { Button } from "@heroui/button";
import { ModalBody, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import PasswordInput from '@/components/ui/PasswordInput';
import { updatePassword } from '../actions/account';
import { toast } from 'sonner';

type FormData = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(changePasswordSchema), mode: 'onChange' });
  const disclosure = useDisclosure();

  const close = () => {
    disclosure.onClose();
    reset();
  };

  const onSubmit = async (data: FormData) => {
    const error = await updatePassword(data.password, data.new_password);
    if (error) {
      switch (error.type) {
        case 'password_recently_used':
        case 'password_personal_data':
          return setError('new_password', { message: error.message });
        case 'user_invalid_credentials':
          return setError('password', { message: 'The password you entered is incorrect. Please try again.' });
        default:
          toast.error(error.message);
      }
    } else {
      toast.success('Password updated successfully.');
      close();
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <h4 className='font-semibold text-Grey/300'>Change Password</h4>
        <p className='text-sm text-Grey/300'>Ensure your account is using a long, random password to stay secure.</p>
        <Button color='primary' size='sm' className='w-fit' onPress={disclosure.onOpen}>
          Change Password
        </Button>
      </div>
      <Modal disclosure={disclosure} className='max-w-xl'>
        <ModalHeader className='flex flex-col'>
          <h4 className='text-lg font-semibold text-Primary/100'>Change your password</h4>
          <p className='text-sm text-Grey/300'>
            Please enter your current password and new password to change your password.
          </p>
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className='flex flex-col gap-5'>
            <PasswordInput
              {...register('password')}
              name='password'
              label='Current Password'
              error={errors.password?.message}
            />
            <PasswordInput
              {...register('new_password')}
              name='new_password'
              label='New Password'
              error={errors.new_password?.message}
            />
            <PasswordInput
              {...register('confirm_password')}
              name='confirm_password'
              label='Confirm Password'
              error={errors.confirm_password?.message}
            />
          </ModalBody>
          <ModalFooter>
            <Button className='bg-Grey/800 hover:bg-Grey/700' onPress={close}>
              Cancel
            </Button>
            <Button color='primary' type='submit' isLoading={isSubmitting} isDisabled={!isValid}>
              Change Password
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
