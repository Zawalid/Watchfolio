import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuthStore } from '@/stores/useAuthStore';
import ChangeEmail from './ChangeEmail';
import AvatarManager from './AvatarManager';
import { profileSchema } from '@/lib/validation/auth';
import { getAvatarWithFallback } from '@/utils/avatar';

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
      avatarUrl: user?.profile?.avatarUrl || '',
    },
  });
  const [parent] = useAutoAnimate();
  const values = watch();

  const handleAvatarChange = (newAvatarUrl: string) => {
    setValue('avatarUrl', newAvatarUrl, { shouldDirty: true });
  };

  const onSubmit = async (data: FormData) => {
    if (!dirtyFields || !user) return;

    const updatedData = Object.fromEntries(Object.entries(data).filter(([key]) => dirtyFields[key as keyof FormData])); // Map form field names to profile field names
    const profileData: UpdateProfileInput = {};
    if (updatedData.name) profileData.name = updatedData.name;
    if (updatedData.preference) profileData.mediaPreference = updatedData.preference as MediaPreferenceType;
    if (updatedData.bio !== undefined) profileData.bio = updatedData.bio;
    if (updatedData.avatarUrl !== undefined) profileData.avatarUrl = updatedData.avatarUrl;

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

  if (!user) return null;

  return (
    <div className='flex flex-col gap-5'>
      <div className='mb-5'>
        <AvatarManager
          currentAvatarUrl={values.avatarUrl || getAvatarWithFallback(user.profile.avatarUrl, user.profile.name)}
          userName={user.profile.name}
          onAvatarChange={handleAvatarChange}
        />
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
            className='selectable-button!'
            data-is-selected={value === p}
            onPress={() => setValue(p as 'movies' | 'series' | 'both')}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  );
}
