import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from '@heroui/react';
import { ChevronDownIcon, UserIcon, Settings, LibraryBig, Heart, LogOut, HelpCircle, Info } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { ShortcutKey } from '../ui/ShortcutKey';
import { UserInfoSection, SignInSection, SyncIndicatorSection } from './Shared';
import { navigationItems, isActive, useSignOut } from './utils';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { user } = useAuthStore();
  const location = useLocation();
  const { signOut } = useSignOut();

  const isAuthenticated = !!user;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement='right'
      // size='full'
      classNames={{
        base: 'bg-Grey-900/95 backdrop-blur-xl border-l border-white/10',
        wrapper: 'z-50',
        backdrop: 'bg-black/60 backdrop-blur-sm',
      }}
    >
      <DrawerContent>
        <DrawerHeader className='flex items-center justify-between border-b border-white/10 px-4 py-4'>
          <UserInfoSection />
        </DrawerHeader>

        <DrawerBody className='space-y-4 px-4 py-4'>
          <div>
            <h3 className='text-Grey-400 mb-3 px-2 text-xs font-medium tracking-wider uppercase'>Account & Settings</h3>
            <div className='space-y-2'>
              {isAuthenticated && (
                <Link
                  to={`/u/${user.profile.username}`}
                  onClick={onClose}
                  className={`hover:text-Primary-50 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                    isActive('/profile', user.profile.username) ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-200'
                  }`}
                >
                  <UserIcon className='size-4' />
                  Profile
                </Link>
              )}
              <Link
                to='/settings'
                onClick={onClose}
                className={`hover:text-Primary-50 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                  isActive('/settings') ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-200'
                }`}
              >
                <Settings className='size-4' />
                Settings
              </Link>
            </div>
          </div>

          {/* Library Section */}
          <div>
            <h3 className='text-Grey-400 mb-3 px-2 text-xs font-medium tracking-wider uppercase'>Library</h3>
            <div className='space-y-2'>
              <Link
                to='/library'
                onClick={onClose}
                className={`hover:text-Primary-50 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                  isActive('/library') ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-200'
                }`}
              >
                <LibraryBig className='size-4' />
                My Library
              </Link>
              <Link
                to='/library/favorites'
                onClick={onClose}
                className={`hover:text-Primary-50 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                  isActive('/library/favorites') ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-200'
                }`}
              >
                <Heart className='size-4' />
                Favorites
              </Link>
            </div>
          </div>

          {/* Main Navigation Section */}
          <div>
            <h3 className='text-Grey-400 mb-3 px-2 text-xs font-medium tracking-wider uppercase'>Navigation</h3>
            <div className='space-y-2'>
              {navigationItems.map((item) => {
                const isItemActive = item.matches.some((match) =>
                  match === '/' ? location.pathname === match : location.pathname.startsWith(match)
                );

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => {
                      onClose();
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
                    }}
                    className={`hover:text-Primary-50 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                      isItemActive ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-200'
                    }`}
                    aria-current={isItemActive ? 'page' : undefined}
                  >
                    <item.icon className='size-4' />
                    <div className='flex flex-col'>
                      <span className='font-medium'>{item.label}</span>
                      <span className='text-Grey-500 text-xs'>{item.description}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Help Section */}
          <div>
            <h3 className='text-Grey-400 mb-3 px-2 text-xs font-medium tracking-wider uppercase'>More</h3>
            <button
              onClick={() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
                onClose();
              }}
              className='text-Grey-200 hover:text-Primary-50 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5'
            >
              <div className='flex items-center gap-3'>
                <HelpCircle className='size-4' />
                Keyboard Shortcuts
              </div>
              <ShortcutKey shortcutName='toggleShortcutsHelp' />
            </button>
            <button className='hover:text-Primary-50 text-Grey-200 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5'>
              <Info className='size-4' />
              About
            </button>
          </div>

          {/* Sync Section */}
          {isAuthenticated && (
            <div className='border-t border-white/10 pt-4'>
              <SyncIndicatorSection />
            </div>
          )}
        </DrawerBody>

        <DrawerFooter className='border-t border-white/10 px-4 py-4'>
          {isAuthenticated ? (
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300'
            >
              <LogOut className='size-4' />
              <div className='flex flex-col items-start'>
                <span className=''>Sign Out</span>
                <span className='text-gray-300'>{user.email}</span>
              </div>
            </button>
          ) : (
            <SignInSection />
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Trigger component for the unified mobile navigation
export function MobileDrawerTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='text-Grey-400 p-2 transition-colors hover:text-white md:hidden'
        aria-label='Open navigation menu'
      >
        <ChevronDownIcon className='h-6 w-6' />
      </button>

      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
