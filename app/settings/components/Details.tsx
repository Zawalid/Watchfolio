'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'sonner';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import Input from '@/components/ui/Input';
import ChangeEmail from './ChangeEmail';
import Textarea from '@/components/ui/Textarea';
import { profileSchema } from '@/lib/validation';
import { updateProfile } from '../actions/account';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type FormData = z.infer<typeof profileSchema>;

export default function Details({ user }: { user: User | null }) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid, isDirty, isSubmitting, dirtyFields, defaultValues },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: { name: user?.name, preference: user?.preference, bio: user?.bio || undefined },
  });
  const [parent] = useAutoAnimate();
  const values = watch();


  const onSubmit = async (data: FormData) => {
    if (!dirtyFields) return;
    const updatedData = Object.fromEntries(Object.entries(data).filter(([key]) => dirtyFields[key as keyof FormData]));
    const error = await updateProfile(updatedData, Object.keys(updatedData));
    if (error) toast.error(error.message);
    else toast.success('User updated successfully');
    reset(data);
  };
  return (
    <div className='flex flex-col gap-5'>
      <div className='mb-5 flex items-center gap-5'>
        <Avatar
          src={user?.image || ''}
          isBordered
          className='!size-20'
          classNames={{ base: 'bg-transparent', icon: 'text-Primary/100' }}
          color='secondary'
          showFallback
        />
        <div className='relative'>
          <div className='absolute z-10 grid size-full place-content-center font-bold text-Grey/300'>
            <span>Coming Soon...</span>
          </div>
          <div className='flex flex-col gap-2 rounded-lg border border-border p-3 opacity-55 blur-[1px]'>
            <div className='flex gap-2'>
              <Button color='primary' size='sm'>
                Change Avatar
              </Button>
              <Button color='danger' variant='ghost' size='sm'>
                Remove Avatar
              </Button>
            </div>
            <p className='text-sm text-Grey/500'>
              Pick a photo up to 5MB <span className='text-xs font-semibold text-Grey/300'>(JPG, PNG, JPEG, SVG)</span>.
              Your avatar photo will be public.
            </p>
          </div>
        </div>
      </div>
      <ChangeEmail email={user?.email} verified={user?.emailVerified} />
      <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('name')}
          icon='name'
          defaultValue={user?.name}
          label='Name'
          placeholder='You Name'
          error={errors.name?.message}
        />
        <div className='flex w-full items-center gap-2 rounded-xl border-2 border-Grey/800 bg-transparent px-4 py-3 text-sm text-Grey/100'>
          <Avatar
            alt={user?.locale || ''}
            className='h-6 w-8 rounded-md'
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${'MA'}.svg`}
          />
          {user?.locale}
        </div>
        <Preference
          value={values.preference}
          setValue={(value: string) => setValue('preference', value, { shouldDirty: true })}
        />
        <Textarea
          {...register('bio')}
          label='Bio'
          placeholder='Tell us about yourself...'
          defaultValue={user?.bio || ''}
          error={errors.bio?.message}
        />

        <div className='flex items-center justify-end gap-4' ref={parent}>
          {isDirty && isValid && (
            <>
              <Button className='bg-Grey/800 hover:bg-Grey/700' onPress={() => reset()}>
                Cancel
              </Button>
              <Button color='primary' type='submit' isLoading={isSubmitting}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

function Preference({ value, setValue }: { value: string; setValue: any }) {
  return (
    <div className='flex flex-col gap-2'>
      <label className='textGrey/600 text-sm text-Grey/400'>What are you into</label>
      <div className='grid grid-cols-3 gap-5'>
        {['movies', 'tv', 'both'].map((p) => (
          <button
            type='button'
            key={p}
            className={`gap-2 rounded-xl border-2 px-4 py-3 text-center text-sm capitalize text-Grey/100 ${p === value ? 'border-Primary/500 bg-transparent' : 'border-Grey/800 bg-Black/10'}`}
            onClick={() => setValue(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
