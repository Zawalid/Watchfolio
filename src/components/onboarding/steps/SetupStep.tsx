import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/useAuthStore';
import TasteEditor from '@/components/settings/TasteEditor';
import { useState, useEffect } from 'react';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function SetupStep() {
  const { updateUserProfile, isAuthenticated, user } = useAuthStore();
  const [preferences, setPreferences] = useState({
    favoriteContentType: user?.profile?.favoriteContentType || 'both',
    selectedGenres: user?.profile?.favoriteGenres || [],
    selectedContentPreferences: user?.profile?.contentPreferences || [],
    selectedNetworks: user?.profile?.favoriteNetworks || [],
  });

  const toggleGenre = (id: number) => {
    setPreferences((prev) => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(id)
        ? prev.selectedGenres.filter((g) => g !== id)
        : [...prev.selectedGenres, id],
    }));
  };

  const toggleContentPreference = (preferenceCode: string) => {
    setPreferences((prev) => ({
      ...prev,
      selectedContentPreferences: prev.selectedContentPreferences.includes(preferenceCode)
        ? prev.selectedContentPreferences.filter((p) => p !== preferenceCode)
        : [...prev.selectedContentPreferences, preferenceCode],
    }));
  };

  const toggleNetwork = (id: number) => {
    setPreferences((prev) => ({
      ...prev,
      selectedNetworks: prev.selectedNetworks.includes(id)
        ? prev.selectedNetworks.filter((s) => s !== id)
        : [...prev.selectedNetworks, id],
    }));
  };

  const handleContentTypeChange = (value: FavoriteContentType) => {
    setPreferences((prev) => ({ ...prev, favoriteContentType: value }));
  };

  // Save preferences when component unmounts or when user completes
  const savePreferences = async () => {
    if (!isAuthenticated) return;
    try {
      await updateUserProfile({
        favoriteContentType: preferences.favoriteContentType,
        favoriteGenres: preferences.selectedGenres,
        favoriteNetworks: preferences.selectedNetworks,
        contentPreferences: preferences.selectedContentPreferences,
      });
    } catch (error) {
      log('ERR', 'Failed to save preferences:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    return () => {
      savePreferences();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences, isAuthenticated]);

  return (
    <div className='mobile:space-y-8 mx-auto max-w-4xl space-y-6'>
      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        className='mobile:space-y-4 space-y-3 text-center'
      >
        <h2 className='mobile:text-2xl text-xl leading-tight font-black text-white sm:text-3xl'>
          Tell Us About Your
          <span className='gradient-text'> Entertainment Taste</span>
        </h2>
        <p className='text-Grey-300 mobile:text-lg mx-auto max-w-2xl text-base leading-relaxed'>
          Share your preferences so we can recommend content that matches your taste. You can change these anytime.
        </p>
      </motion.div>

      <TasteEditor
        favoriteContentType={preferences.favoriteContentType}
        selectedGenres={preferences.selectedGenres}
        selectedNetworks={preferences.selectedNetworks}
        selectedContentPreferences={preferences.selectedContentPreferences}
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
