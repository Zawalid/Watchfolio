import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { Globe, Heart, Tv, Film } from 'lucide-react';
import { CONTENT_PREFERENCES } from '@/utils/constants';
import { GENRES, NETWORKS } from '@/utils/constants/TMDB';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { cn } from '@/utils';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function SetupStep() {
  const { preferences, updatePreferences } = useOnboardingStore();
  const { selectedGenres, selectedContentPreferences, selectedNetworks, favoriteContentType } = preferences;

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    updatePreferences({ selectedGenres: newGenres });
  };

  const toggleContentPreference = (preferenceCode: string) => {
    const newPreferences = selectedContentPreferences.includes(preferenceCode)
      ? selectedContentPreferences.filter((p) => p !== preferenceCode)
      : [...selectedContentPreferences, preferenceCode];
    updatePreferences({ selectedContentPreferences: newPreferences });
  };

  const toggleNetwork = (id: number) => {
    const newNetworks = selectedNetworks.includes(id)
      ? selectedNetworks.filter((s) => s !== id)
      : [...selectedNetworks, id];
    updatePreferences({ selectedNetworks: newNetworks });
  };

  return (
    <div className='mx-auto max-w-4xl space-y-8'>
      {/* Header */}
      <motion.div variants={itemVariants} initial='hidden' animate='visible' className='space-y-4 text-center'>
        <h2 className='text-2xl leading-tight font-black text-white sm:text-3xl'>
          Tell Us About Your
          <span className='gradient-text'>Entertainment Taste</span>
        </h2>
        <p className='text-Grey-300 mx-auto max-w-2xl text-lg leading-relaxed'>
          Share your preferences so we can recommend content that matches your taste. You can change these anytime.
        </p>
      </motion.div>

      <div className='space-y-8'>
        {/* Media Preference */}
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.2 }}
          className='space-y-4'
        >
          <div className='space-y-1'>
            <h3 className='flex items-center gap-3 text-xl font-bold text-white'>
              <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
                <Film className='text-Primary-400 h-4 w-4' />
              </div>
              Content Type
            </h3>
            <p className='text-Grey-400 text-sm'>Movies, TV shows, or both?</p>
          </div>

          <div className='flex gap-3'>
            {[
              { value: 'movies', label: 'Movies Only', icon: Film },
              { value: 'tv', label: 'TV Shows Only', icon: Tv },
              { value: 'both', label: 'Both', icon: Heart },
            ].map((option) => (
              <Button
                key={option.value}
                className='selectable-button! flex-1'
                data-is-selected={favoriteContentType === option.value}
                onPress={() => updatePreferences({ favoriteContentType: option.value as 'movies' | 'tv' | 'both' })}
              >
                <div className='flex items-center gap-2'>
                  <option.icon className='h-4 w-4' />
                  {option.label}
                </div>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Favorite Genres */}
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.4 }}
          className='space-y-4'
        >
          <div className='space-y-1'>
            <h3 className='flex items-center gap-3 text-xl font-bold text-white'>
              <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
                <Heart className='text-Tertiary-400 h-4 w-4' />
              </div>
              Favorite Genres
            </h3>
            <p className='text-Grey-400 text-sm'>Pick your favorites</p>
          </div>

          <div className='flex flex-wrap gap-2'>
            {GENRES.map(({ id, label }) => (
              <Button
                key={id}
                className='selectable-button!'
                data-is-selected={selectedGenres?.includes(label) || false}
                onPress={() => toggleGenre(label)}
              >
                {label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Content Preferences */}
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.6 }}
          className='space-y-4'
        >
          <div className='space-y-1'>
            <h3 className='flex items-center gap-3 text-xl font-bold text-white'>
              <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
                <Globe className='text-Primary-400 h-4 w-4' />
              </div>
              Content Preferences
            </h3>
            <p className='text-Grey-400 text-sm'>What type of content do you enjoy?</p>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {CONTENT_PREFERENCES.map((preference) => (
              <Button
                key={preference.code}
                className='selectable-button! fle h-auto flex-col gap-1 p-3'
                data-is-selected={selectedContentPreferences.includes(preference.code)}
                onPress={() => toggleContentPreference(preference.code)}
              >
                <div className='text-sm font-semibold text-white'>{preference.name}</div>
                <div className='text-Grey-400 text-xs'>{preference.description}</div>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Favorite Networks */}
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.8 }}
          className='space-y-4'
        >
          <div className='space-y-1'>
            <h3 className='flex items-center gap-3 text-xl font-bold text-white'>
              <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
                <Tv className='text-Secondary-400 h-4 w-4' />
              </div>
              Favorite Networks
            </h3>
            <p className='text-Grey-400 text-sm'>Select your go-to content creators</p>
          </div>

          <div className='grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3'>
            {NETWORKS.slice(0, 12).map((network) => (
              <Button
                key={network.id}
                className='selectable-button! group h-28'
                data-is-selected={selectedNetworks.includes(network.id)}
                onPress={() => toggleNetwork(network.id)}
              >
                {network.logo ? (
                  <img
                    src={network.logo}
                    alt={network.name}
                    className={cn(
                      'max-h-20 object-contain transition-all duration-300 group-hover:scale-105',
                      network.invertOnHover && 'group-hover:invert'
                    )}
                    loading='lazy'
                  />
                ) : (
                  network.name
                )}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
