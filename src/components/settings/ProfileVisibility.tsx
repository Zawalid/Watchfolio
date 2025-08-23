import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/react';
import { addToast } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { privacySchema } from '@/lib/validation/settings';
import { Switch } from '@/components/ui/Switch';
import { Check } from 'lucide-react';
import { cn } from '@/utils';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { SettingItem } from './SettingSection';
import { UpdateProfileInput } from '@/lib/appwrite/types';

type FormData = z.infer<typeof privacySchema>;
type SectionKey = z.infer<typeof privacySchema>['hiddenProfileSections'][number];

export default function ProfileVisibility() {
  const { user, updateUserProfile, isLoading } = useAuthStore();
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      visibility: user?.profile?.visibility ?? 'public',
      hiddenProfileSections: (user?.profile?.hiddenProfileSections as SectionKey[]) ?? [],
    },
  });

  const currentVisibility = watch('visibility');
  const hiddenProfileSections = watch('hiddenProfileSections');

  const handleSectionToggle = (sectionKey: SectionKey) => {
    const newhiddenProfileSections = hiddenProfileSections.includes(sectionKey)
      ? hiddenProfileSections.filter((key) => key !== sectionKey)
      : [...hiddenProfileSections, sectionKey];
    setValue('hiddenProfileSections', newhiddenProfileSections, { shouldDirty: true });
  };

  const onSubmit = async (data: FormData) => {
    if (!user || !isDirty) return;

    const finalData: FormData =
      data.visibility === 'private' ? { ...data, hiddenProfileSections: ['stats', 'taste', 'library'] } : data;
    try {
      await updateUserProfile(finalData as UpdateProfileInput);
      reset(finalData);
      addToast({
        title: 'Visibility Updated',
        description: 'Your profile settings have been saved.',
        color: 'success',
      });
    } catch (error) {
      console.log(error);
      addToast({ title: 'Update Failed', description: 'Could not update profile visibility.', color: 'danger' });
    }
  };

  if (!user) return null;

  const isStatsPublic = !hiddenProfileSections.includes('stats');
  const isLibraryPublic = !hiddenProfileSections.includes('library');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <SettingItem
        title='Public Profile'
        description='Allow others to see your profile and activity'
        isDisabled={isLoading}
      >
        <Switch
          checked={currentVisibility === 'public'}
          onChange={(e) => setValue('visibility', e.target.checked ? 'public' : 'private', { shouldDirty: true })}
          disabled={isLoading}
        />
      </SettingItem>

      <AnimatePresence>
        {currentVisibility === 'public' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='space-y-4'
          >
            <div>
              <h4 className='text-Grey-300 mb-2 text-sm font-medium'>Visible Profile Sections</h4>
              <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                <GranularControl isChecked={isStatsPublic} onToggle={() => handleSectionToggle('stats')}>
                  Stats & Insights
                </GranularControl>
                <GranularControl
                  isChecked={!hiddenProfileSections.includes('taste')}
                  onToggle={() => handleSectionToggle('taste')}
                >
                  Viewing Taste
                </GranularControl>
                <GranularControl isChecked={isLibraryPublic} onToggle={() => handleSectionToggle('library')}>
                  Full Library
                </GranularControl>
              </div>
            </div>

            <AnimatePresence>
              {isStatsPublic && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='bg-white/ space-y-3 rounded-lg border border-white/10 p-4'
                >
                  <h5 className='text-Grey-300 text-sm font-medium'>Visible Stats & Insights</h5>
                  <div className='grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3'>
                    {[
                      { label: 'Statistics', value: 'statistics' },
                      { label: 'Overview', value: 'overview' },
                      { label: 'Top Genres', value: 'topGenres' },
                      { label: 'Recent Activity', value: 'recentActivity' },
                    ].map((stat) => (
                      <GranularControl
                        key={stat.value}
                        isChecked={!hiddenProfileSections.includes(`stats.${stat.value}` as SectionKey)}
                        onToggle={() => handleSectionToggle(`stats.${stat.value}` as SectionKey)}
                      >
                        {stat.label}
                      </GranularControl>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isLibraryPublic && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='bg-white/ space-y-3 rounded-lg border border-white/10 p-4'
                >
                  <h5 className='text-Grey-300 text-sm font-medium'>Visible Library Statuses</h5>
                  <div className='grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3'>
                    {LIBRARY_MEDIA_STATUS.map((status) => (
                      <GranularControl
                        key={status.value}
                        isChecked={!hiddenProfileSections.includes(`library.${status.value}` as SectionKey)}
                        onToggle={() => handleSectionToggle(`library.${status.value}` as SectionKey)}
                      >
                        {status.label}
                      </GranularControl>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

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
                Save Changes
              </Button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </form>
  );
}

function GranularControl({
  children,
  isChecked,
  onToggle,
}: {
  children: ReactNode;
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={cn(
        'group flex w-full items-center justify-between rounded-lg p-2.5 text-left transition-colors',
        isChecked ? 'bg-Primary-500/10' : 'bg-white/[0.03] hover:bg-white/10'
      )}
    >
      <span className={cn('text-sm font-medium', isChecked ? 'text-Primary-300' : 'text-Grey-300')}>{children}</span>
      <div
        className={cn(
          'flex size-5 items-center justify-center rounded-full border-2 transition-all',
          isChecked ? 'border-Primary-500 bg-Primary-500' : 'border-Grey-600 group-hover:border-Grey-400'
        )}
      >
        {isChecked && <Check className='size-3 text-white' />}
      </div>
    </button>
  );
}
