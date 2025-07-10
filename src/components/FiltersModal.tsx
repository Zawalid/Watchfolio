import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryState, parseAsArrayOf, parseAsString, parseAsInteger } from 'nuqs';
import { FunnelX, Filter as FilterIcon, Film, Tv, Calendar, Star, Globe, Filter, MonitorCog } from 'lucide-react';
import { ModalBody } from '@heroui/modal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { Select, SelectItem } from '@heroui/select';
import { GENRES, NETWORKS } from '@/utils/constants/TMDB';
import { ShortcutKey, ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { getShortcut, type ShortcutName } from '@/utils/keyboardShortcuts';
import { cn } from '@/utils';
import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { Input } from '@/components/ui/Input';

export type FilterOption = 'genres' | 'networks' | 'types' | 'language' | 'ratingRange' | 'releaseYear';

interface FiltersModalProps {
  disclosure: Disclosure;
  filterOptions?: FilterOption[];
  title?: string;
}

const MEDIA_TYPES = [
  { id: 'movie', label: 'Movies', icon: Film, shortcut: 'filterMovies' },
  { id: 'tv', label: 'TV Shows', icon: Tv, shortcut: 'filterTvShows' },
  // { id: 'anime', label: 'Anime', icon: Clapperboard, shortcut: 'filterAnime' },
];

const POPULAR_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
];

export default function FiltersModal({
  disclosure,
  filterOptions = ['genres', 'networks', 'types'],
  title = 'Apply Filters',
}: FiltersModalProps) {
  const { isOpen, onClose, onOpen } = disclosure;

  // Common filters
  const [selectedGenres, setSelectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedNetworks, setSelectedNetworks] = useQueryState('networks', parseAsArrayOf(parseAsString));
  const [selectedTypes, setSelectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));

  // Media-specific filters
  const [language, setLanguage] = useQueryState('language', parseAsString);
  const [minRating, setMinRating] = useQueryState('min_rating', parseAsInteger);
  const [maxRating, setMaxRating] = useQueryState('max_rating', parseAsInteger);
  const [minYear, setMinYear] = useQueryState('min_year', parseAsInteger);
  const [maxYear, setMaxYear] = useQueryState('max_year', parseAsInteger);
  const [minVotes, setMinVotes] = useQueryState('min_votes', parseAsInteger);

  const hasFilters = Boolean(
    selectedGenres?.length ||
      selectedNetworks?.length ||
      selectedTypes?.length ||
      language ||
      minRating ||
      maxRating ||
      minYear ||
      maxYear ||
      minVotes
  );

  useHotkeys(getShortcut('toggleFilters')?.hotkey || '', () => (isOpen ? onClose() : onOpen()), [isOpen]);
  useHotkeys(getShortcut('escape')?.hotkey || '', onClose, { enabled: isOpen });

  useHotkeys(getShortcut('filterMovies')?.hotkey || '', () => toggleMediaType('movie'), [selectedTypes]);
  useHotkeys(getShortcut('filterTvShows')?.hotkey || '', () => toggleMediaType('tv'), [selectedTypes]);

  // Clear all filters with Alt+0
  useHotkeys(
    getShortcut('clearFilters')?.hotkey || '',
    () => {
      if (hasFilters) {
        clearAllFilters();
      }
    },
    [hasFilters]
  );

  const clearAllFilters = () => {
    setSelectedGenres(null);
    setSelectedNetworks(null);
    setSelectedTypes(null);
    setLanguage(null);
    setMinRating(null);
    setMaxRating(null);
    setMinYear(null);
    setMaxYear(null);
    setMinVotes(null);
  };

  const toggleGenre = (genreId: string) => {
    const currentGenres = selectedGenres || [];
    if (currentGenres.includes(genreId)) {
      setSelectedGenres(currentGenres.length > 1 ? currentGenres.filter((g) => g !== genreId) : null);
    } else {
      setSelectedGenres([...currentGenres, genreId]);
    }
  };

  const toggleNetwork = (network: string) => {
    const currentNetworks = selectedNetworks || [];
    if (currentNetworks.includes(network)) {
      setSelectedNetworks(currentNetworks.length > 1 ? currentNetworks.filter((p) => p !== network) : null);
    } else {
      setSelectedNetworks([...currentNetworks, network]);
    }
  };

  const toggleMediaType = (typeId: string) => {
    setSelectedTypes((selectedTypes) => {
      const currentTypes = selectedTypes || [];
      if (currentTypes.length && currentTypes.length === MEDIA_TYPES.length - 1) return null;
      return currentTypes.includes(typeId) ? currentTypes.filter((t) => t !== typeId) : [...currentTypes, typeId];
    });
  };

  const currentYear = new Date().getFullYear();

  const filterComponents = {
    genres: (
      <div className='space-y-3' key='genres'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-3 text-lg font-semibold text-white'>
            <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
              <Film className='text-Tertiary-400 h-4 w-4' />
            </div>
            Genre
          </h3>
          {selectedGenres?.length ? <ClearFilter onClear={() => setSelectedGenres(null)} /> : null}
        </div>
        <div className='flex flex-wrap gap-2'>
          {GENRES.map(({ id, label }) => (
            <Button
              key={id}
              className='selectable-button!'
              data-is-selected={selectedGenres?.includes(String(id)) || false}
              onPress={() => toggleGenre(String(id))}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    ),
    networks: (
      <div className='space-y-3' key='networks'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-3 text-lg font-semibold text-white'>
            <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
              <Tv className='text-Secondary-400 h-4 w-4' />
            </div>
            Network
          </h3>
          {selectedNetworks?.length ? <ClearFilter onClear={() => setSelectedNetworks(null)} /> : null}
        </div>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3'>
          {NETWORKS.slice(0, 12).map(({ id, name, logo, slug }) => (
            <Button
              key={id}
              className='selectable-button! h-28'
              data-is-selected={selectedNetworks?.includes(slug) || false}
              onPress={() => toggleNetwork(slug)}
            >
              {logo ? <img src={logo} alt={name} className='mr-1 inline-block max-h-24' loading='lazy' /> : name}
            </Button>
          ))}
        </div>
      </div>
    ),
    types: (
      <div className='space-y-3' key='types'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-3 text-lg font-semibold text-white'>
            <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
              <MonitorCog className='text-Tertiary-400 h-4 w-4' />
            </div>
            Type
          </h3>
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
    ),
    language: (
      <div className='space-y-3' key='language'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-3 text-lg font-semibold text-white'>
            <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
              <Globe className='text-Tertiary-400 h-4 w-4' />
            </div>
            Language
          </h3>
          {language ? <ClearFilter onClear={() => setLanguage(null)} /> : null}
        </div>
        <Select
          placeholder='Select language'
          selectedKeys={language ? [language] : []}
          onSelectionChange={(keys) => setLanguage((Array.from(keys)[0] as string) || null)}
          classNames={{ ...SELECT_CLASSNAMES, trigger: SELECT_CLASSNAMES.trigger + ' w-full' }}
        >
          {POPULAR_LANGUAGES.map((lang) => (
            <SelectItem key={lang.code}>{lang.name}</SelectItem>
          ))}
        </Select>
      </div>
    ),
    ratingRange: (
      <div className='space-y-3' key='ratingRange'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-3 text-lg font-semibold text-white'>
            <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
              <Star className='text-Tertiary-400 h-4 w-4' />
            </div>
            Rating Range
          </h3>
          {minRating || maxRating ? (
            <ClearFilter
              onClear={() => {
                setMinRating(null);
                setMaxRating(null);
              }}
            />
          ) : null}
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <Input
            name='minRating'
            type='number'
            min='0'
            max='10'
            step='0.1'
            value={minRating || ''}
            onChange={(e) => setMinRating(e.target.value ? parseFloat(e.target.value) : null)}
            label='Min Rating'
            placeholder='0.0'
          />
          <Input
            name='maxRating'
            type='number'
            min='0'
            max='10'
            step='0.1'
            value={maxRating || ''}
            onChange={(e) => setMaxRating(e.target.value ? parseFloat(e.target.value) : null)}
            label='Max Rating'
            placeholder='10.0'
          />
        </div>
      </div>
    ),
    releaseYear: (
      <div className='space-y-3' key='releaseYear'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-3 text-lg font-semibold text-white'>
            <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
              <Calendar className='text-Tertiary-400 h-4 w-4' />
            </div>
            Release Year
          </h3>
          {minYear || maxYear ? (
            <ClearFilter
              onClear={() => {
                setMinYear(null);
                setMaxYear(null);
              }}
            />
          ) : null}
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <Input
            name='minYear'
            type='number'
            min='1900'
            max={currentYear + 2}
            value={minYear || ''}
            onChange={(e) => setMinYear(e.target.value ? parseInt(e.target.value) : null)}
            label='From Year'
            placeholder='1900'
          />
          <Input
            name='maxYear'
            type='number'
            min='1900'
            max={currentYear + 2}
            value={maxYear || ''}
            onChange={(e) => setMaxYear(e.target.value ? parseInt(e.target.value) : null)}
            label='To Year'
            placeholder={String(currentYear + 2)}
          />
        </div>
      </div>
    ),
  };

  const renderedFilters = filterOptions.map((option) => filterComponents[option]).filter(Boolean);

  const hasActiveFilters = !!(
    selectedGenres?.length ||
    selectedNetworks?.length ||
    selectedTypes?.length ||
    language ||
    minRating ||
    maxRating ||
    minYear ||
    maxYear
  );

  return (
    <>
      <Tooltip content={<ShortcutTooltip shortcutName='toggleFilters' />} className='tooltip-secondary!'>
        <Button
          isIconOnly
          className={cn(
            'button-secondary! relative overflow-visible',
            hasActiveFilters && 'border-amber-500/50 shadow-sm shadow-amber-500/20'
          )}
          onPress={() => disclosure.onOpen()}
          aria-label='Show filters'
        >
          <Filter className={cn('size-4', hasActiveFilters && 'text-amber-400')} />
          {hasActiveFilters && (
            <div className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black/80'>
              {(selectedGenres?.length || 0) +
                (selectedNetworks?.length || 0) +
                (selectedTypes?.length || 0) +
                (language ? 1 : 0) +
                (minRating ? 1 : 0) +
                (maxRating ? 1 : 0) +
                (minYear ? 1 : 0) +
                (maxYear ? 1 : 0)}
            </div>
          )}
        </Button>
      </Tooltip>
      <Modal disclosure={disclosure} size='4xl'>
        <ModalBody className='space-y-6 p-6'>
          {/* Header */}
          <div className='flex items-center gap-3'>
            <div className='bg-Primary-500/20 rounded-lg p-2'>
              <FilterIcon className='text-Primary-400 size-5' />
            </div>
            <h2 className='text-Primary-50 text-xl font-semibold'>{title}</h2>
          </div>

          <div className='space-y-6'>{renderedFilters}</div>

          {/* Clear All Button */}
          {hasFilters && (
            <Button className='button-secondary! shrink-0' onPress={clearAllFilters}>
              Clear All Filters
            </Button>
          )}

          {/* Tips */}
          <div className='border-Primary-500/20 bg-Primary-500/10 rounded-lg border p-3'>
            <p className='text-Primary-300 text-xs'>
              <span className='font-medium'>Tip:</span> Press <ShortcutKey shortcutName='toggleFilters' /> to toggle
              filters, or <ShortcutKey shortcutName='clearFilters' /> to clear all filters
            </p>
          </div>
        </ModalBody>
      </Modal>
    </>
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
