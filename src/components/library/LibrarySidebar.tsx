import { ReactNode } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { PanelLeftClose } from 'lucide-react';
import { Button, Tooltip, useDisclosure, Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@heroui/react';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/utils';
import { getShortcut } from '@/utils/keyboardShortcuts';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { useViewportSize } from '@/hooks/useViewportSize';
import { DRAWER_CLASSNAMES } from '@/styles/heroui';

interface TabItem {
  label: string;
  value: string;
  icon?: ReactNode;
  link?: string;
}

interface LibrarySidebarProps {
  sidebarTitle: string;
  tabs: TabItem[];
  activeTab: string;
  onTabChange?: (value: string) => void;
  isOwnProfile: boolean;
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

export default function LibrarySidebar({
  sidebarTitle,
  tabs,
  activeTab,
  onTabChange,
  isOwnProfile,
  showSidebar,
  setShowSidebar,
}: LibrarySidebarProps) {
  const drawerDisclosure = useDisclosure({
    isOpen: showSidebar,
    onClose: () => setShowSidebar(false),
    onOpen: () => setShowSidebar(true),
  });
  const { isBelow } = useViewportSize();

  useHotkeys(getShortcut('toggleSidebar')?.hotkey || '', () => setShowSidebar(!showSidebar), [
    showSidebar,
    setShowSidebar,
    drawerDisclosure,
  ]);

  if (isBelow('lg'))
    return (
      <Drawer
        isOpen={drawerDisclosure.isOpen}
        onClose={drawerDisclosure.onClose}
        size={isBelow('mobile') ? 'full' : 'sm'}
        placement='left'
        backdrop='blur'
        classNames={{
          ...DRAWER_CLASSNAMES,
          base: DRAWER_CLASSNAMES.base + ' border-r border-white/10',
          closeButton: 'hidden',
        }}
      >
        <DrawerContent>
          <DrawerHeader className='flex items-center justify-between border-b border-white/10 px-4 py-4'>
            <h2 className='text-lg font-semibold text-white'>{sidebarTitle}</h2>
            <Tooltip content={<ShortcutTooltip shortcutName='toggleSidebar' />} className='tooltip-secondary!'>
              <Button
                isIconOnly
                size='sm'
                className='button-secondary!'
                onPress={drawerDisclosure.onClose}
                aria-label='Close sidebar'
              >
                <PanelLeftClose className='size-4' />
              </Button>
            </Tooltip>
          </DrawerHeader>

          <DrawerBody className='flex flex-col gap-6 px-4 py-6'>
            <Tabs
              className='bg-transparent'
              tabClassName='px-3 text-sm'
              preserveSearchParams={!onTabChange}
              activeTab={activeTab}
              onChange={onTabChange}
              tabs={tabs}
            />

            {isOwnProfile && (
              <div className='mt-auto'>
                <SyncStatusIndicator />
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );

  return (
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
        {isOwnProfile && <SyncStatusIndicator className='mt-auto mb-5' />}
      </aside>
    </div>
  );
}
