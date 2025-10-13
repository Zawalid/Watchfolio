import { Link, useLocation } from 'react-router';
import { useHotkeys } from 'react-hotkeys-hook';
import { PanelLeftClose, Info } from 'lucide-react';
import { User, Lock, Sliders, LibraryBig, Monitor } from 'lucide-react';
import { Button, Tooltip, useDisclosure, Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@heroui/react';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { useViewportSize } from '@/hooks/useViewportSize';
import { getShortcut } from '@/utils/keyboardShortcuts';
import { DRAWER_CLASSNAMES } from '@/styles/heroui';
import { useDesktopActions } from '@/contexts/DesktopActionsContext';

const links = [
  { href: '/settings/profile', label: 'Profile', icon: User },
  { href: '/settings/privacy', label: 'Privacy & Security', icon: Lock },
  { href: '/settings/preferences', label: 'Preferences', icon: Sliders },
  { href: '/settings/library', label: 'Library', icon: LibraryBig },
  { href: '/settings/devices', label: 'Devices', icon: Monitor },
];

export default function Sidebar() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isBelow } = useViewportSize();
  const { openAbout } = useDesktopActions();

  useHotkeys(getShortcut('toggleSidebar')?.hotkey || '', () => (isOpen ? onClose() : onOpen()), [isOpen]);

  if (isBelow('lg'))
    return (
      <>
        <Tooltip
          content={<ShortcutTooltip shortcutName='toggleSidebar' description='Show sidebar' />}
          className='tooltip-secondary!'
        >
          <Button isIconOnly size='sm' className='button-secondary! absolute right-0 max-sm:order-1' onPress={onOpen} aria-label='Show sidebar'>
            <PanelLeftClose className='size-4 rotate-180' />
          </Button>
        </Tooltip>

        <Drawer
          isOpen={isOpen}
          onClose={onClose}
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
              <h2 className='text-lg font-semibold text-white'>Settings</h2>
              <Tooltip content={<ShortcutTooltip shortcutName='toggleSidebar' />} className='tooltip-secondary!'>
                <Button isIconOnly size='sm' className='button-secondary!' onPress={onClose} aria-label='Close sidebar'>
                  <PanelLeftClose className='size-4' />
                </Button>
              </Tooltip>
            </DrawerHeader>

            <DrawerBody className='flex flex-col px-4 py-6'>
              <ul className='flex flex-1 flex-col gap-1'>
                {links.map((link) => (
                  <Item key={link.href} href={link.href} label={link.label} icon={link.icon} onClose={onClose} />
                ))}
              </ul>

              <div className='border-t border-white/10 pt-4'>
                <button
                  onClick={() => {
                    openAbout();
                    onClose();
                  }}
                  className='text-Grey-400 hover:text-Grey-200 hover:bg-white/5 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200'
                >
                  <Info className='h-5 w-5' />
                  <span>About Watchfolio</span>
                </button>
              </div>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );

  return (
    <aside className='sticky top-20 left-0 flex h-[calc(100vh-100px)] flex-col'>
      <ul className='flex flex-1 flex-col gap-1'>
        {links.map((link) => (
          <Item key={link.href} href={link.href} label={link.label} icon={link.icon} />
        ))}
      </ul>

      <div className='border-t border-white/10 pt-4'>
        <button
          onClick={openAbout}
          className='text-Grey-400 hover:text-Grey-200 hover:bg-white/5 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200'
        >
          <Info className='h-5 w-5' />
          <span>About Watchfolio</span>
        </button>
      </div>
    </aside>
  );
}

type ItemProps = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClose?: () => void;
};

function Item({ href, label, icon: Icon, onClose }: ItemProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = pathname === href;

  return (
    <li>
      <Link
        to={href}
        onClick={onClose}
        className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200 ${
          isActive
            ? 'bg-Primary-500/10 text-Primary-300 border-Primary-400 border-l-2'
            : 'text-Grey-400 hover:text-Grey-200 hover:bg-white/5'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className='h-5 w-5' aria-hidden='true' />
        <span>{label}</span>
      </Link>
    </li>
  );
}
