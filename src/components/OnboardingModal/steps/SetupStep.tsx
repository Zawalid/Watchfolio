import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { Settings, Globe, Heart, Tv } from 'lucide-react';
import { GENRES, NETWORKS, REGIONS } from '@/lib/api/TMDB/values';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function SetupStep() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('US');
  const [selectedNetworks, setSelectedNetworks] = useState<number[]>([]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]));
  };

  const toggleNetwork = (id: number) => {
    setSelectedNetworks((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <div className='mx-auto max-w-4xl space-y-8'>
      <motion.div variants={itemVariants} initial='hidden' animate='visible' className='space-y-4 text-center'>
        <div className='border-Secondary-500/30 bg-Secondary-500/10 text-Secondary-300 mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-sm'>
          <Settings className='h-4 w-4' />
          <span>Customize Your Experience</span>
        </div>

        <h2 className='text-3xl font-black text-white'>
          Let's Personalize
          <span className='from-Secondary-400 to-Tertiary-400 block bg-gradient-to-r bg-clip-text text-transparent'>
            Your Watchfolio
          </span>
        </h2>
        <p className='text-Grey-400 mx-auto max-w-2xl text-lg leading-relaxed'>
          Help us tailor recommendations and content to your preferences. You can always change these later.
        </p>
      </motion.div>

      <div className='space-y-8'>
        {/* Favorite Genres */}
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.2 }}
          className='space-y-4'
        >
          <div className='flex items-center gap-3'>
            <div className='from-Primary-500 to-Secondary-500 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br'>
              <Heart className='h-5 w-5 text-white' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-white'>Favorite Genres</h3>
              <p className='text-Grey-400 text-sm'>Choose genres you enjoy (select 3-5 for best results)</p>
            </div>
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

        {/* Preferred Region */}
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.4 }}
          className='space-y-4'
        >
          <div className='flex items-center gap-3'>
            <div className='from-Secondary-500 to-Tertiary-500 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br'>
              <Globe className='h-5 w-5 text-white' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-white'>Favorite Regions</h3>
              <p className='text-Grey-400 text-sm'>Select your region for localized content and availability</p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5'>
            {REGIONS.map((region) => (
              <Button
                key={region.code}
                className='selectable-button! h-auto'
                data-is-selected={selectedRegion === region.code}
                onPress={() => setSelectedRegion(region.code)}
              >
                <div className='flex flex-col items-center gap-1.5'>
                  <img
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${region.code}.svg`}
                    alt={region.code}
                    className='size-5 rounded-sm'
                  />
                  <div className='text-xs font-medium'>{region.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Streaming Networks */}
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.6 }}
          className='space-y-4'
        >
          <div className='flex items-center gap-3'>
            <div className='from-Tertiary-500 to-Warning-500 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br'>
              <Tv className='h-5 w-5 text-white' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-white'>Favorite Networks</h3>
              <p className='text-Grey-400 text-sm'>Select networks you have access to (optional)</p>
            </div>
          </div>

          <div className='grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3'>
            {NETWORKS.slice(0, 12).map((network) => (
              <Button
                key={network.id}
                className='selectable-button! h-28'
                data-is-selected={selectedNetworks.includes(network.id)}
                onPress={() => toggleNetwork(network.id)}
              >
                {network.logo ? (
                  <img src={network.logo} alt={network.name} className='mr-1 max-h-24 inline-block' loading='lazy' />
                ) : (
                  network.name
                )}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.8 }}
        className='pt-4 text-center'
      >
        <p className='text-Grey-400 text-sm'>
          Don't worry, you can always adjust these preferences later in your settings.
        </p>
      </motion.div>
    </div>
  );
}
