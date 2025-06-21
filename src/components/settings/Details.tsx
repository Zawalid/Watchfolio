import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuthStore } from '@/stores/useAuthStore';
import ChangeEmail from './ChangeEmail';
import { profileSchema } from '@/lib/validation';
import { cn } from '@/utils';

type FormData = z.infer<typeof profileSchema>;

export default function Details() {
  const { user, updateUserProfile, isLoading } = useAuthStore();

  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid, isDirty, isSubmitting, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.profile?.name || '',
      preference: user?.profile?.mediaPreference || 'both',
      bio: user?.profile?.bio || '',
    },
  });
  const [parent] = useAutoAnimate();
  const values = watch();

  const onSubmit = async (data: FormData) => {
    if (!dirtyFields || !user) return;

    const updatedData = Object.fromEntries(Object.entries(data).filter(([key]) => dirtyFields[key as keyof FormData]));

    // Map form field names to profile field names
    const profileData: UpdateProfileInput = {};
    if (updatedData.name) profileData.name = updatedData.name;
    if (updatedData.preference) profileData.mediaPreference = updatedData.preference as MediaPreferenceType;
    if (updatedData.bio !== undefined) profileData.bio = updatedData.bio;

    try {
      await updateUserProfile(profileData);
      reset(data);
      addToast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        color: 'success',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        color: 'danger',
      });
    }
  };

  if (!user) {
    return (
      <div className='flex flex-col gap-5'>
        <p className='text-Grey-400'>Please sign in to manage your profile.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='mb-5 flex items-center gap-5'>
        <Avatar
          src={user.profile.avatarUrl || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.profile.name}`}
          isBordered
          className='!size-20'
          classNames={{ base: 'bg-transparent', icon: 'text-Primary-100' }}
          color='secondary'
          showFallback
        />
        <div className='relative'>
          <div className='text-Grey-300 absolute z-10 grid size-full place-content-center font-bold'>
            <span>Coming Soon...</span>
          </div>
          <div className='border-border flex flex-col gap-2 rounded-lg border p-3 opacity-55 blur-[1px]'>
            <div className='flex gap-2'>
              <Button color='primary' size='sm'>
                Change Avatar
              </Button>
              <Button color='danger' variant='ghost' size='sm'>
                Remove Avatar
              </Button>
            </div>
            <p className='text-Grey-500 text-sm'>
              Pick a photo up to 5MB <span className='text-Grey-300 text-xs font-semibold'>(JPG, PNG, JPEG, SVG)</span>.
              Your avatar photo will be public.
            </p>
          </div>
        </div>
      </div>
      <ChangeEmail email={user.profile.email} verified={user.emailVerification} />
      <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('name')}
          icon='name'
          defaultValue={user.profile.name}
          label='Name'
          placeholder='Your Name'
          error={errors.name?.message}
        />
        <div className='text-Grey-100 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm'>
          <Avatar
            alt={user.location.country}
            className='h-6 w-8 rounded-md'
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${user.location.countryCode}.svg`}
          />
          {user.location.country}
        </div>{' '}
        <Preference
          value={values.preference}
          setValue={(value: 'movies' | 'series' | 'both') => setValue('preference', value, { shouldDirty: true })}
        />
        <Textarea
          {...register('bio')}
          label='Bio'
          placeholder='Tell us about yourself...'
          defaultValue={user.profile.bio}
          error={errors.bio?.message}
        />
        <div className='flex items-center justify-end gap-4' ref={parent}>
          {isDirty && isValid && (
            <>
              <Button className='bg-Grey-800 hover:bg-Grey-700' onPress={() => reset()}>
                Cancel
              </Button>
              <Button color='primary' type='submit' isLoading={isSubmitting || isLoading}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

function Preference({ value, setValue }: { value: string; setValue: (value: 'movies' | 'series' | 'both') => void }) {
  return (
    <div className='flex flex-col gap-2'>
      <label className='text-Grey-400 text-sm'>What are you into</label>
      <div className='grid grid-cols-3 gap-5'>
        {['movies', 'series', 'both'].map((p) => (
          <Button
            key={p}
            className={cn(
              'pill-bg flex items-center justify-center gap-2 px-4 py-2 font-medium capitalize transition-colors duration-200',
              value === p
                ? 'border-Secondary-400 bg-Secondary-500/20 text-Secondary-50'
                : 'text-Grey-300 border-white/10 bg-gray-800/40 hover:border-white/20 hover:bg-white/10'
            )}
            onPress={() => setValue(p as 'movies' | 'series' | 'both')}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  );
}
