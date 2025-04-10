'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { changeEmailSchema } from '@/lib/validation';
import Modal from '@/components/ui/Modal';
import { Button } from "@heroui/button";
import { ModalBody, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { UPDATE_ICON } from '@/components/ui/Icons';
import { sendVerificationEmail, updateEmail } from '../actions/account';
import { toast } from 'sonner';

type FormData = z.infer<typeof changeEmailSchema>;

export default function ChangeEmail({ email, verified }: { email?: string; verified?: boolean }) {
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
    const error = await updateEmail(data.email, data.password);
    if (error) {
      switch (error.type) {
        case 'user_target_already_exists':
          return setError('email', { message: error.message });
        case 'user_invalid_credentials':
          return setError('password', { message: 'The password you entered is incorrect. Please try again.' });
        default:
          toast.error(error.message);
      }
    } else {
      toast.success('Email address updated successfully.', {
        description: 'Please check your email for the verification link.',
      });
      close();
    }
  };

  return (
    <>
      <div className='flex items-baseline gap-3'>
        <div className='flex-1 space-y-1'>
          <Input defaultValue={email} type='email' label='Email' readOnly />
          {!verified && (
            <div className='flex gap-2'>
              <p className='text-sm text-Grey/500'>Your email is not verified</p>
              <button
                className='text-sm text-Primary/400 transition-colors duration-200 hover:text-Primary/500'
                onClick={async () => {
                  const error = await sendVerificationEmail();
                  if (error) toast.error(error.message);
                  else {
                    toast.success('Verification email sent successfully.', {
                      description: 'Please check your email for the verification link.',
                    });
                  }
                }}
              >
                Resend Verification
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
          <h4 className='text-lg font-semibold text-Primary/100'>Change email address</h4>
          <p className='text-sm text-Grey/300'>
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
            <Button className='bg-Grey/800 hover:bg-Grey/700' onPress={close}>
              Cancel
            </Button>
            <Button color='primary' type='submit' isLoading={isSubmitting} isDisabled={!isValid}>
              Change Email
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
