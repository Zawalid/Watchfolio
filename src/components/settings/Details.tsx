import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuthStore } from '@/stores/useAuthStore';
import ChangeEmail from './ChangeEmail';
import AvatarManager from './AvatarManager';
import { profileInfoSchema } from '@/lib/validation/settings';
import { getAvatarWithFallback } from '@/utils/avatar';
import { useState } from 'react';

type FormData = z.infer<typeof profileInfoSchema>;

export default function Details() {
  const { user, updateUserProfile, sendEmailVerification, isLoading } = useAuthStore();
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid, isDirty, isSubmitting, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(profileInfoSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      username: user?.profile?.username || '',
      bio: user?.profile?.bio || '',
      avatarUrl: user?.profile?.avatarUrl || '',
    },
  });
  const values = watch();

  const handleSendVerification = async () => {
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

  const handleAvatarChange = (newAvatarUrl: string) => {
    setValue('avatarUrl', newAvatarUrl, { shouldDirty: true });
  };

  const onSubmit = async (data: FormData) => {
    if (!dirtyFields || !user) return;

    const updatedData = Object.fromEntries(Object.entries(data).filter(([key]) => dirtyFields[key as keyof FormData])); // Map form field names to profile field names
    const profileData: UpdateProfileInput = {};
    if (updatedData.name) profileData.name = updatedData.name;
    if (updatedData.bio !== undefined) profileData.bio = updatedData.bio;
    if (updatedData.avatarUrl !== undefined) profileData.avatarUrl = updatedData.avatarUrl;
    if (updatedData.username !== undefined) profileData.username = updatedData.username;

    try {
      await updateUserProfile(dirtyFields as UpdateProfileInput);
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
          currentAvatarUrl={values.avatarUrl || getAvatarWithFallback(user.profile.avatarUrl, user.name)}
          userName={user.name}
          onAvatarChange={handleAvatarChange}
        />{' '}
      </div>
      <ChangeEmail email={user.email} verified={user.emailVerification} />

      {/* Email Verification Section */}
      {!user.emailVerification && (
        <div className='rounded-lg border border-orange-500/20 bg-orange-500/10 p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium text-orange-400'>Email Verification Required</h3>
              <p className='text-Grey-400 text-sm'>Please verify your email address to access all features.</p>
            </div>
            <Button
              color='warning'
              variant='flat'
              size='sm'
              isLoading={isSendingVerification}
              onPress={handleSendVerification}
            >
              {isSendingVerification ? 'Sending...' : 'Send Verification'}
            </Button>
          </div>
        </div>
      )}

      <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('name')}
          icon='name'
          defaultValue={user.name}
          label='Name'
          placeholder='Your Name'
          error={errors.name?.message}
        />

        <Input
          {...register('username')}
          label='Username'
          icon='at'
          placeholder='your_username'
          error={errors.username?.message}
          description='Your unique username. Can only contain letters, numbers, and underscores.'
        />

        <Textarea
          {...register('bio')}
          label='Bio'
          placeholder='Tell us about yourself...'
          defaultValue={user.profile.bio}
          error={errors.bio?.message}
        />
        <div className='flex items-center justify-end gap-4'>
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
