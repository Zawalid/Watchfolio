import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  HOME_ICON,
  MOVIES_ICON,
  SEARCH_ICON,
  TV_ICON,
  SIGN_IN_ICON,
  SETTINGS_ICON,
  COLLECTIONS_ICON,
} from '@/components/ui/Icons';

const navigationItems = [
  {
    label: 'Home',
    icon: HOME_ICON,
    href: '/',
    matches: ['/'],
  },
  {
    label: 'My Library',
    icon: COLLECTIONS_ICON,
    href: '/library',
    matches: ['/library'],
    authRequired: true,
  },
  {
    label: 'Movies',
    icon: MOVIES_ICON,
    href: '/movies',
    matches: ['/movies'],
  },
  {
    label: 'TV Shows',
    icon: TV_ICON,
    href: '/tv',
    matches: ['/tv'],
  },
  {
    label: 'Search',
    icon: SEARCH_ICON,
    href: '/search',
    matches: ['/search'],
  },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const visibleItems = navigationItems.filter((item) => !item.authRequired || (item.authRequired && isAuthenticated));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-40 bg-black/80 backdrop-blur-sm'
            onClick={onClose}
          />

          {/* Mobile Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='bg-Grey-900/95 fixed top-0 right-0 bottom-0 z-50 w-80 border-l border-white/10 backdrop-blur-xl'
          >
            <div className='flex h-full flex-col'>
              {/* Header */}
              <div className='flex items-center justify-between border-b border-white/10 p-6'>
                <img src='/images/logo.svg' alt='Watchfolio' className='h-8 w-auto' />
                <button onClick={onClose} className='text-Grey-400 p-2 transition-colors hover:text-white'>
                  <X className='h-5 w-5' />
                </button>
              </div>

              {/* Navigation */}
              <div className='flex-1 px-6 py-8'>
                <nav className='space-y-2'>
                  {visibleItems.map((item) => {
                    const isActive = item.matches.some((match) =>
                      match === '/' ? location.pathname === match : location.pathname.startsWith(match)
                    );

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ${
                          isActive
                            ? 'from-Primary-500/20 to-Secondary-500/20 border-Primary-500/30 border bg-gradient-to-r text-white'
                            : 'text-Grey-300 border border-transparent hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className='[&>svg]:h-5 [&>svg]:w-5'>{item.icon}</span>
                        <span>{item.label}</span>
                        {isActive && <div className='bg-Primary-400 ml-auto h-2 w-2 rounded-full' />}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Footer Actions */}
              <div className='border-t border-white/10 p-6'>
                <div className='space-y-3'>
                  {/* Quick Actions for all users */}
                  <div className='space-y-2'>
                    <h3 className='text-Grey-400 px-4 text-xs font-medium tracking-wider uppercase'>Quick Actions</h3>
                    <Link
                      to='/library'
                      onClick={onClose}
                      className='text-Grey-400 hover:text-Grey-200 flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/5'
                    >
                      <span className='[&>svg]:h-5 [&>svg]:w-5'>{COLLECTIONS_ICON}</span>
                      Library
                    </Link>
                    <Link
                      to='/library/favorites'
                      onClick={onClose}
                      className='text-Grey-400 hover:text-Grey-200 flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/5'
                    >
                      <Heart className='h-5 w-5' />
                      Favorites
                    </Link>
                    <Link
                      to='/settings'
                      onClick={onClose}
                      className='text-Grey-400 hover:text-Grey-200 flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/5'
                    >
                      <span className='[&>svg]:h-5 [&>svg]:w-5'>{SETTINGS_ICON}</span>
                      Settings
                    </Link>
                  </div>

                  {!isAuthenticated && (
                    <button
                      onClick={() => {
                        openAuthModal('signin');
                        onClose();
                      }}
                      className='bg-Primary-600 hover:bg-Primary-700 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-white transition-all duration-200'
                    >
                      <span className='[&>svg]:h-5 [&>svg]:w-5'>{SIGN_IN_ICON}</span>
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function MobileNavTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='text-Grey-400 p-2 transition-colors hover:text-white md:hidden'
      >
        <Menu className='h-6 w-6' />
      </button>

      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
