import { useRef, ReactNode } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryState } from 'nuqs';
import { PanelLeftClose } from 'lucide-react';
import { Button, Tooltip, useDisclosure } from '@heroui/react';
import { Input } from '@/components/ui/Input';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { Tabs } from '@/components/ui/Tabs';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { cn } from '@/utils';
import { getShortcut } from '@/utils/keyboardShortcuts';
import { SyncStatus } from './SyncStatus';
import FiltersModal from '../FiltersModal';
import SortBy from '../SortBy';

interface TabItem {
  label: string;
  value: string;
  icon?: ReactNode;
  link?: string;
}

interface LibraryViewLayoutProps {
  sidebarTitle: string;
  tabs: TabItem[];
  activeTab: string;
  onTabChange?: (value: string) => void;
  searchLabel: string;
  renderActions?: () => ReactNode;
  children: ReactNode;
  isOwnProfile: boolean;
}

export default function LibraryViewLayout({
  sidebarTitle,
  tabs,
  activeTab,
  onTabChange,
  searchLabel,
  renderActions,
  children,
  isOwnProfile,
}: LibraryViewLayoutProps) {
  const [query, setQuery] = useQueryState('query', { defaultValue: '', shallow: false });
  const [showSidebar, setShowSidebar] = useLocalStorageState(`show-sidebar-${sidebarTitle}`, true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersDisclosure = useDisclosure();

  useHotkeys(getShortcut('toggleSidebar')?.hotkey || '', () => setShowSidebar(!showSidebar), [showSidebar]);
  useHotkeys(getShortcut('focusSearch')?.hotkey || '', (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });
  useHotkeys(getShortcut('clearSearch')?.hotkey || '', () => setQuery(null));

  return (
    <div className='relative flex h-full gap-6 pb-3.5 lg:gap-10'>
      {/* Sidebar */}
      <div className='pointer-events-none absolute top-0 left-0 h-full w-0'>
        <aside
          className={cn(
            'pointer-events-auto sticky top-20 flex h-[calc(100vh-100px)] w-64 flex-col transition-transform duration-300',
            showSidebar ? 'translate-x-0' : '-translate-x-[200%]'
          )}
        >
          <div className='mb-6 flex items-center justify-between px-4'>
            <h2 className='text-lg font-semibold text-white'>{sidebarTitle}</h2>
            <Tooltip content={<ShortcutTooltip shortcutName='toggleSidebar' />} className='tooltip-secondary!'>
              <Button
                isIconOnly
                size='sm'
                className='button-secondary!'
                onPress={() => setShowSidebar(false)}
                aria-label='Close sidebar'
              >
                <PanelLeftClose className='size-4' />
              </Button>
            </Tooltip>
          </div>
          <Tabs
            className='mb-5 bg-transparent'
            tabClassName='px-3 lg:px-4 text-sm lg:text-base'
            preserveSearchParams={!onTabChange}
            activeTab={activeTab}
            onChange={onTabChange}
            tabs={tabs}
          />
          {isOwnProfile && <SyncStatus className='mt-auto mb-3' />}
        </aside>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'flex h-full flex-col gap-8 transition-all duration-300',
          showSidebar ? 'w-[calc(100%-290px)] translate-x-[290px]' : 'w-full translate-x-0'
        )}
      >
        {/* Top Bar */}
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex items-center gap-2'>
            {!showSidebar && (
              <Tooltip
                content={<ShortcutTooltip shortcutName='toggleSidebar' description='Show sidebar' />}
                className='tooltip-secondary!'
              >
                <Button
                  isIconOnly
                  className='button-secondary!'
                  onPress={() => setShowSidebar(true)}
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
              label={searchLabel}
              placeholder='Search by title...'
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
                ...(isOwnProfile ? [{ key: 'user_rating', label: 'Your Rating' }] : []),
                { key: 'rating', label: 'Rating' },
                { key: 'release_date', label: 'Release Date' },
                { key: 'runtime', label: 'Runtime' },
              ]}
              defaultSort='recent'
            />
            {renderActions?.()}
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-6'>{children}</div>
      </div>
    </div>
  );
}
