'use client';

import { useAction } from '@/hooks/useAction';
import { Button } from "@heroui/button";
import { signInMagically } from '../actions/password-reset';

export default function Form({ userId, secret }: { userId?: string; secret?: string }) {
  const { formAction, isPending } = useAction(() => signInMagically(userId, secret));

  return (
    <form action={formAction}>
      <Button color='primary' type='submit' className='w-full' isLoading={isPending}>
        {isPending ? 'Signin In...' : 'Continue'}
      </Button>
    </form>
  );
}
