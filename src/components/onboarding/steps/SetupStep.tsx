import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import TasteEditor from '@/components/settings/TasteEditor';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function SetupStep() {
  const { preferences, updatePreferences } = useOnboardingStore();
  const { selectedGenres, selectedContentPreferences, selectedNetworks, favoriteContentType } = preferences;

  const toggleGenre = (id: number) => {
    updatePreferences({
      selectedGenres: selectedGenres.includes(id) ? selectedGenres.filter((g) => g !== id) : [...selectedGenres, id],
    });
  };

  const toggleContentPreference = (preferenceCode: string) => {
    updatePreferences({
      selectedContentPreferences: selectedContentPreferences.includes(preferenceCode)
        ? selectedContentPreferences.filter((p) => p !== preferenceCode)
        : [...selectedContentPreferences, preferenceCode],
    });
  };

  const toggleNetwork = (id: number) => {
    updatePreferences({
      selectedNetworks: selectedNetworks.includes(id)
        ? selectedNetworks.filter((s) => s !== id)
        : [...selectedNetworks, id],
    });
  };

  const handleContentTypeChange = (value: FavoriteContentType) => {
    updatePreferences({ favoriteContentType: value });
  };

  return (
    <div className='mx-auto max-w-4xl space-y-8'>
      <motion.div variants={itemVariants} initial='hidden' animate='visible' className='space-y-4 text-center'>
        <h2 className='text-2xl leading-tight font-black text-white sm:text-3xl'>
          Tell Us About Your
          <span className='gradient-text'> Entertainment Taste</span>
        </h2>
        <p className='text-Grey-300 mx-auto max-w-2xl text-lg leading-relaxed'>
          Share your preferences so we can recommend content that matches your taste. You can change these anytime.
        </p>
      </motion.div>

      <TasteEditor
        favoriteContentType={favoriteContentType}
        selectedGenres={selectedGenres}
        selectedNetworks={selectedNetworks}
        selectedContentPreferences={selectedContentPreferences}
        onContentTypeChange={handleContentTypeChange}
        onGenreToggle={toggleGenre}
        onNetworkToggle={toggleNetwork}
        onContentPreferenceToggle={toggleContentPreference}
        isAnimated={true}
        showIcons={true}
      />
    </div>
  );
}
