import { useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryState } from 'nuqs';
import { GalleryVerticalEnd, PanelLeftClose } from 'lucide-react';
import { Button } from '@heroui/react';
import { Tooltip } from '@heroui/react';
import { useDisclosure } from '@heroui/react';
import { Input } from '@/components/ui/Input';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { Tabs } from '@/components/ui/Tabs';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { cn } from '@/utils';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { getShortcut } from '@/utils/keyboardShortcuts';
import FiltersModal from '@/components/FiltersModal';
import SortBy from '@/components/SortBy';
import LibraryInfiniteCardsList from '@/components/library/LibraryInfiniteCardsList';
import { useFilteredLibrary } from '@/hooks/useFilteredLibrary';
import { getLibraryCount } from '@/utils/library';
import { Status } from '@/components/ui/Status';
import { useAuthStore } from '@/stores/useAuthStore';
import { Profile } from '@/lib/appwrite/types';

export default function UserLibrary({ profile }: { profile: Profile }) {
  const { checkIsOwnProfile } = useAuthStore();
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [showTabs, setShowTabs] = useLocalStorageState('show-tabs-profile', true);
  const [status, setStatus] = useState<LibraryFilterStatus>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersDisclosure = useDisclosure();

  useHotkeys(getShortcut('toggleSidebar')?.hotkey || '', () => setShowTabs(!showTabs), [showTabs]);
  useHotkeys(getShortcut('focusSearch')?.hotkey || '', (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });
  useHotkeys(getShortcut('clearSearch')?.hotkey || '', () => setQuery(null));

  const isOwnProfile = checkIsOwnProfile(profile.username);
  const hiddenProfileSections = profile?.hiddenProfileSections || [];
  const pageTitle = isOwnProfile ? 'Your Library' : `${profile.name.split(' ')[0]}'s Library`;
  const searchLabel = isOwnProfile ? 'Search Your Library' : `Search ${profile.name.split(' ')[0]}'s Library`;

  const items = profile.library?.items?.length ? profile.library.items : [];
  const filteredItems = useFilteredLibrary(items as LibraryMedia[], status);

  const visibleStatuses = LIBRARY_MEDIA_STATUS.filter(
    (s) => isOwnProfile || !hiddenProfileSections.includes(`library.${s.value}`)
  );

  const tabs = [
    {
      label: `All (${getLibraryCount({ items, filter: 'all' })})`,
      icon: <GalleryVerticalEnd className='size-4' />,
      value: 'all',
    },
    ...visibleStatuses.map((s) => {
      const IconComponent = s.icon;
      return {
        label: `${s.label} (${getLibraryCount({ items, filter: s.value })})`,
        icon: <IconComponent className='size-4' />,
        value: s.value,
      };
    }),
  ];

  if (!items.length) {
    return (
      <Status.Empty
        title={isOwnProfile ? 'Your Library is Empty' : 'This Library is Empty'}
        message={
          isOwnProfile ? 'Start adding movies and shows to see them here.' : 'This user has not added any items yet.'
        }
      />
    );
  }

  return (
    <div className='relative flex h-full min-h-screen gap-6 pb-3.5 lg:gap-10'>
      <div className='pointer-events-none absolute top-0 left-0 h-full w-0'>
        <aside
          className={cn(
            'pointer-events-auto sticky top-20 flex h-[calc(100vh-100px)] w-64 flex-col transition-transform duration-300',
            showTabs ? 'translate-x-0' : '-translate-x-[200%]'
          )}
        >
          <div className='mb-6 flex items-center justify-between pl-2'>
            <h2 className='text-lg font-semibold text-white'>{pageTitle}</h2>
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
            className='w-full bg-transparent'
            tabClassName='px-3 lg:px-4 text-sm lg:text-base'
            activeTab={status}
            onChange={(val) => setStatus(val as LibraryFilterStatus)}
            tabs={tabs}
          />
        </aside>
      </div>
      <div
        className={cn(
          'flex h-full flex-col gap-8 transition-all duration-300',
          showTabs ? 'w-[calc(100%-260px)] translate-x-[290px]' : 'w-full translate-x-0'
        )}
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
                  className='button-secondary!'
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
              value={query || ''}
              label={searchLabel}
              placeholder='Search by title...'
              ref={searchInputRef}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-3'>
            <FiltersModal disclosure={filtersDisclosure} title='Library Filters' filterOptions={['genres', 'types']} />
            <SortBy options={[{ key: 'recent', label: 'Recently Added' }]} defaultSort='recent' />
          </div>
        </div>
        <div className='flex-1 space-y-8'>
          <LibraryInfiniteCardsList
            items={filteredItems}
            allItems={items as LibraryMedia[]}
            status={status}
            isOwnProfile={isOwnProfile}
          />
        </div>
      </div>
    </div>
  );
}
