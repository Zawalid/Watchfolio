import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalBody, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { Modal } from '@/components/ui/Modal';
import { changeEmailSchema } from '@/lib/validation/auth';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { UPDATE_ICON } from '@/components/ui/Icons';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';

type FormData = z.infer<typeof changeEmailSchema>;

export default function ChangeEmail({ email, verified }: { email?: string; verified?: boolean }) {
  const { updateUserEmail, sendEmailVerification, isLoading } = useAuthStore();
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(changeEmailSchema), mode: 'onChange' });
  const disclosure = useDisclosure();

  const close = () => {
    disclosure.onClose();
    reset();
  };

  const onSubmit = async (data: FormData) => {
    if (data.email === email) {
      return setError('email', { message: 'The email address you entered is the same as your current email address.' });
    }

    try {
      await updateUserEmail(data.email, data.password);
      addToast({
        title: 'Email updated successfully',
        description: 'Please check your email for the verification link.',
        color: 'success',
      });
      close();
    } catch (error: unknown) {
      const authError = error as { type?: string; message?: string };
      switch (authError.type) {
        case 'user_target_already_exists':
          return setError('email', { message: authError.message || 'Email already exists' });
        case 'user_invalid_credentials':
          return setError('password', { message: 'The password you entered is incorrect. Please try again.' });
        default:
          addToast({
            title: 'Error updating email',
            description: authError.message || 'Failed to update email address',
            color: 'danger',
          });
      }
    }
  };
  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    try {
      await sendEmailVerification();
      addToast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link.',
        color: 'success',
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      addToast({
        title: 'Error',
        description: 'Failed to send verification email. Please try again.',
        color: 'danger',
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <>
      <div className='flex items-baseline gap-3'>
        <div className='flex-1 space-y-1'>
          <Input defaultValue={email} type='email' label='Email' readOnly />{' '}
          {!verified && (
            <div className='flex gap-2'>
              <p className='text-Grey-500 text-sm'>Your email is not verified</p>
              <button
                className='text-Primary-400 hover:text-Primary-500 text-sm transition-colors duration-200 disabled:opacity-50'
                onClick={handleResendVerification}
                disabled={isSendingVerification}
              >
                {isSendingVerification ? 'Sending...' : 'Resend Verification'}
              </button>
            </div>
          )}
        </div>
        <Button isIconOnly color='primary' size='lg' onPress={disclosure.onOpen}>
          {UPDATE_ICON}
        </Button>
      </div>
      <Modal disclosure={disclosure} className='max-w-xl'>
        <ModalHeader className='flex flex-col'>
          <h4 className='text-Primary-100 text-lg font-semibold'>Change email address</h4>
          <p className='text-Grey-300 text-sm'>
            Please enter your new email address and password to change your email address.
          </p>
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className='flex flex-col gap-5'>
            <Input
              {...register('email')}
              type='email'
              label='Email'
              placeholder='Your Email'
              error={errors.email?.message}
            />
            <Input
              {...register('confirm_email')}
              type='email'
              label='Confirm Email'
              error={errors.confirm_email?.message}
            />
            <PasswordInput
              {...register('password')}
              name='password'
              label='Your Password'
              error={errors.password?.message}
            />
          </ModalBody>
          <ModalFooter>
            <Button className='bg-Grey-800 hover:bg-Grey-700' onPress={close}>
              Cancel
            </Button>
            <Button color='primary' type='submit' isLoading={isSubmitting || isLoading} isDisabled={!isValid}>
              Change Email
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
