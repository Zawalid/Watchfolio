import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { FunnelX, Filter as FilterIcon, Film, Tv } from 'lucide-react';
import { ModalBody } from '@heroui/modal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { GENRES, NETWORKS } from '@/lib/api/TMDB/values';
import { ShortcutKey } from '@/components/ui/ShortcutKey';
import { getShortcut, type ShortcutName } from '@/utils/keyboardShortcuts';

interface FiltersModalProps {
  disclosure: Disclosure;
}

const MEDIA_TYPES = [
  { id: 'movie', label: 'Movies', icon: Film, shortcut: 'filterMovies' },
  { id: 'tv', label: 'TV Shows', icon: Tv, shortcut: 'filterTvShows' },
  // { id: 'anime', label: 'Anime', icon: Clapperboard, shortcut: 'filterAnime' },
];

export default function FiltersModal({ disclosure }: FiltersModalProps) {
  const { isOpen, onClose, onOpen } = disclosure;
  const [selectedGenres, setSelectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedNetworks, setSelectedNetworks] = useQueryState('networks', parseAsArrayOf(parseAsString));
  const [selectedTypes, setSelectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));

  const hasFilters = Boolean(selectedGenres?.length || selectedNetworks?.length || selectedTypes?.length);

  useHotkeys(getShortcut('toggleFilters')?.hotkey || '', () => (isOpen ? onClose() : onOpen()), [isOpen]);
  useHotkeys(getShortcut('escape')?.hotkey || '', onClose, { enabled: isOpen });

  useHotkeys(getShortcut('filterMovies')?.hotkey || '', () => toggleMediaType('movie'), [selectedTypes]);
  useHotkeys(getShortcut('filterTvShows')?.hotkey || '', () => toggleMediaType('tv'), [selectedTypes]);
  // useHotkeys(getShortcut('filterAnime')?.hotkey || '', () => toggleMediaType('anime'), [selectedTypes]);

  // Clear all filters with Alt+0
  useHotkeys(
    getShortcut('clearFilters')?.hotkey || '',
    () => {
      if (hasFilters) {
        setSelectedGenres(null);
        setSelectedNetworks(null);
        setSelectedTypes(null);
      }
    },
    [selectedGenres, selectedNetworks, selectedTypes]
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

  const togglePlatform = (platform: string) => {
    const currentNetworks = selectedNetworks || [];
    if (currentNetworks.includes(platform)) {
      setSelectedNetworks(currentNetworks.length > 1 ? currentNetworks.filter((p) => p !== platform) : null);
    } else {
      setSelectedNetworks([...currentNetworks, platform]);
    }
  };

  const toggleMediaType = (typeId: string) => {
    setSelectedTypes((selectedTypes) => {
      const currentTypes = selectedTypes || [];
      if (currentTypes.length && currentTypes.length === MEDIA_TYPES.length - 1) return null;
      return currentTypes.includes(typeId) ? currentTypes.filter((t) => t !== typeId) : [...currentTypes, typeId];
    });
  };

  return (
    <Modal disclosure={disclosure} size='4xl'>
      <ModalBody className='space-y-6 p-6'>
        {/* Header */}
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <FilterIcon className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Apply Filters</h2>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-'>
          {/* Genres */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-Primary-50 text-lg font-medium'>Genres</h3>
              {selectedGenres?.length ? <ClearFilter onClear={() => setSelectedGenres(null)} /> : null}
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
          </div>

          {/* Media Types */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-Primary-50 text-lg font-medium'>Types</h3>
              {selectedTypes?.length ? <ClearFilter onClear={() => setSelectedTypes(null)} /> : null}
            </div>
            <div className='flex flex-wrap gap-3'>
              {MEDIA_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.id}
                    className='selectable-button!'
                    data-is-selected={selectedTypes?.includes(type.id) || false}
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

          {/* Networks */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-Primary-50 text-lg font-medium'>Networks</h3>
              {selectedNetworks?.length ? <ClearFilter onClear={() => setSelectedNetworks(null)} /> : null}
            </div>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3'>
              {NETWORKS.slice(0, 12).map(({ id, name, logo, slug }) => (
                <Button
                  key={id}
                  className='selectable-button! h-28'
                  data-is-selected={selectedNetworks?.includes(slug) || false}
                  onPress={() => togglePlatform(slug)}
                >
                  {logo ? <img src={logo} alt={name} className='mr-1 inline-block' loading='lazy' /> : name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {(selectedGenres?.length || selectedNetworks?.length || selectedTypes?.length) && (
          <Button
            className='button-secondary! shrink-0'
            onPress={() => {
              setSelectedGenres(null);
              setSelectedNetworks(null);
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
