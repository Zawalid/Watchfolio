import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@heroui/react';
import { addToast } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import TasteEditor from './TasteEditor';
import { viewingTasteSchema } from '@/lib/validation/settings';

type FormData = z.infer<typeof viewingTasteSchema>;

export default function ViewingTaste({ onSuccess }: { onSuccess?: () => void }) {
  const { user, updateUserProfile, isLoading } = useAuthStore();

  const {
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(viewingTasteSchema),
    defaultValues: {
      favoriteContentType: user?.profile?.favoriteContentType || 'both',
      favoriteGenres: user?.profile?.favoriteGenres || [],
      favoriteNetworks: user?.profile?.favoriteNetworks || [],
      contentPreferences: user?.profile?.contentPreferences || [],
    },
  });
  const values = watch();

  const genres = values.favoriteGenres;
  const networks = values.favoriteNetworks;
  const preferences = values.contentPreferences;

  const onSubmit = async (data: FormData) => {
    if (!isDirty || !user) return;
    try {
      await updateUserProfile(data);
      reset(data);
      addToast({
        title: 'Preferences Saved',
        description: 'Your viewing taste has been updated.',
        color: 'success',
      });
      onSuccess?.();
    } catch (error) {
      log("ERR",error);
      addToast({
        title: 'Save Failed',
        description: 'Could not update your preferences. Please try again.',
        color: 'danger',
      });
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 overflow-hidden'>
      <TasteEditor
        favoriteContentType={values.favoriteContentType}
        selectedGenres={genres}
        selectedContentPreferences={preferences}
        selectedNetworks={networks}
        onContentTypeChange={(type) => setValue('favoriteContentType', type, { shouldDirty: true })}
        onGenreToggle={(genre, clear) => {
          const newGenres = clear
            ? []
            : genres.includes(genre)
              ? genres.filter((g) => g !== genre)
              : [...genres, genre];
          setValue('favoriteGenres', newGenres, { shouldDirty: true });
        }}
        onContentPreferenceToggle={(preference) =>
          setValue(
            'contentPreferences',
            preferences.includes(preference)
              ? preferences.filter((p) => p !== preference)
              : [...preferences, preference],
            { shouldDirty: true }
          )
        }
        onNetworkToggle={(network, clear) => {
          const newNetworks = clear
            ? []
            : networks.includes(network)
              ? networks.filter((g) => g !== network)
              : [...networks, network];
          setValue('favoriteNetworks', newNetworks, { shouldDirty: true });
        }}
      />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='flex items-center justify-end gap-4'
        >
          {isDirty && (
            <>
              <Button className='bg-Grey-800 hover:bg-Grey-700' onPress={() => reset()}>
                Cancel
              </Button>
              <Button color='primary' type='submit' isLoading={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
