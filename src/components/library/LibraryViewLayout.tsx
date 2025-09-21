import { useRef, ReactNode } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryState } from 'nuqs';
import { PanelLeftClose } from 'lucide-react';
import { Button, Tooltip, useDisclosure } from '@heroui/react';
import { Input } from '@/components/ui/Input';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import FiltersModal from '../FiltersModal';
import SortBy from '../SortBy';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { cn } from '@/utils';
import { getShortcut } from '@/utils/keyboardShortcuts';
import LibrarySidebar from './LibrarySidebar';
import { useViewportSize } from '@/hooks/useViewportSize';

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
  const { isAbove } = useViewportSize();

  useHotkeys(getShortcut('focusSearch')?.hotkey || '', (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });
  useHotkeys(getShortcut('clearSearch')?.hotkey || '', () => setQuery(null));

  return (
    <div className='relative flex h-full gap-6 pb-3.5 lg:gap-10'>
      <LibrarySidebar
        sidebarTitle={sidebarTitle}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        isOwnProfile={isOwnProfile}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      {/* Main Content */}
      <div
        className={cn(
          'flex h-full flex-col gap-8 transition-all duration-300',
          'sm:ml-0', 
          showSidebar && isAbove('lg') ? 'sm:w-[calc(100%-290px)] sm:translate-x-[290px]' : 'w-full translate-x-0'
        )}
      >
        <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <Input
              type='text'
              icon='search'
              parentClassname='w-full md:w-80'
              name='search'
              value={query}
              label={searchLabel}
              placeholder='Search by title...'
              ref={searchInputRef}
              onChange={(e) => setQuery(e.target.value)}
            />
            {!showSidebar && (
              <Tooltip
                content={<ShortcutTooltip shortcutName='toggleSidebar' description='Show sidebar' />}
                className='tooltip-secondary!'
              >
                <Button
                  isIconOnly
                  className='button-secondary! max-sm:order-1'
                  onPress={() => setShowSidebar(true)}
                  aria-label='Show sidebar'
                >
                  <PanelLeftClose className='size-4 rotate-180' />
                </Button>
              </Tooltip>
            )}
          </div>
          <div className='flex items-center gap-3'>
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
            <FiltersModal
              disclosure={filtersDisclosure}
              title='Library Filters'
              filterOptions={['genres', 'networks', 'types']}
            />
            {renderActions?.()}
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-6'>{children}</div>
      </div>
    </div>
  );
}
