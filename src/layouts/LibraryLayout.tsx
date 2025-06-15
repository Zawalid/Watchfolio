import { useRef } from 'react';
import { Outlet } from 'react-router';
import { useHotkeys } from 'react-hotkeys-hook';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { GalleryVerticalEnd, HelpCircle, ArrowUp, ArrowDown, PanelLeftClose, Filter, FileJson } from 'lucide-react';
import { Select, SelectItem, SelectSection } from '@heroui/select';
import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/modal';
import { Tooltip } from '@heroui/tooltip';
import Input from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import KeyboardShortcuts from '@/components/library/KeyboardShortcuts';
import FiltersModal from '@/components/library/FiltersModal';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import { cn, slugify } from '@/utils';
import { getShortcut } from '@/utils/keyboardShortcuts';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import ImportExportModal from '@/components/library/ImportExportModal';
import { SELECT_CLASSNAMES } from '@/styles/heroui';

export default function LibraryLayout() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [sortBy, setSortBy] = useQueryState('sort', { defaultValue: 'recent' });
  const [sortDir, setSortDir] = useQueryState('dir', { defaultValue: 'desc' });
  const [showTabs, setShowTabs] = useLocalStorageState('show-tabs', true);
  const [selectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedPlatforms] = useQueryState('platforms', parseAsArrayOf(parseAsString));
  const [selectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));

  const searchInputRef = useRef<HTMLInputElement>(null);

  const filtersDisclosure = useDisclosure();
  const keyboardShortcutsDisclosure = useDisclosure();
  const importExportDisclosure = useDisclosure();

  const { getCount } = useLibraryStore();

  useHotkeys(getShortcut('toggleSidebar').hotkey, () => setShowTabs(!showTabs), [showTabs], { useKey: true });
  useHotkeys(
    getShortcut('focusSearch').hotkey,
    (e) => {
      e.preventDefault();
      searchInputRef.current?.focus();
    },
    { useKey: true }
  );
  useHotkeys(getShortcut('clearSearch').hotkey, () => setQuery(null), { useKey: true });

  const hasActiveFilters = !!(selectedGenres?.length || selectedPlatforms?.length || selectedTypes?.length);

  return (
    <div className='relative flex h-full flex-col gap-6 lg:flex-row lg:gap-10'>
      <Tabs
        className={`absolute z-20 flex-col bg-transparent transition-transform duration-300 lg:flex-col ${
          showTabs ? 'translate-x-0' : '-translate-x-[200%]'
        }`}
        tabClassName='px-3 lg:px-4 text-sm lg:text-base'
        tabs={[
          {
            label: `All (${getCount('all')})`,
            icon: <GalleryVerticalEnd className='size-4' />,
            includes: true,
            value: 'all',
            link: '/library/all',
          },
          ...LIBRARY_MEDIA_STATUS.map((status) => {
            const IconComponent = status.icon;
            return {
              label: `${status.label} (${getCount(status.value)})`,
              icon: <IconComponent className='size-4' />,
              value: status.value,
              link: `/library/${slugify(status.value)}`,
            };
          }),
        ]}
      />
      <div
        className={`flex flex-col gap-8 transition-all duration-300 ${
          showTabs ? 'w-[calc(100%-260px)] translate-x-[260px]' : 'w-full translate-x-0'
        }`}
      >
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <Input
            type='text'
            icon='search'
            parentClassname='w-full lg:w-1/3'
            name='search'
            value={query}
            label='Search Your Library'
            placeholder='Search by title, genre, or status...'
            ref={searchInputRef}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className='flex w-full gap-2 lg:w-auto lg:min-w-fit'>
            <Tooltip content={<ShortcutTooltip shortcutName='toggleSidebar' />} className='tooltip-secondary'>
              <Button
                isIconOnly
                className='button-secondary'
                onPress={() => setShowTabs(!showTabs)}
                aria-label='Toggle tabs visibility'
              >
                {showTabs ? <PanelLeftClose className='size-4' /> : <PanelLeftClose className='size-4 rotate-180' />}
              </Button>
            </Tooltip>

            {/* Filter button with indicator */}
            <Tooltip content={<ShortcutTooltip shortcutName='toggleFilters' />} className='tooltip-secondary'>
              <Button
                isIconOnly
                className={cn(
                  'button-secondary relative overflow-visible',
                  hasActiveFilters && 'border-amber-500/50 shadow-sm shadow-amber-500/20'
                )}
                onPress={() => filtersDisclosure.onOpen()}
                aria-label='Show filters'
              >
                <Filter className={cn('size-4', hasActiveFilters && 'text-amber-400')} />

                {/* Filter indicator dot */}
                {hasActiveFilters && (
                  <div className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black/80'>
                    {(selectedGenres?.length || 0) + (selectedPlatforms?.length || 0) + (selectedTypes?.length || 0)}
                  </div>
                )}
              </Button>
            </Tooltip>

            <Select
              placeholder='Sort by'
              classNames={SELECT_CLASSNAMES}
              aria-label='Sort options'
              selectedKeys={[sortBy, sortDir]}
              onChange={(e) => {
                const val = e.target.value;
                if (['asc', 'desc'].includes(val)) setSortDir(val);
                else setSortBy(val);
              }}
              value={sortBy}
            >
              <SelectSection title='Sort By' showDivider>
                <SelectItem key='recent'>Recently Added</SelectItem>
                <SelectItem key='title'>Title</SelectItem>
                <SelectItem key='rating'>Your Rating</SelectItem>
                <SelectItem key='date'>Release Date</SelectItem>
              </SelectSection>

              <SelectSection title='Direction'>
                <SelectItem key='asc' startContent={<ArrowUp className='size-3.5' />}>
                  Ascending (A-Z, Oldest First)
                </SelectItem>
                <SelectItem key='desc' startContent={<ArrowDown className='size-3.5' />}>
                  Descending (Z-A, Newest First)
                </SelectItem>
              </SelectSection>
            </Select>

            <Tooltip content={<ShortcutTooltip shortcutName='toggleImportExport' />} className='tooltip-secondary'>
              <Button
                isIconOnly
                className='button-secondary'
                onPress={() => importExportDisclosure.onOpen()}
                aria-label='Import or export library'
              >
                <FileJson className='size-4' />
              </Button>
            </Tooltip>

            <Tooltip content={<ShortcutTooltip shortcutName='toggleShortcutsHelp' />} className='tooltip-secondary'>
              <Button
                isIconOnly
                className='button-secondary'
                onPress={() => keyboardShortcutsDisclosure.onOpen()}
                aria-label='Show keyboard shortcuts'
              >
                <HelpCircle className='size-4' />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
      <KeyboardShortcuts disclosure={keyboardShortcutsDisclosure} />
      <FiltersModal disclosure={filtersDisclosure} />
      <ImportExportModal disclosure={importExportDisclosure} /> {/* Render the new modal */}
    </div>
  );
}
