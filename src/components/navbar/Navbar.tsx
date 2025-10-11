import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { Tooltip } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Heart, LibraryBig, SettingsIcon } from '@/components/ui/Icons';
import UserDropdown from './UserDropdown';
import NavItem from './NavItem';
import { MobileDrawerTrigger } from './MobileDrawer';
import { getLinks } from './Shared';
import { cn } from '@/utils';
import { isDesktop } from '@/lib/platform';

function QuickActions() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLibraryActive = location.pathname.startsWith('/library');
  const isFavoritesActive = location.pathname === '/library/favorites';
  const isSettingsActive = location.pathname.startsWith('/settings');

  return (
    <div className='hidden items-center gap-2 lg:flex'>
      <Tooltip content='Library' className='tooltip-secondary!'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/library')}
          className={`flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/5 ${
            isLibraryActive && !isFavoritesActive
              ? 'text-Primary-400 bg-Primary-500/20'
              : 'text-Grey-400 hover:text-Primary-400'
          }`}
          aria-label='Library'
        >
          <LibraryBig className='size-5' />
        </motion.button>
      </Tooltip>

      <Tooltip content='Favorites' className='tooltip-secondary!'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/library/favorites')}
          className={`flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/5 ${
            isFavoritesActive ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-400 hover:text-Primary-400'
          }`}
          aria-label='Favorites'
        >
          <Heart className='size-5' />
        </motion.button>
      </Tooltip>

      <Tooltip content='Settings' className='tooltip-secondary!'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/settings')}
          className={`flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/5 ${
            isSettingsActive ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-400 hover:text-Primary-400'
          }`}
          aria-label='Settings'
        >
          <SettingsIcon className='size-5' />
        </motion.button>
      </Tooltip>
    </div>
  );
}

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const homeLink = isAuthenticated ? '/home' : '/';

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
      'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
      scrolled ? 'bg-Grey-900/40 shadow-2xl shadow-black/20 backdrop-blur-xl' : 'bg-transparent',
      isDesktop() && 'top-9'
      )}
    >
      <div className='xs:px-6 container mx-auto px-3'>
      <div className='flex h-16 items-center justify-between'>
        <Link to={homeLink} className='group flex items-center space-x-2'>
        <motion.img
          whileHover={{ scale: 1.05 }}
          src='/images/logo.svg'
          alt='Watchfolio'
          className='h-8 w-auto transition-transform'
        />
        </Link>

        <div className='hidden items-center space-x-2 md:flex'>
        {getLinks(['home', 'movies', 'tv', 'mood-match', 'search']).map((item) => (
          <NavItem
          key={item.href}
          label={item.label}
          icon={item.icon}
          href={item.href}
          matches={item.matches}
          className={item.href === '/mood-match' ? 'md:hidden lg:flex' : ''}
          />
        ))}
        </div>

        <div className='flex items-center gap-3'>
        <QuickActions />
        <UserDropdown />
        <MobileDrawerTrigger />
        </div>
      </div>
      </div>
    </motion.nav>
  );
}
