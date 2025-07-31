import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@heroui/react';
import { Globe, Heart, Tv, Film, X } from 'lucide-react';
import { addToast } from '@heroui/react';
import { FAVORITE_GENRES_LIMIT, FAVORITE_NETWORKS_LIMIT } from '@/utils/constants';
import { GENRES, NETWORKS, CONTENT_PREFERENCES } from '@/utils/constants/TMDB';
import { cn } from '@/utils';
import { Slider } from '@/components/ui/Slider';
import NetworkCard from '@/pages/networks/NetworkCard';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

interface TasteEditorProps {
  favoriteContentType?: FavoriteContentType;
  selectedGenres?: number[];
  selectedContentPreferences?: string[];
  selectedNetworks?: number[];
  onContentTypeChange: (value: FavoriteContentType) => void;
  onGenreToggle: (id: number, clear?: boolean) => void;
  onContentPreferenceToggle: (preferenceCode: string, clear?: boolean) => void;
  onNetworkToggle: (id: number, clear?: boolean) => void;
  isAnimated?: boolean;
  showIcons?: boolean;
}

export default function TasteEditor({
  selectedGenres = [],
  selectedContentPreferences = [],
  selectedNetworks = [],
  favoriteContentType = 'both',
  onGenreToggle,
  onContentPreferenceToggle,
  onNetworkToggle,
  onContentTypeChange,
  isAnimated = false,
  showIcons = false,
}: TasteEditorProps) {
  const motionProps = isAnimated ? { variants: itemVariants, initial: 'hidden', animate: 'visible' } : {};

  const handleGenreToggle = (id: number) => {
    if (!selectedGenres.includes(id) && selectedGenres.length >= FAVORITE_GENRES_LIMIT) {
      addToast({
        title: 'Limit Reached',
        description: `You can only select up to ${FAVORITE_GENRES_LIMIT} genres.`,
        color: 'warning',
      });
      return;
    }
    onGenreToggle(id);
  };

  const handleNetworkToggle = (id: number) => {
    if (!selectedNetworks.includes(id) && selectedNetworks.length >= FAVORITE_NETWORKS_LIMIT) {
      addToast({
        title: 'Limit Reached',
        description: `You can only select up to ${FAVORITE_NETWORKS_LIMIT} networks.`,
        color: 'warning',
      });
      return;
    }
    onNetworkToggle(id);
  };

  return (
    <div className='space-y-8'>
      <motion.div {...motionProps} transition={{ delay: 0.2 }}>
        <div className='mb-4 space-y-1'>
          <h4 className='flex items-center gap-3 text-lg font-semibold text-white'>
            {showIcons && (
              <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
                <Film className='text-Primary-400 h-4 w-4' />
              </div>
            )}
            Content Type
          </h4>
          <p className='text-Grey-400 text-sm'>Do you prefer movies, TV shows, or both?</p>
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
              onPress={() => onContentTypeChange(option.value as FavoriteContentType)}
            >
              <option.icon className='mr-2 h-4 w-4' />
              {option.label}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div {...motionProps} transition={{ delay: 0.4 }}>
        <div className='mb-3 flex items-baseline justify-between'>
          <div className='flex items-center gap-3'>
            {showIcons && (
              <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
                <Heart className='text-Primary-400 h-4 w-4' />
              </div>
            )}
            <div>
              <h4 className='text-lg font-semibold text-white'>Favorite Genres</h4>
              <p className='text-Grey-400 text-sm'>Select your favorite genres.</p>
            </div>
          </div>
          <Count items={selectedGenres} limit={FAVORITE_GENRES_LIMIT} onClear={() => onGenreToggle(0, true)} />
        </div>
        <div className='flex flex-wrap gap-2'>
          {GENRES.map(({ id, label }) => (
            <Button
              key={id}
              className='selectable-button!'
              data-is-selected={selectedGenres.includes(id)}
              onPress={() => handleGenreToggle(id)}
            >
              {label}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div {...motionProps} transition={{ delay: 0.6 }}>
        <div className='mb-4 space-y-1'>
          <h4 className='flex items-center gap-3 text-lg font-semibold text-white'>
            {showIcons && (
              <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
                <Globe className='text-Primary-400 h-4 w-4' />
              </div>
            )}
            Content Preferences
          </h4>
          <p className='text-Grey-400 text-sm'>What type of content do you enjoy?</p>
        </div>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {CONTENT_PREFERENCES.map((preference) => (
            <Button
              key={preference.code}
              className='selectable-button! h-auto flex-col items-start gap-1 p-3 text-left'
              data-is-selected={selectedContentPreferences.includes(preference.code)}
              onPress={() => onContentPreferenceToggle(preference.code)}
            >
              <div className='text-sm font-medium text-white'>{preference.name}</div>
              <div className='text-Grey-400 text-xs'>{preference.description}</div>
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div {...motionProps} transition={{ delay: 0.8 }}>
        <div className='mb-3 flex items-baseline justify-between'>
          <div className='flex items-center gap-3'>
            {showIcons && (
              <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
                <Tv className='text-Primary-400 h-4 w-4' />
              </div>
            )}
            <div>
              <h4 className='text-lg font-semibold text-white'>Favorite Networks</h4>
              <p className='text-Grey-400 text-sm'>Select your go-to content creators.</p>
            </div>
          </div>
          <Count items={selectedNetworks} limit={FAVORITE_NETWORKS_LIMIT} onClear={() => onNetworkToggle(0, true)} />
        </div>
        <Slider>
          {NETWORKS.map((network) => (
            <Slider.Slide key={network.id} className='group w-32!'>
              <NetworkCard network={network} type='button' isSelected={selectedNetworks.includes(network.id)} onSelect={() => handleNetworkToggle(network.id)} />
            </Slider.Slide>
          ))}
        </Slider>
      </motion.div>
    </div>
  );
}

function Count({ items, limit, onClear }: { items: number[]; limit: number; onClear: () => void }) {
  return (
    <div className='flex items-center gap-1'>
      <div
        className={cn(
          'rounded-full px-2.5 py-1 text-xs font-medium ring-1 backdrop-blur-md transition-colors',
          items.length >= limit
            ? 'bg-amber-800/50 text-amber-300 ring-amber-500/30'
            : 'text-Grey-300 bg-white/10 ring-white/15'
        )}
      >
        {items.length} / {limit}
      </div>
      <AnimatePresence>
        {items.length > 0 && (
          <button
            type='button'
            onClick={onClear}
            className='text-Primary-400 hover:bg-Primary-400/20 hover:text-Primary-300 ml-1 rounded-full p-1 transition-colors'
            aria-label='Clear search'
          >
            <X className='size-4' />
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}
