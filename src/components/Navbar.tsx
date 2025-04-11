import UserDropdown from './UserDropdown';
import NavItem from './NavItem';
import { HOME_ICON, MOVIES_ICON, SEARCH_ICON, TV_ICON } from './ui/Icons';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const explore: Link = {
  label: 'Explore',
  href: '/',
  checks: ['popular', 'top-rated', 'now-playing', 'upcoming', 'airing-today', 'on-tv', 'search'],
};

const links: Links = {
  authenticated: [
    explore,
    { label: 'Watchlist', href: '/watchlist', checks: ['watchlist'] },
    { label: 'Suggestions', href: '/suggestions' },
  ],
  unauthenticated: [
    { label: 'Home', icon: HOME_ICON, href: '/' },
    {
      label: 'Movies',
      icon: MOVIES_ICON,
      href: '/movies',
      checks: ['popular', 'top-rated', 'now-playing', 'upcoming'],
    },
    {
      label: 'Tv Shows',
      icon: TV_ICON,
      href: '/tv',
      checks: ['popular', 'top-rated', 'airing-today', 'on-tv'],
    },
    { label: 'Search', icon: SEARCH_ICON, href: '/search' },
  ],
};

export default function Navbar() {
  const isAuthenticated: boolean = false;
  const [scrolled, setScrolled] = useState(false);
  const pathname = useLocation().pathname;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 70;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      className={`sticky top-0 z-30 mb-12 py-4 backdrop-blur-lg transition-all duration-200 ${
        scrolled ? (pathname.includes('/details') ? 'bg-black/40' : 'bg-blur') : ''
      }`}
    >
      <div className='container flex items-center justify-between'>
        <img src='/images/logo.svg' alt='watchfolio' width={40} height={20} />
        <ul className='flex items-center gap-8'>
          {links[isAuthenticated ? 'authenticated' : 'unauthenticated'].map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </ul>
        {isAuthenticated && <UserDropdown user={{} as User} />}
      </div>
    </nav>
  );
}
