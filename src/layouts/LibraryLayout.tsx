import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryState } from 'nuqs';
import {
  FileJson,
  GalleryVerticalEnd,
  HelpCircle,
  MoreVertical,
  PanelLeftClose,
  Star,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@heroui/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/dropdown';
import { useDisclosure } from '@heroui/modal';
import { Tooltip } from '@heroui/tooltip';
import { Input } from '@/components/ui/Input';
import { ShortcutKey, ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { Tabs } from '@/components/ui/Tabs';
import { WelcomeBanner } from '@/components/ui/WelcomeBanner';
import FiltersModal from '@/components/FiltersModal';
import ImportExportModal from '@/components/library/ImportExportModal';
import KeyboardShortcuts from '@/components/library/KeyboardShortcuts';
import { SyncStatus } from '@/components/library/SyncStatus';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { DROPDOWN_CLASSNAMES } from '@/styles/heroui';
import { cn, slugify } from '@/utils';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { getShortcut } from '@/utils/keyboardShortcuts';
import { useClearLibrary } from '@/hooks/useClearLibrary';
import { AnimatePresence } from 'framer-motion';
import SortBy from '@/components/SortBy';

// TODO : Display the syn status somewhere else when the sidebar is hidden

export default function LibraryLayout() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [showTabs, setShowTabs] = useLocalStorageState('show-tabs', true);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersDisclosure = useDisclosure();
  const keyboardShortcutsDisclosure = useDisclosure();
  const importExportDisclosure = useDisclosure();
  const { getCount } = useLibraryStore();
  const { handleClearLibrary } = useClearLibrary();

  const location = useLocation();
  const [onboardingMessage, setOnboardingMessage] = useState({ show: false, action: null });

  useEffect(() => {
    const onboardingAction = location.state?.action;
    if (
      location.state?.fromOnboarding &&
      (onboardingAction === 'Start Rating' || onboardingAction === 'View Library')
    ) {
      setOnboardingMessage({ show: true, action: onboardingAction });
    }
  }, [location.state]);

  useHotkeys(getShortcut('toggleSidebar')?.hotkey || '', () => setShowTabs(!showTabs), [showTabs], { useKey: true });
  useHotkeys(
    getShortcut('focusSearch')?.hotkey || '',
    (e) => {
      e.preventDefault();
      searchInputRef.current?.focus();
    },
    { useKey: true }
  );
  useHotkeys(getShortcut('clearSearch')?.hotkey || '', () => setQuery(null), { useKey: true });
  useHotkeys(getShortcut('clearLibrary')?.hotkey || '', handleClearLibrary, { useKey: true });

  return (
    <div className='relative flex h-full flex-col gap-6 pb-3.5 lg:flex-row lg:gap-10'>
      <div
        className={cn(
          'fixed z-20 flex h-[calc(100vh-80px)] flex-col pb-3.5 transition-transform duration-300',
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
            <FiltersModal
              disclosure={filtersDisclosure}
              title='Library Filters'
              filterOptions={['genres', 'networks', 'types']}
            />
            <SortBy
              options={[
                { key: 'recent', label: 'Recently Added' },
                { key: 'title', label: 'Title' },
                { key: 'rating', label: 'Your Rating' },
                { key: 'date', label: 'Release Date' },
              ]}
              defaultSort='recent'
            />

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
                    shortcut={<ShortcutKey shortcutName='toggleImportExport' className='opacity-80' />}
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
                    shortcut={<ShortcutKey shortcutName='clearLibrary' className='opacity-80' />}
                  >
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
          {/* Welcome Banner for Onboarding Users */}
          <AnimatePresence>
            <WelcomeBanner
              title={
                onboardingMessage.action === 'Start Rating' ? 'Ready to Rate Your Content!' : 'Welcome to Your Library!'
              }
              description={
                onboardingMessage.action === 'Start Rating'
                  ? 'Rate movies and shows to build your taste profile. Look for unrated items to get started.'
                  : 'This is where you organize and track your entertainment. Use filters and sorting to explore your collection.'
              }
              icon={
                onboardingMessage.action === 'Start Rating' ? (
                  <Star className='text-Warning-400 h-5 w-5' />
                ) : (
                  <TrendingUp className='text-Success-400 h-5 w-5' />
                )
              }
              variant={onboardingMessage.action === 'Start Rating' ? 'rating' : 'library'}
              onDismiss={() => setOnboardingMessage({ show: false, action: null })}
              show={onboardingMessage.show}
            />
          </AnimatePresence>
          <Outlet />
        </div>
      </div>
      <KeyboardShortcuts disclosure={keyboardShortcutsDisclosure} />
      <ImportExportModal disclosure={importExportDisclosure} />
    </div>
  );
}
