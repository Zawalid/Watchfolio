import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { changePasswordSchema } from '@/lib/validation/settings';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@heroui/react';
import { ModalBody, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { addToast } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { KeyRound, Info } from 'lucide-react';

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
    <div className='space-y-4'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-4'>
          <div className='space-y-2'>
            <h4 className='text-Primary-100 text-lg font-semibold'>Change Password</h4>
            <p className='text-Grey-300 max-w-md text-sm'>
              Keep your account secure with a strong, unique password. We recommend using a password manager.
            </p>
          </div>
        </div>
        <Button color='primary' size='sm' onPress={disclosure.onOpen} className='flex items-center gap-2'>
          <KeyRound className='size-4' />
          Change Password
        </Button>
      </div>

      <div className='flex items-start gap-3'>
        <Info className='text-Primary-400 mt-0.5 size-5 flex-shrink-0' />
        <div className='space-y-1'>
          <p className='text-Primary-300 text-sm font-medium'>Password Security Tips</p>
          <ul className='text-Grey-400 space-y-1 text-xs'>
            <li>• Use at least 12 characters with mixed case, numbers, and symbols</li>
            <li>• Avoid personal information or dictionary words</li>
            <li>• Use a unique password for this account</li>
            <li>• Consider using a password manager for better security</li>
          </ul>
        </div>
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
              {isSubmitting || isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
