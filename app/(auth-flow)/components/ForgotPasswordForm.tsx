'use client';

import Input from '@/components/ui/Input';
import { useAction } from '@/hooks/useAction';
import { Button } from '@heroui/button';
import { sendPasswordResetEmail } from '../actions/password-reset';

export default function Form() {
  const { errors, formAction, isPending } = useAction(sendPasswordResetEmail);

  return (
    <form action={formAction} className='flex flex-col gap-5'>
      <Input
        type='email'
        name='email'
        label='Email'
        placeholder='eg. hello@example.com'
        defaultValue={'walid@gmail.com'}
        error={errors?.email?.[0]}
      />
      <Button className='w-full bg-Primary/500 text-white hover:bg-Primary/600' type='submit' isLoading={isPending}>
        Reset Password
      </Button>
    </form>
  );
}
