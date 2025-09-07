import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  FunnelX,
  Filter as FilterIcon,
  Film,
  Tv,
  Calendar,
  Star,
  Globe,
  Filter,
  MonitorCog,
  Check,
} from 'lucide-react';
import { ModalBody } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@heroui/react';
import { Tooltip } from '@heroui/react';
import { Select, SelectItem } from '@heroui/react';
import { GENRES, NETWORKS } from '@/utils/constants/TMDB';
import { ShortcutKey, ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { getShortcut, type ShortcutName } from '@/utils/keyboardShortcuts';
import { cn } from '@/utils';
import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { Input } from '@/components/ui/Input';
import { useNavigation } from '@/contexts/NavigationContext';
import { useFiltersParams } from '@/hooks/useFiltersParams';
import { Slider } from './ui/Slider';
import NetworkCard from '@/pages/networks/NetworkCard';

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
  const { registerNavigation, unregisterNavigation } = useNavigation();

  const {
    selectedTypes,
    setSelectedTypes,
    selectedGenres,
    setSelectedGenres,
    selectedNetworks,
    setSelectedNetworks,
    language,
    setLanguage,
    minRating,
    maxRating,
    setMinRating,
    setMaxRating,
    minYear,
    maxYear,
    setMinYear,
    setMaxYear,
    numberOfFilters,
    hasFilters,
    clearAllFilters,
  } = useFiltersParams();

  // Local state for pending changes (before applying)
  const [pendingTypes, setPendingTypes] = useState<string[] | null>(selectedTypes);
  const [pendingGenres, setPendingGenres] = useState<string[] | null>(selectedGenres);
  const [pendingNetworks, setPendingNetworks] = useState<string[] | null>(selectedNetworks);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(language);
  const [pendingMinRating, setPendingMinRating] = useState<number | null>(minRating);
  const [pendingMaxRating, setPendingMaxRating] = useState<number | null>(maxRating);
  const [pendingMinYear, setPendingMinYear] = useState<number | null>(minYear);
  const [pendingMaxYear, setPendingMaxYear] = useState<number | null>(maxYear);

  // Check if there are pending changes
  const hasPendingChanges =
    JSON.stringify(pendingTypes) !== JSON.stringify(selectedTypes) ||
    JSON.stringify(pendingGenres) !== JSON.stringify(selectedGenres) ||
    JSON.stringify(pendingNetworks) !== JSON.stringify(selectedNetworks) ||
    pendingLanguage !== language ||
    pendingMinRating !== minRating ||
    pendingMaxRating !== maxRating ||
    pendingMinYear !== minYear ||
    pendingMaxYear !== maxYear;

  const hasCurrentFilters =
    selectedGenres?.length ||
    selectedNetworks?.length ||
    selectedTypes?.length ||
    language ||
    minRating !== null ||
    maxRating !== null ||
    minYear !== null ||
    maxYear !== null;
  // Reset pending state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPendingTypes(selectedTypes);
      setPendingGenres(selectedGenres);
      setPendingNetworks(selectedNetworks);
      setPendingLanguage(language);
      setPendingMinRating(minRating);
      setPendingMaxRating(maxRating);
      setPendingMinYear(minYear);
      setPendingMaxYear(maxYear);
    }
  }, [isOpen, selectedTypes, selectedGenres, selectedNetworks, language, minRating, maxRating, minYear, maxYear]);

  useHotkeys(getShortcut('toggleFilters')?.hotkey || '', () => (isOpen ? onClose() : onOpen()), [isOpen]);
  useHotkeys(getShortcut('escape')?.hotkey || '', () => (isOpen ? onClose() : null), { enabled: isOpen });
  useHotkeys(getShortcut('filterMovies')?.hotkey || '', () => toggleMediaType('movie'), [pendingTypes]);
  useHotkeys(getShortcut('filterTvShows')?.hotkey || '', () => toggleMediaType('tv'), [pendingTypes]);
  useHotkeys(
    getShortcut('clearFilters')?.hotkey || '',
    () => {
      if (hasFilters) clearAllPendingFilters();
    },
    [hasFilters]
  );

  useEffect(() => {
    if (isOpen) registerNavigation('filter-modal');
    return () => unregisterNavigation('filter-modal');
  }, [isOpen, registerNavigation, unregisterNavigation]);

  const toggleMediaType = (typeId: string) => {
    setPendingTypes((types) => {
      const current = types || [];
      if (current.length && current.length === MEDIA_TYPES.length - 1) return null;
      return current.includes(typeId) ? current.filter((t) => t !== typeId) : [...current, typeId];
    });
  };

  const applyFilters = () => {
    setSelectedTypes(pendingTypes);
    setSelectedGenres(pendingGenres);
    setSelectedNetworks(pendingNetworks);
    setLanguage(pendingLanguage);
    setMinRating(pendingMinRating);
    setMaxRating(pendingMaxRating);
    setMinYear(pendingMinYear);
    setMaxYear(pendingMaxYear);
    onClose();
  };

  const clearAllPendingFilters = () => {
    setPendingTypes(null);
    setPendingGenres(null);
    setPendingNetworks(null);
    setPendingLanguage(null);
    setPendingMinRating(null);
    setPendingMaxRating(null);
    setPendingMinYear(null);
    setPendingMaxYear(null);
    clearAllFilters();
    onClose();
  };

  const resetPendingFilters = () => {
    setPendingTypes(selectedTypes);
    setPendingGenres(selectedGenres);
    setPendingNetworks(selectedNetworks);
    setPendingLanguage(language);
    setPendingMinRating(minRating);
    setPendingMaxRating(maxRating);
    setPendingMinYear(minYear);
    setPendingMaxYear(maxYear);
  };

  const renderedFilters = filterOptions.map((option) => {
    if (option === 'genres')
      return <GenresFilter key='genres' pendingGenres={pendingGenres} setPendingGenres={setPendingGenres} />;
    if (option === 'networks')
      return (
        <NetworksFilter key='networks' pendingNetworks={pendingNetworks} setPendingNetworks={setPendingNetworks} />
      );
    if (option === 'types')
      return <TypesFilter key='types' pendingTypes={pendingTypes} setPendingTypes={setPendingTypes} />;
    if (option === 'language')
      return (
        <LanguageFilter key='language' pendingLanguage={pendingLanguage} setPendingLanguage={setPendingLanguage} />
      );
    if (option === 'ratingRange')
      return (
        <RatingRangeFilter
          key='ratingRange'
          pendingMinRating={pendingMinRating}
          pendingMaxRating={pendingMaxRating}
          setPendingMinRating={setPendingMinRating}
          setPendingMaxRating={setPendingMaxRating}
        />
      );
    if (option === 'releaseYear')
      return (
        <ReleaseYearFilter
          key='releaseYear'
          pendingMinYear={pendingMinYear}
          pendingMaxYear={pendingMaxYear}
          setPendingMinYear={setPendingMinYear}
          setPendingMaxYear={setPendingMaxYear}
        />
      );
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
      <Modal disclosure={disclosure} size='4xl' classNames={{ base: 'sm:max-h-[90vh] max-sm:rounded-none max-h-full' }}>
        <ModalBody className='space-y-6 p-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-Primary-500/20 rounded-lg p-2'>
              <FilterIcon className='text-Primary-400 size-5' />
            </div>
            <h2 className='text-Primary-50 text-xl font-semibold'>{title}</h2>
          </div>
          <div className='space-y-6'>{renderedFilters}</div>

          {/* Action buttons */}
          <div className='border-Primary-500/20 grid grid-cols-2 gap-3 border-t pt-4'>
            <Button className='button-primary!' onPress={applyFilters} isDisabled={!hasPendingChanges}>
              <Check className='size-4' />
              Apply Filters
            </Button>
            <Button
              className='button-secondary!'
              onPress={() => (hasCurrentFilters ? clearAllPendingFilters() : resetPendingFilters())}
              isDisabled={!hasPendingChanges && !hasCurrentFilters}
            >
              {hasCurrentFilters ? 'Clear Filters' : 'Reset Filters'}
            </Button>
          </div>

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

function GenresFilter({
  pendingGenres,
  setPendingGenres,
}: {
  pendingGenres: string[] | null;
  setPendingGenres: (value: string[] | null) => void;
}) {
  const toggle = (slug: string) => {
    const list = pendingGenres || [];
    if (list.includes(slug)) {
      setPendingGenres(list.length > 1 ? list.filter((g) => g !== slug) : null);
    } else {
      setPendingGenres([...list, slug]);
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
        {pendingGenres?.length ? <ClearFilter onClear={() => setPendingGenres(null)} /> : null}
      </div>
      <div className='flex flex-wrap gap-2'>
        {GENRES.map(({ id, label, slug }) => (
          <Button
            key={id}
            className='selectable-button!'
            data-is-selected={pendingGenres?.includes(slug) || false}
            onPress={() => toggle(slug)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function NetworksFilter({
  pendingNetworks,
  setPendingNetworks,
}: {
  pendingNetworks: string[] | null;
  setPendingNetworks: (value: string[] | null) => void;
}) {
  const toggle = (slug: string) => {
    const list = pendingNetworks || [];
    if (list.includes(slug)) {
      setPendingNetworks(list.length > 1 ? list.filter((n) => n !== slug) : null);
    } else {
      setPendingNetworks([...list, slug]);
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
        {pendingNetworks?.length ? <ClearFilter onClear={() => setPendingNetworks(null)} /> : null}
      </div>
      <Slider>
        {NETWORKS.map((network) => (
          <Slider.Slide key={network.id} className='group w-30!'>
            <NetworkCard
              network={network}
              type='button'
              isSelected={pendingNetworks?.includes(network.slug)}
              onSelect={() => toggle(network.slug)}
            />
          </Slider.Slide>
        ))}
      </Slider>
    </div>
  );
}

function TypesFilter({
  pendingTypes,
  setPendingTypes,
}: {
  pendingTypes: string[] | null;
  setPendingTypes: React.Dispatch<React.SetStateAction<string[] | null>>;
}) {
  const toggle = (id: string) => {
    setPendingTypes((types) => {
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
        {pendingTypes?.length ? <ClearFilter onClear={() => setPendingTypes(null)} /> : null}
      </div>
      <div className='flex flex-wrap gap-3'>
        {MEDIA_TYPES.map(({ id, label, icon: Icon, shortcut }) => (
          <Button
            key={id}
            className='selectable-button!'
            data-is-selected={pendingTypes?.includes(id) || false}
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

function LanguageFilter({
  pendingLanguage,
  setPendingLanguage,
}: {
  pendingLanguage: string | null;
  setPendingLanguage: (value: string | null) => void;
}) {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='flex items-center gap-3 text-lg font-semibold text-white'>
          <div className='bg-Grey-800 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10'>
            <Globe className='text-Tertiary-400 h-4 w-4' />
          </div>
          Language
        </h3>
        {pendingLanguage ? <ClearFilter onClear={() => setPendingLanguage(null)} /> : null}
      </div>
      <Select
        placeholder='Select language'
        selectedKeys={pendingLanguage ? [pendingLanguage] : []}
        onSelectionChange={(keys) => setPendingLanguage((Array.from(keys)[0] as string) || null)}
        classNames={{ ...SELECT_CLASSNAMES, trigger: SELECT_CLASSNAMES.trigger + ' w-full' }}
      >
        {POPULAR_LANGUAGES.map(({ code, name }) => (
          <SelectItem key={code}>{name}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

function RatingRangeFilter({
  pendingMinRating,
  pendingMaxRating,
  setPendingMinRating,
  setPendingMaxRating,
}: {
  pendingMinRating: number | null;
  pendingMaxRating: number | null;
  setPendingMinRating: (value: number | null) => void;
  setPendingMaxRating: (value: number | null) => void;
}) {
  let minError: string | null = null;
  let maxError: string | null = null;

  if (pendingMinRating != null) {
    if (pendingMinRating < 0 || pendingMinRating > 10) minError = 'Min rating must be between 0 and 10';
    else if (pendingMaxRating != null && pendingMinRating > pendingMaxRating)
      minError = 'Min rating cannot be greater than max rating';
  }

  if (pendingMaxRating != null) {
    if (pendingMaxRating < 0 || pendingMaxRating > 10) maxError = 'Max rating must be between 0 and 10';
    else if (pendingMinRating != null && pendingMaxRating < pendingMinRating)
      maxError = 'Max rating cannot be less than min rating';
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
        {(pendingMinRating || pendingMaxRating) && (
          <ClearFilter
            onClear={() => {
              setPendingMinRating(null);
              setPendingMaxRating(null);
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
          value={pendingMinRating ?? ''}
          onChange={(e) => setPendingMinRating(e.target.value ? parseFloat(e.target.value) : null)}
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
          value={pendingMaxRating ?? ''}
          onChange={(e) => setPendingMaxRating(e.target.value ? parseFloat(e.target.value) : null)}
          label='Max Rating'
          placeholder='10.0'
          error={maxError}
        />
      </div>
    </div>
  );
}

function ReleaseYearFilter({
  pendingMinYear,
  pendingMaxYear,
  setPendingMinYear,
  setPendingMaxYear,
}: {
  pendingMinYear: number | null;
  pendingMaxYear: number | null;
  setPendingMinYear: (value: number | null) => void;
  setPendingMaxYear: (value: number | null) => void;
}) {
  const currentYear = new Date().getFullYear();

  let minError: string | null = null;
  let maxError: string | null = null;

  if (pendingMinYear != null) {
    if (pendingMinYear < 1900 || pendingMinYear > currentYear + 2)
      minError = `Min year must be between 1900 and ${currentYear + 2}`;
    else if (pendingMaxYear != null && pendingMinYear > pendingMaxYear) minError = 'From year cannot be after To year';
  }

  if (pendingMaxYear != null) {
    if (pendingMaxYear < 1900 || pendingMaxYear > currentYear + 2)
      maxError = `Max year must be between 1900 and ${currentYear + 2}`;
    else if (pendingMinYear != null && pendingMaxYear < pendingMinYear) maxError = 'To year cannot be before From year';
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
        {(pendingMinYear || pendingMaxYear) && (
          <ClearFilter
            onClear={() => {
              setPendingMinYear(null);
              setPendingMaxYear(null);
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
          value={pendingMinYear ?? ''}
          onChange={(e) => setPendingMinYear(e.target.value ? parseInt(e.target.value) : null)}
          label='From Year'
          placeholder='1900'
          error={minError}
        />
        <Input
          name='maxYear'
          type='number'
          min='1900'
          max={currentYear + 2}
          value={pendingMaxYear ?? ''}
          onChange={(e) => setPendingMaxYear(e.target.value ? parseInt(e.target.value) : null)}
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
