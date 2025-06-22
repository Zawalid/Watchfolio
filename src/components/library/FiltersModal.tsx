import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { FunnelX, Filter as FilterIcon, Film, Tv, Clapperboard } from 'lucide-react';
import { ModalBody } from '@heroui/modal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { GENRES, PLATFORMS } from '@/lib/api/TMDB/values';
import { ShortcutKey } from '@/components/ui/ShortcutKey';
import { getShortcut, type ShortcutName } from '@/utils/keyboardShortcuts';

interface FiltersModalProps {
  disclosure: Disclosure;
}

const MEDIA_TYPES = [
  { id: 'movie', label: 'Movies', icon: Film, shortcut: 'filterMovies' },
  { id: 'tv', label: 'TV Shows', icon: Tv, shortcut: 'filterTvShows' },
  { id: 'anime', label: 'Anime', icon: Clapperboard, shortcut: 'filterAnime' },
];

export default function FiltersModal({ disclosure }: FiltersModalProps) {
  const { isOpen, onClose, onOpen } = disclosure;
  const [selectedGenres, setSelectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedPlatforms, setSelectedPlatforms] = useQueryState('platforms', parseAsArrayOf(parseAsString));
  const [selectedTypes, setSelectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));

  const hasFilters = Boolean(selectedGenres?.length || selectedPlatforms?.length || selectedTypes?.length);

  useHotkeys(getShortcut('toggleFilters').hotkey, () => (isOpen ? onClose() : onOpen()), [isOpen]);
  useHotkeys(getShortcut('escape').hotkey, onClose, { enabled: isOpen });

  useHotkeys(getShortcut('filterMovies').hotkey, () => toggleMediaType('movie'), [selectedTypes]);
  useHotkeys(getShortcut('filterTvShows').hotkey, () => toggleMediaType('tv'), [selectedTypes]);
  useHotkeys(getShortcut('filterAnime').hotkey, () => toggleMediaType('anime'), [selectedTypes]);

  // Clear all filters with Alt+0
  useHotkeys(
    getShortcut('clearFilters').hotkey,
    () => {
      if (hasFilters) {
        setSelectedGenres(null);
        setSelectedPlatforms(null);
        setSelectedTypes(null);
      }
    },
    [selectedGenres, selectedPlatforms, selectedTypes]
  );

  // Media type keyboard shortcuts

  const toggleGenre = (genreId: string) => {
    const currentGenres = selectedGenres || [];
    if (currentGenres.includes(genreId)) {
      setSelectedGenres(currentGenres.length > 1 ? currentGenres.filter((g) => g !== genreId) : null);
    } else {
      setSelectedGenres([...currentGenres, genreId]);
    }
  };

  const togglePlatform = (platformId: string) => {
    const currentPlatforms = selectedPlatforms || [];
    if (currentPlatforms.includes(platformId)) {
      setSelectedPlatforms(currentPlatforms.length > 1 ? currentPlatforms.filter((p) => p !== platformId) : null);
    } else {
      setSelectedPlatforms([...currentPlatforms, platformId]);
    }
  };

  const toggleMediaType = (typeId: string) => {
    const currentTypes = selectedTypes || [];
    if (currentTypes.includes(typeId)) {
      setSelectedTypes(currentTypes.length > 1 ? currentTypes.filter((t) => t !== typeId) : null);
    } else {
      setSelectedTypes([...currentTypes, typeId]);
    }
    // If all types are selected, clear selection
    if (currentTypes.length === MEDIA_TYPES.length) setSelectedTypes(null);
  };

  return (
    <Modal disclosure={disclosure} classNames={{ base: 'max-w-4xl' }}>
      <ModalBody className='space-y-6 p-6'>
        {/* Header */}
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <FilterIcon className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Apply Filters</h2>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {/* Genres */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-Primary-50 text-lg font-medium'>Genres</h3>
              {selectedGenres?.length ? <ClearFilter onClear={() => setSelectedGenres(null)} /> : null}
            </div>
            <div className='flex flex-wrap gap-2'>
              {Object.entries(GENRES).map(([id, label]) => {
                const isSelected = selectedGenres?.includes(label) || false;
                return (
                  <Button
                    key={id}
                    className='selectable-button!'
                    data-is-selected={isSelected}
                    onPress={() => toggleGenre(label)}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className='space-y-6'>
            {/* Streaming Platforms */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='text-Primary-50 text-lg font-medium'>Streaming Platforms</h3>
                {selectedPlatforms?.length ? <ClearFilter onClear={() => setSelectedPlatforms(null)} /> : null}
              </div>
              <div className='flex flex-wrap gap-2'>
                {PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatforms?.includes(platform.id) || false;
                  return (
                    <Button
                      key={platform.id}
                      className='selectable-button! size-28'
                      data-is-selected={isSelected}
                      onPress={() => togglePlatform(platform.id)}
                    >
                      {platform.logo ? (
                        <img src={platform.logo} alt={platform.label} className='mr-1 inline-block' loading='lazy' />
                      ) : (
                        platform.label
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Media Types */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='text-Primary-50 text-lg font-medium'>Types</h3>
                {selectedTypes?.length ? <ClearFilter onClear={() => setSelectedTypes(null)} /> : null}
              </div>
              <div className='flex flex-wrap gap-3'>
                {MEDIA_TYPES.map((type) => {
                  const isSelected = selectedTypes?.includes(type.id) || false;
                  const IconComponent = type.icon;
                  return (
                    <Button
                      key={type.id}
                      className='selectable-button!'
                      data-is-selected={isSelected}
                      onPress={() => toggleMediaType(type.id)}
                    >
                      <IconComponent className='size-4' />
                      {type.label}
                      <ShortcutKey shortcutName={type.shortcut as ShortcutName} className='kbd-sm! opacity-60' />
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {(selectedGenres?.length || selectedPlatforms?.length || selectedTypes?.length) && (
          <Button
            className='button-secondary!'
            onPress={() => {
              setSelectedGenres(null);
              setSelectedPlatforms(null);
              setSelectedTypes(null);
            }}
          >
            Clear All Filters
          </Button>
        )}

        <div className='border-Primary-500/20 bg-Primary-500/10 rounded-lg border p-3'>
          <p className='text-Primary-300 text-xs'>
            <span className='font-medium'>Tip:</span> Press <ShortcutKey shortcutName='toggleFilters' /> to toggle
            filters
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
}

const ClearFilter = ({ onClear }: { onClear: () => void }) => {
  return (
    <Tooltip content='Clear Filter' className='tooltip-secondary!'>
      <Button isIconOnly className='button-secondary!' onPress={onClear}>
        <FunnelX className='size-4' />
      </Button>
    </Tooltip>
  );
};
