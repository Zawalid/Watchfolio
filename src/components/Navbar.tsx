import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { Heart, Layers } from 'lucide-react';
import { Tooltip } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { HOME_ICON, MOVIES_ICON, SEARCH_ICON, TV_ICON, COLLECTIONS_ICON, SETTINGS_ICON } from '@/components/ui/Icons';
import { MobileNavTrigger } from './MobileNav';
import UserDropdown from './UserDropdown';
import NavItem from './NavItem';

const navigationItems = [
  {
    label: 'Home',
    icon: HOME_ICON,
    href: '/home',
    matches: ['/home'],
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
    label: 'Collections',
    icon: <Layers className='h-4 w-4' />,
    href: '/collections',
    matches: ['/collections'],
  },
  {
    label: 'Search',
    icon: SEARCH_ICON,
    href: '/search',
    matches: ['/search'],
  },
];

function QuickActions() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLibraryActive = location.pathname.startsWith('/library');
  const isFavoritesActive = location.pathname === '/library/favorites';
  const isSettingsActive = location.pathname.startsWith('/settings');

  return (
    <div className='hidden items-center gap-2 md:flex'>
      <Tooltip content='Library' className='tooltip-secondary!'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/library')}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/5 ${
            isLibraryActive && !isFavoritesActive
              ? 'text-Primary-400 bg-Primary-500/20'
              : 'text-Grey-400 hover:text-Primary-400'
          }`}
          aria-label='Library'
        >
          <span className='[&>svg]:h-5 [&>svg]:w-5'>{COLLECTIONS_ICON}</span>
        </motion.button>
      </Tooltip>
      <Tooltip content='Favorites' className='tooltip-secondary!'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/library/favorites')}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/5 ${
            isFavoritesActive ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-400 hover:text-Primary-400'
          }`}
          aria-label='Favorites'
        >
          <Heart className='h-5 w-5' />
        </motion.button>
      </Tooltip>
      <Tooltip content='Settings' className='tooltip-secondary!'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/settings')}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/5 ${
            isSettingsActive ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-400 hover:text-Primary-400'
          }`}
          aria-label='Settings'
        >
          <span className='[&>svg]:h-5 [&>svg]:w-5'>{SETTINGS_ICON}</span>
        </motion.button>
      </Tooltip>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleItems = navigationItems;
  const homeLink = isAuthenticated ? '/home' : '/';

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-Grey-900/40 shadow-2xl shadow-black/20 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className='container mx-auto px-4 lg:px-6'>
        <div className='flex h-16 items-center justify-between'>
          <Link to={homeLink} className='group flex items-center space-x-2'>
            <motion.img
              whileHover={{ scale: 1.05 }}
              src='/images/logo.svg'
              alt='Watchfolio'
              className='h-8 w-auto transition-transform'
            />
          </Link>

          <div className='hidden items-center space-x-1 md:flex'>
            {visibleItems.map((item) => (
              <NavItem key={item.href} label={item.label} icon={item.icon} href={item.href} matches={item.matches} />
            ))}
          </div>

          <div className='flex items-center gap-3'>
            <QuickActions />
            <UserDropdown />
            <MobileNavTrigger />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
