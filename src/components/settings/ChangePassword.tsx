import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { changePasswordSchema } from '@/lib/validation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@heroui/button';
import { ModalBody, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { addToast } from '@heroui/toast';
import { useAuthStore } from '@/stores/useAuthStore';

type FormData = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const { user, updateUserPassword, isLoading } = useAuthStore();
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
    try {
      await updateUserPassword(data.new_password, data.password);
      addToast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
        color: 'success',
      });
      close();
    } catch (error: unknown) {
      const authError = error as { type?: string; message?: string };
      switch (authError.type) {
        case 'password_recently_used':
        case 'password_personal_data':
          return setError('new_password', { message: authError.message || 'Password cannot be used' });
        case 'user_invalid_credentials':
          return setError('password', { message: 'The password you entered is incorrect. Please try again.' });
        default:
          addToast({
            title: 'Error updating password',
            description: authError.message || 'Failed to update password',
            color: 'danger',
          });
      }
    }
  };

  if (!user) {
    return (
      <div className='flex flex-col gap-5'>
        <p className='text-Grey-400'>Please sign in to change your password.</p>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col gap-2'>
        <h4 className='text-Grey-300 font-semibold'>Change Password</h4>
        <p className='text-Grey-300 text-sm'>Ensure your account is using a long, random password to stay secure.</p>
        <Button color='primary' size='sm' className='w-fit' onPress={disclosure.onOpen}>
          Change Password
        </Button>
      </div>
      <Modal disclosure={disclosure} className='max-w-xl'>
        <ModalHeader className='flex flex-col'>
          <h4 className='text-Primary-100 text-lg font-semibold'>Change your password</h4>
          <p className='text-Grey-300 text-sm'>
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
            <Button className='bg-Grey-800 hover:bg-Grey-700' onPress={close}>
              Cancel
            </Button>
            <Button color='primary' type='submit' isLoading={isSubmitting || isLoading} isDisabled={!isValid}>
              Change Password
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
