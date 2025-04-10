'use client';

import { useAction } from '@/hooks/useAction';
import { Button } from "@heroui/button";
import PasswordInput from '@/components/ui/PasswordInput';
import { resetPassword } from '../actions/password-reset';

export default function Form({ userId, secret }: { userId?: string; secret?: string }) {
  const { errors, formAction, isPending } = useAction((_, formData) => resetPassword({ userId, secret }, formData));

  return (
    <form action={formAction} className='flex flex-col gap-5'>
      <PasswordInput
        name='password'
        label='Password'
        
        defaultValue={'password'}
        error={errors?.password?.[0]}
      />
      <PasswordInput
        name='confirm_password'
        label='Confirm Password'
        
        defaultValue={'password'}
        error={errors?.confirm_password?.[0]}
      />
      <Button className='w-full bg-Primary/500 text-white hover:bg-Primary/600' type='submit' isLoading={isPending}>
        {isPending ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
  );
}
