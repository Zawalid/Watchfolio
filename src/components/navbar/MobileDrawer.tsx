import { useState } from 'react';
import { Link } from 'react-router';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from '@heroui/react';
import { motion } from 'framer-motion';
import { Avatar } from '@heroui/react';
import { UserIcon, Settings, LibraryBig, Heart, LogOut, HelpCircle, Info } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { AVATAR_CLASSNAMES, DRAWER_CLASSNAMES } from '@/styles/heroui';
import { ShortcutKey } from '../ui/ShortcutKey';
import { UserInfoSection, SignInSection, getLinks, isLinkActive, useSignOut, getAvatarUrl } from './Shared';
import { SyncStatusIndicator } from '../library/SyncStatusIndicator';
import { useViewportSize } from '@/hooks/useViewportSize';
import { useDesktopActions } from '@/contexts/DesktopActionsContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { user } = useAuthStore();
  const { signOut } = useSignOut();
  const { isBelow } = useViewportSize();
  const { openAbout } = useDesktopActions();

  const isAuthenticated = !!user;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size={isBelow('mobile') ? 'full' : 'sm'}
      placement='right'
      backdrop='blur'
      classNames={{ ...DRAWER_CLASSNAMES, base: DRAWER_CLASSNAMES.base + ' border-l border-white/10' }}
    >
      <DrawerContent>
        <DrawerHeader className='flex items-center justify-between border-b border-white/10 px-4 py-4'>
          <UserInfoSection />
        </DrawerHeader>

        <DrawerBody className='space-y-0 p-0'>
          {/* Quick Actions - Primary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='p-4 pb-0'
          >
            <div className='grid grid-cols-2 gap-3'>
              <Link
                to='/library'
                onClick={onClose}
                className={`group relative overflow-hidden rounded-xl px-4 py-3 transition-all duration-200 hover:scale-105 ${
                  isLinkActive('/library')
                    ? 'from-Primary-500/20 to-Primary-600/10 border-Primary-400/30 border bg-gradient-to-br'
                    : 'bg-Grey-800/50 hover:bg-Grey-700/50 border border-white/5'
                }`}
              >
                <div className='flex flex-col items-center gap-2 text-center'>
                  <LibraryBig className={`size-6 ${isLinkActive('/library') ? 'text-Primary-400' : 'text-Grey-300'}`} />
                  <span
                    className={`text-sm font-medium ${isLinkActive('/library') ? 'text-Primary-50' : 'text-Grey-200'}`}
                  >
                    Library
                  </span>
                </div>
              </Link>
              <Link
                to='/library/favorites'
                onClick={onClose}
                className={`group relative overflow-hidden rounded-xl px-4 py-3 transition-all duration-200 hover:scale-105 ${
                  isLinkActive('/library/favorites')
                    ? 'from-Secondary-500/20 to-Secondary-600/10 border-Secondary-400/30 border bg-gradient-to-br'
                    : 'bg-Grey-800/50 hover:bg-Grey-700/50 border border-white/5'
                }`}
              >
                <div className='flex flex-col items-center gap-2 text-center'>
                  <Heart
                    className={`size-6 ${isLinkActive('/library/favorites') ? 'text-Secondary-400' : 'text-Grey-300'}`}
                  />
                  <span
                    className={`text-sm font-medium ${isLinkActive('/library/favorites') ? 'text-Secondary-50' : 'text-Grey-200'}`}
                  >
                    Favorites
                  </span>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Main Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='px-4 py-4'
          >
            <h3 className='text-Grey-400 mb-4 px-2 text-xs font-semibold tracking-wider uppercase'>Discover</h3>
            <div className='space-y-1'>
              {getLinks(['home', 'movies', 'tv', 'search']).map((link, index) => {
                const isActive = isLinkActive(link.href, undefined, link.matches);

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => {
                        onClose();
                        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
                      }}
                      className={`group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                        isActive
                          ? 'from-Primary-500/15 to-Primary-600/5 text-Primary-400 border-Primary-500/20 border bg-gradient-to-r'
                          : 'text-Grey-200 hover:text-Primary-50 hover:bg-white/5'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <link.icon
                        className={`size-5 transition-colors ${isActive ? 'text-Primary-400' : 'text-Grey-400 group-hover:text-Primary-400'}`}
                      />
                      <div className='flex flex-col'>
                        <span className='font-semibold'>{link.label}</span>
                        <span className='text-Grey-500 text-xs'>{link.description}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId='activeIndicator'
                          className='bg-Primary-400 ml-auto h-2 w-2 rounded-full'
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* More Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='px-4 py-2'
          >
            <h3 className='text-Grey-400 mb-3 px-2 text-xs font-semibold tracking-wider uppercase'>More</h3>
            <div className='space-y-1'>
              {getLinks(['collections', 'celebrities', 'networks']).map((link, index) => {
                const isActive = isLinkActive(link.href, undefined, link.matches);

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => {
                        onClose();
                        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
                      }}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 hover:bg-white/5 ${
                        isActive ? 'text-Primary-400' : 'text-Grey-300 hover:text-Primary-50'
                      }`}
                    >
                      <link.icon className='size-4' />
                      <div className='flex flex-col'>
                        <span className='font-semibold'>{link.label}</span>
                        <span className='text-Grey-500 text-xs'>{link.description}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Settings & Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className='border-t border-white/5 px-4 py-4'
          >
            <div className='space-y-1'>
              {isAuthenticated && (
                <Link
                  to={`/u/${user.profile.username}`}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 hover:bg-white/5 ${
                    isLinkActive('/profile', user.profile.username)
                      ? 'text-Primary-400'
                      : 'text-Grey-300 hover:text-Primary-50'
                  }`}
                >
                  <UserIcon className='size-4' />
                  <div className='flex w-full flex-col'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>Profile</span>
                      <span className='text-Grey-500 ml-auto text-xs font-medium'>@{user.profile.username}</span>
                    </div>
                    <span className='text-Grey-500 text-xs'>View your profile and activity</span>
                  </div>
                </Link>
              )}
              <Link
                to='/settings'
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 hover:bg-white/5 ${
                  isLinkActive('/settings') ? 'text-Primary-400' : 'text-Grey-300 hover:text-Primary-50'
                }`}
              >
                <Settings className='size-4' />
                <div className='flex flex-col'>
                  <span className='font-medium'>Settings</span>
                  <span className='text-Grey-500 text-xs'>Manage your account and preferences</span>
                </div>
              </Link>
              <button
                onClick={() => {
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
                  onClose();
                }}
                className='text-Grey-300 hover:text-Primary-50 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 hover:bg-white/5'
              >
                <HelpCircle className='size-4' />
                <div className='flex w-full flex-col'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Shortcuts</span>
                    <ShortcutKey shortcutName='toggleShortcutsHelp' />
                  </div>
                  <span className='text-Grey-500 text-start text-xs'>View all keyboard shortcuts</span>
                </div>
              </button>
              <button
                onClick={() => {
                  openAbout();
                  onClose();
                }}
                className='text-Grey-300 hover:text-Primary-50 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 hover:bg-white/5'
              >
                <Info className='size-4' />
                <div className='flex flex-col'>
                  <span className='font-medium'>About Watchfolio</span>
                  <span className='text-Grey-500 text-start text-xs'>App info and credits</span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Sync Section */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className='border-t border-white/5 px-4 py-4'
            >
              <SyncStatusIndicator />
            </motion.div>
          )}
        </DrawerBody>

        <DrawerFooter className='border-t border-white/5 p-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className='w-full'
          >
            {isAuthenticated ? (
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className='group flex w-full items-center gap-3 rounded-xl bg-red-500/10 p-4 text-sm font-semibold text-red-400 transition-all duration-200 hover:scale-[1.02] hover:bg-red-500/20 hover:text-red-300'
              >
                <LogOut className='size-5 transition-transform group-hover:scale-110' />
                <div className='flex flex-col items-start'>
                  <span className='font-semibold'>Sign Out</span>
                  <span className='text-xs font-medium text-red-300/70'>{user.email}</span>
                </div>
              </button>
            ) : (
              <SignInSection />
            )}
          </motion.div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function MobileDrawerTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const avatarUrl = getAvatarUrl(user, isAuthenticated);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className='md:hidden'
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <Avatar
          src={avatarUrl}
          classNames={{
            ...AVATAR_CLASSNAMES,
            base: `${AVATAR_CLASSNAMES.base} ${isOpen ? 'ring-2 ring-Primary-400' : 'ring-1 ring-white/20'} transition-all duration-200`,
          }}
          size='sm'
        />
      </motion.button>

      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
