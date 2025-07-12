import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
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
import { useNavigation } from '@/contexts/NavigationContext';
import { useFilters } from '@/hooks/useFilters';

export type FilterOption = 'genres' | 'networks' | 'types' | 'language' | 'ratingRange' | 'releaseYear';

interface FiltersModalProps {
  disclosure: Disclosure;
  filterOptions?: FilterOption[];
  title?: string;
}

const MEDIA_TYPES = [
  { id: 'movie', label: 'Movies', icon: Film, shortcut: 'filterMovies' },
  { id: 'tv', label: 'TV Shows', icon: Tv, shortcut: 'filterTvShows' },
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
  const { registerNavigator, unregisterNavigator } = useNavigation();

  const { selectedTypes, setSelectedTypes, numberOfFilters, hasFilters, clearAllFilters } = useFilters();

  useHotkeys(getShortcut('toggleFilters')?.hotkey || '', () => (isOpen ? onClose() : onOpen()), [isOpen]);
  useHotkeys(getShortcut('escape')?.hotkey || '', onClose, { enabled: isOpen });
  useHotkeys(getShortcut('filterMovies')?.hotkey || '', () => toggleMediaType('movie'), [selectedTypes]);
  useHotkeys(getShortcut('filterTvShows')?.hotkey || '', () => toggleMediaType('tv'), [selectedTypes]);
  useHotkeys(
    getShortcut('clearFilters')?.hotkey || '',
    () => {
      if (hasFilters) clearAllFilters();
    },
    [hasFilters]
  );

  useEffect(() => {
    if (isOpen) registerNavigator('filter-modal');
    return () => unregisterNavigator('filter-modal');
  }, [isOpen, registerNavigator, unregisterNavigator]);

  const toggleMediaType = (typeId: string) => {
    setSelectedTypes((types) => {
      const current = types || [];
      if (current.length && current.length === MEDIA_TYPES.length - 1) return null;
      return current.includes(typeId) ? current.filter((t) => t !== typeId) : [...current, typeId];
    });
  };

  const renderedFilters = filterOptions.map((option) => {
    if (option === 'genres') return <GenresFilter key='genres' />;
    if (option === 'networks') return <NetworksFilter key='networks' />;
    if (option === 'types') return <TypesFilter key='types' />;
    if (option === 'language') return <LanguageFilter key='language' />;
    if (option === 'ratingRange') return <RatingRangeFilter key='ratingRange' />;
    if (option === 'releaseYear') return <ReleaseYearFilter key='releaseYear' />;
    return null;
  });

  return (
    <>
      <Tooltip content={<ShortcutTooltip shortcutName='toggleFilters' />} className='tooltip-secondary!'>
        <Button
          isIconOnly
          className={cn(
            'button-secondary! relative overflow-visible',
            hasFilters && 'border-amber-500/50 shadow-sm shadow-amber-500/20'
          )}
          onPress={onOpen}
          aria-label='Show filters'
        >
          <Filter className={cn('size-4', hasFilters && 'text-amber-400')} />
          {hasFilters && (
            <div className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black/80'>
              {numberOfFilters}
            </div>
          )}
        </Button>
      </Tooltip>
      <Modal disclosure={disclosure} size='4xl'>
        <ModalBody className='space-y-6 p-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-Primary-500/20 rounded-lg p-2'>
              <FilterIcon className='text-Primary-400 size-5' />
            </div>
            <h2 className='text-Primary-50 text-xl font-semibold'>{title}</h2>
          </div>
          <div className='space-y-6'>{renderedFilters}</div>
          {hasFilters && (
            <Button className='button-secondary! shrink-0' onPress={clearAllFilters}>
              Clear All Filters
            </Button>
          )}
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

function GenresFilter() {
  const { selectedGenres, setSelectedGenres } = useFilters();
  const toggle = (slug: string) => {
    const list = selectedGenres || [];
    if (list.includes(slug)) {
      setSelectedGenres(list.length > 1 ? list.filter((g) => g !== slug) : null);
    } else {
      setSelectedGenres([...list, slug]);
    }
  };
  return (
    <div className='space-y-3'>
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
        {GENRES.map(({ id, label, slug }) => (
          <Button
            key={id}
            className='selectable-button!'
            data-is-selected={selectedGenres?.includes(slug) || false}
            onPress={() => toggle(slug)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function NetworksFilter() {
  const { selectedNetworks, setSelectedNetworks } = useFilters();
  const toggle = (slug: string) => {
    const list = selectedNetworks || [];
    if (list.includes(slug)) {
      setSelectedNetworks(list.length > 1 ? list.filter((n) => n !== slug) : null);
    } else {
      setSelectedNetworks([...list, slug]);
    }
  };
  return (
    <div className='space-y-3'>
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
            onPress={() => toggle(slug)}
          >
            {logo ? <img src={logo} alt={name} className='mr-1 inline-block max-h-24' loading='lazy' /> : name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function TypesFilter() {
  const [selectedTypes, setSelectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));
  const toggle = (id: string) => {
    setSelectedTypes((types) => {
      const list = types || [];
      if (list.length && list.length === MEDIA_TYPES.length - 1) return null;
      return list.includes(id) ? list.filter((t) => t !== id) : [...list, id];
    });
  };
  return (
    <div className='space-y-3'>
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
        {MEDIA_TYPES.map(({ id, label, icon: Icon, shortcut }) => (
          <Button
            key={id}
            className='selectable-button!'
            data-is-selected={selectedTypes?.includes(id) || false}
            onPress={() => toggle(id)}
          >
            <Icon className='size-4' />
            {label}
            <ShortcutKey shortcutName={shortcut as ShortcutName} className='kbd-sm! opacity-60' />
          </Button>
        ))}
      </div>
    </div>
  );
}

function LanguageFilter() {
  const { language, setLanguage } = useFilters();
  return (
    <div className='space-y-3'>
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
        {POPULAR_LANGUAGES.map(({ code, name }) => (
          <SelectItem key={code}>{name}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

function RatingRangeFilter() {
  const { minRating, maxRating, setMinRating, setMaxRating } = useFilters();

  let minError: string | null = null;
  let maxError: string | null = null;

  if (minRating != null) {
    if (minRating < 0 || minRating > 10) minError = 'Min rating must be between 0 and 10';
    else if (maxRating != null && minRating > maxRating) minError = 'Min rating cannot be greater than max rating';
  }

  if (maxRating != null) {
    if (maxRating < 0 || maxRating > 10) maxError = 'Max rating must be between 0 and 10';
    else if (minRating != null && maxRating < minRating) maxError = 'Max rating cannot be less than min rating';
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='flex items-center gap-3 text-lg font-semibold text-white'>
          <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
            <Star className='text-Tertiary-400 h-4 w-4' />
          </div>
          Rating Range
        </h3>
        {(minRating || maxRating) && (
          <ClearFilter
            onClear={() => {
              setMinRating(null);
              setMaxRating(null);
            }}
          />
        )}
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <Input
          name='minRating'
          type='number'
          min='0'
          max='10'
          step='0.1'
          value={minRating ?? ''}
          onChange={(e) => setMinRating(e.target.value ? parseFloat(e.target.value) : null)}
          label='Min Rating'
          placeholder='0.0'
          error={minError}
        />
        <Input
          name='maxRating'
          type='number'
          min='0'
          max='10'
          step='0.1'
          value={maxRating ?? ''}
          onChange={(e) => setMaxRating(e.target.value ? parseFloat(e.target.value) : null)}
          label='Max Rating'
          placeholder='10.0'
          error={maxError}
        />
      </div>
    </div>
  );
}

function ReleaseYearFilter() {
  const currentYear = new Date().getFullYear();
  const { minYear, maxYear, setMinYear, setMaxYear } = useFilters();

  let minError: string | null = null;
  let maxError: string | null = null;

  if (minYear != null) {
    if (minYear < 1900 || minYear > currentYear + 2) minError = `Min year must be between 1900 and ${currentYear + 2}`;
    else if (maxYear != null && minYear > maxYear) minError = 'From year cannot be after To year';
  }

  if (maxYear != null) {
    if (maxYear < 1900 || maxYear > currentYear + 2) maxError = `Max year must be between 1900 and ${currentYear + 2}`;
    else if (minYear != null && maxYear < minYear) maxError = 'To year cannot be before From year';
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='flex items-center gap-3 text-lg font-semibold text-white'>
          <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
            <Calendar className='text-Tertiary-400 h-4 w-4' />
          </div>
          Release Year
        </h3>
        {(minYear || maxYear) && (
          <ClearFilter
            onClear={() => {
              setMinYear(null);
              setMaxYear(null);
            }}
          />
        )}
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <Input
          name='minYear'
          type='number'
          min='1900'
          max={currentYear + 2}
          value={minYear ?? ''}
          onChange={(e) => setMinYear(e.target.value ? parseInt(e.target.value) : null)}
          label='From Year'
          placeholder='1900'
          error={minError}
        />
        <Input
          name='maxYear'
          type='number'
          min='1900'
          max={currentYear + 2}
          value={maxYear ?? ''}
          onChange={(e) => setMaxYear(e.target.value ? parseInt(e.target.value) : null)}
          label='To Year'
          placeholder={String(currentYear + 2)}
          error={maxError}
        />
      </div>
    </div>
  );
}

function ClearFilter({ onClear }: { onClear: () => void }) {
  return (
    <Tooltip content='Clear Filter' className='tooltip-secondary!'>
      <Button isIconOnly className='button-secondary!' onPress={onClear}>
        <FunnelX className='size-4' />
      </Button>
    </Tooltip>
  );
}
