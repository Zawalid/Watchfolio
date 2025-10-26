import { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation, useParams } from 'react-router';
import { FileJson, GalleryVerticalEnd, HelpCircle, MoreVertical, Star, Trash2, TrendingUp } from 'lucide-react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@heroui/react';
import { AnimatePresence } from 'framer-motion';
import { WelcomeBanner } from '@/components/ui/WelcomeBanner';
import LibraryViewLayout from '@/components/library/LibraryViewLayout';
import { ShortcutKey } from '@/components/ui/ShortcutKey';
import { useClearLibrary } from '@/hooks/library/useLibraryMutations';
import { useLibraryTotalCount } from '@/hooks/library/useLibraryQueries';
import { DROPDOWN_CLASSNAMES } from '@/styles/heroui';
import { slugify } from '@/utils';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useUIStore } from '@/stores/useUIStore';

export default function LibraryLayout() {
  const { status } = useParams<{ status: LibraryFilterStatus }>();
  const activeTab = status || 'all';

  const libraryCount = useLibraryTotalCount();
  const openImportExport = useUIStore((state) => state.openImportExport);
  const { clearLibrary } = useClearLibrary();

  const location = useLocation();
  const [onboardingMessage, setOnboardingMessage] = useState({ show: false, action: null });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchingChange = useCallback((searching: boolean) => {
    setIsSearching(searching);
  }, []);

  useEffect(() => {
    const onboardingAction = location.state?.action;
    if (
      location.state?.fromOnboarding &&
      (onboardingAction === 'Start Rating' || onboardingAction === 'View Library')
    ) {
      setOnboardingMessage({ show: true, action: onboardingAction });
    }
  }, [location.state]);

  const renderActions = () => (
    <>
      <Dropdown placement='bottom-end' backdrop='opaque' classNames={DROPDOWN_CLASSNAMES}>
        <DropdownTrigger>
          <Button isIconOnly className='button-secondary! relative' aria-label='More options'>
            <MoreVertical className='size-4' />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label='Library actions'>
          <DropdownSection title='Library Management' showDivider>
            <DropdownItem
              key='import-export'
              startContent={<FileJson className='size-4 shrink-0' />}
              onPress={() => openImportExport()}
              description='Import or export your library'
            >
              Import / Export
            </DropdownItem>
            <DropdownItem
              key='clear-library'
              startContent={<Trash2 className='size-4 shrink-0' />}
              onPress={clearLibrary}
              className='text-danger'
              classNames={{shortcut : "w-min shrink-0 min-w-0  pl-0 ml-0"}}
              color='danger'
              description='Permanently delete all items'
              shortcut={<ShortcutKey shortcutName='clearLibrary' className='opacity-80' />}
            >
              Clear Library
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title='Help & Settings'>
            <DropdownItem
              key='shortcuts'
              startContent={<HelpCircle className='size-4 shrink-0' />}
              onPress={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))}
              description='View keyboard shortcuts'
              shortcut={<ShortcutKey shortcutName='toggleShortcutsHelp' className='kbd-sm! opacity-80' />}
            >
              Keyboard Shortcuts
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );

  return (
    <LibraryViewLayout
      sidebarTitle='Your Library'
      tabs={[
        {
          label: `All (${libraryCount.all})`,
          icon: <GalleryVerticalEnd className='size-4' />,
          value: 'all',
          link: '/library/all',
        },
        ...LIBRARY_MEDIA_STATUS.map((status) => {
          const IconComponent = status.icon;
          return {
            label: `${status.label} (${libraryCount[status.value]})`,
            icon: <IconComponent className='size-4' />,
            value: status.value,
            link: `/library/${slugify(status.value)}`,
          };
        }),
      ]}
      activeTab={activeTab}
      searchLabel='Search Your Library'
      renderActions={renderActions}
      isOwnProfile={true}
      onSearchingChange={handleSearchingChange}
    >
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
      <Outlet context={{ isSearching }} />
    </LibraryViewLayout>
  );
}
