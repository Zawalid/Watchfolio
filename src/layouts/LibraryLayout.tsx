import { useRef } from 'react';
import { Outlet } from 'react-router';
import { useHotkeys } from 'react-hotkeys-hook';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import {
  ArrowDown,
  ArrowUp,
  FileJson,
  Filter,
  GalleryVerticalEnd,
  HelpCircle,
  MoreVertical,
  PanelLeftClose,
  Trash2,
} from 'lucide-react';
import { Button } from '@heroui/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/dropdown';
import { useDisclosure } from '@heroui/modal';
import { Select, SelectItem, SelectSection } from '@heroui/select';
import { Tooltip } from '@heroui/tooltip';
import { Input } from '@/components/ui/Input';
import { ShortcutKey, ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { Tabs } from '@/components/ui/Tabs';
import FiltersModal from '@/components/library/FiltersModal';
import ImportExportModal from '@/components/library/ImportExportModal';
import KeyboardShortcuts from '@/components/library/KeyboardShortcuts';
import { SyncStatus } from '@/components/library/SyncStatus';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { DROPDOWN_CLASSNAMES, SELECT_CLASSNAMES } from '@/styles/heroui';
import { cn, slugify } from '@/utils';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { getShortcut } from '@/utils/keyboardShortcuts';
import { useClearLibrary } from '@/hooks/useClearLibrary';

// TODO : Display the syn status somewhere else when the sidebar is hidden

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
  const { handleClearLibrary } = useClearLibrary();

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
  useHotkeys(getShortcut('clearLibrary').hotkey, handleClearLibrary, { useKey: true });

  const hasActiveFilters = !!(selectedGenres?.length || selectedPlatforms?.length || selectedTypes?.length);

  return (
    <div className='relative flex h-full flex-col gap-6 pb-3.5 lg:flex-row lg:gap-10'>
      <div
        className={cn(
          'fixed z-20 flex h-[calc(100vh-120px)] flex-col pb-3.5 transition-transform duration-300',
          showTabs ? 'translate-x-0' : '-translate-x-[200%]'
        )}
      >
        <div className='mb-6 flex items-center justify-between px-4'>
          <h2 className='text-lg font-semibold text-white'>Library</h2>
          <Tooltip content={<ShortcutTooltip shortcutName='toggleSidebar' />} className='tooltip-secondary!'>
            <Button
              isIconOnly
              size='sm'
              className='button-secondary!'
              onPress={() => setShowTabs(false)}
              aria-label='Close sidebar'
            >
              <PanelLeftClose className='size-4' />
            </Button>
          </Tooltip>
        </div>
        <Tabs
          className='flex-col bg-transparent'
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

        <SyncStatus className='mt-auto mb-3' />
      </div>
      <div
        className={`flex flex-col gap-8 transition-all duration-300 ${
          showTabs ? 'w-[calc(100%-260px)] translate-x-[260px]' : 'w-full translate-x-0'
        }`}
      >
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex items-center gap-2'>
            {!showTabs && (
              <Tooltip
                content={<ShortcutTooltip shortcutName='toggleSidebar' description='Show sidebar' />}
                className='tooltip-secondary!'
              >
                <Button
                  isIconOnly
                  className='button-secondary! h-full'
                  onPress={() => setShowTabs(true)}
                  aria-label='Show sidebar'
                >
                  <PanelLeftClose className='size-4 rotate-180' />
                </Button>
              </Tooltip>
            )}
            <Input
              type='text'
              icon='search'
              parentClassname='w-80'
              name='search'
              value={query}
              label='Search Your Library'
              placeholder='Search by title, genre, or status...'
              ref={searchInputRef}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-3'>
            {/* Filter button */}
            <Tooltip content={<ShortcutTooltip shortcutName='toggleFilters' />} className='tooltip-secondary!'>
              <Button
                isIconOnly
                className={cn(
                  'button-secondary! relative',
                  hasActiveFilters && 'border-amber-500/50 shadow-sm shadow-amber-500/20'
                )}
                onPress={() => filtersDisclosure.onOpen()}
                aria-label='Show filters'
              >
                <Filter className={cn('size-4', hasActiveFilters && 'text-amber-400')} />
                {hasActiveFilters && (
                  <div className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black/80'>
                    {(selectedGenres?.length || 0) + (selectedPlatforms?.length || 0) + (selectedTypes?.length || 0)}
                  </div>
                )}
              </Button>
            </Tooltip>

            {/* Sort */}
            <Select
              placeholder='Sort by'
              classNames={{ ...SELECT_CLASSNAMES, listboxWrapper: 'max-h-none!' }}
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
                  Ascending
                </SelectItem>
                <SelectItem key='desc' startContent={<ArrowDown className='size-3.5' />}>
                  Descending
                </SelectItem>
              </SelectSection>
            </Select>

            {/* More options dropdown */}
            <Dropdown placement='bottom-end' backdrop='opaque' classNames={DROPDOWN_CLASSNAMES}>
              <DropdownTrigger>
                <Button isIconOnly className='button-secondary! relative' aria-label='More options'>
                  <Tooltip content='More options' className='tooltip-secondary!'>
                    <div className='absolute inset-0 size-full'></div>
                  </Tooltip>
                  <MoreVertical className='size-4' />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label='Library actions'>
                <DropdownSection title='Library Management' showDivider>
                  <DropdownItem
                    key='import-export'
                    startContent={<FileJson className='size-4 shrink-0' />}
                    onPress={() => importExportDisclosure.onOpen()}
                    description='Import or export your library'
                    classNames={{ shortcut: 'p-0 border-none' }}
                    shortcut={<ShortcutKey shortcutName='toggleImportExport' className='kbd-sm! opacity-80' />}
                  >
                    Import / Export
                  </DropdownItem>
                  <DropdownItem
                    key='clear-library'
                    startContent={<Trash2 className='size-4 shrink-0' />}
                    onPress={handleClearLibrary}
                    className='text-danger'
                    color='danger'
                    description='Permanently delete all items'
                    classNames={{ shortcut: 'p-0 border-none' }}
                    shortcut={<ShortcutKey shortcutName='clearLibrary' className='kbd-sm! opacity-80' />}
                  >
                    {' '}
                    Clear Library
                  </DropdownItem>
                </DropdownSection>

                <DropdownSection title='Help & Settings'>
                  <DropdownItem
                    key='shortcuts'
                    startContent={<HelpCircle className='size-4 shrink-0' />}
                    onPress={() => keyboardShortcutsDisclosure.onOpen()}
                    description='View keyboard shortcuts'
                    classNames={{ shortcut: 'p-0 border-none' }}
                    shortcut={<ShortcutKey shortcutName='toggleShortcutsHelp' className='kbd-sm! opacity-80' />}
                  >
                    Keyboard Shortcuts
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
      <KeyboardShortcuts disclosure={keyboardShortcutsDisclosure} />
      <FiltersModal disclosure={filtersDisclosure} />
      <ImportExportModal disclosure={importExportDisclosure} />
    </div>
  );
}
