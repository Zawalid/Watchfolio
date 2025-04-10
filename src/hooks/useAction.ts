'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from './useSearchParams';

export const useAction = (action: (_: unknown, formData: FormData) => Promise<FormError | undefined>) => {
  const [errors, formAction, isPending] = useActionState(action, null);
  const { searchParams } = useSearchParams();
  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (errors?.message) toast.error(errors.message);
    if (errorParam) toast.error(JSON.parse(errorParam).message);
  }, [errors, errorParam]);

  return { errors, formAction, isPending };
};
