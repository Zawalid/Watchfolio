import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import {
  COLLECTIONS_ICON,
  HOME_ICON,
  MOVIES_ICON,
  SEARCH_ICON,
  TV_ICON,
} from '@/components/ui/Icons';

// const navigationItems = [
//   {
//     label: 'Home',
//     icon: HOME_ICON,
//     href: '/',
//     matches: ['/'],
//     description: 'Discover trending content',
//   },
//   {
//     label: 'Movies',
//     icon: MOVIES_ICON,
//     href: '/movies',
//     matches: ['/movies'],
//     description: 'Browse movies',
//   },
//   {
//     label: 'TV Shows',
//     icon: TV_ICON,
//     href: '/tv',
//     matches: ['/tv'],
//     description: 'Explore TV series',
//   },
//   {
//     label: 'Search',
//     icon: SEARCH_ICON,
//     href: '/search',
//     matches: ['/search'],
//     description: 'Find your favorites',
//   },
//   {
//     label: 'Library',
//     icon: COLLECTIONS_ICON,
//     href: '/library',
//     matches: ['/library'],
//     authRequired: true,
//     description: 'Your personal collection',
//   },
// ];

const navigationItems = [
  {
    label: 'Home',
    icon: HOME_ICON,
    href: '/',
    matches: ['/'],
  },
  {
    label: 'TV Shows',
    icon: TV_ICON,
    href: '/tv',
    matches: ['/tv'],
  },
  {
    label: 'Library',
    icon: COLLECTIONS_ICON,
    href: '/library',
    matches: ['/library'],
  },
  {
    label: 'Movies',
    icon: MOVIES_ICON,
    href: '/movies',
    matches: ['/movies'],
  },
  {
    label: 'Search',
    icon: SEARCH_ICON,
    href: '/search',
    matches: ['/search'],
  },
];

// Persistent Bottom Navigation Bar for mobile
export default function BottomNavBar() {
  const location = useLocation();



  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className='bg-Grey-900/95 fixed right-0 bottom-0 left-0 z-30 border-t border-white/10 pb-2 backdrop-blur-xl md:hidden'
      role='navigation'
      aria-label='Bottom navigation'
    >
      <div className='flex items-center justify-around px-2 py-2'>
        {navigationItems.map((item) => {
          const isActive = item.matches.some((match) =>
            match === '/' ? location.pathname === match : location.pathname.startsWith(match)
          );

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`focus:ring-Primary-500/50 flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all duration-200 focus:ring-2 focus:outline-none ${
                isActive ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-400 hover:bg-white/5 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className='[&>svg]:h-5 [&>svg]:w-5'>{item.icon}</span>
              <span className='text-xs font-medium'>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
