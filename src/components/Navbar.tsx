import UserDropdown from './UserDropdown';
import NavItem from './NavItem';
import { HOME_ICON, MOVIES_ICON, SEARCH_ICON, TV_ICON, SIGN_IN_ICON } from './ui/Icons';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@heroui/button';

const links: Links = {
  authenticated: [
    {
      label: 'My Library',
      icon: HOME_ICON,
      href: '/library',
      checks: ['all', 'watching', 'will-watch', 'watched', 'on-hold', 'dropped', 'favorites'],
    },
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
  unauthenticated: [
    {
      label: 'My Library',
      icon: HOME_ICON,
      href: '/library',
      checks: ['all', 'watching', 'will-watch', 'watched', 'on-hold', 'dropped', 'favorites'],
    },
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
  const { isAuthenticated } = useAuthStore();
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
        <img src='/images/logo.svg' alt='watchfolio' width={40} height={20} />{' '}
        <ul className='flex items-center gap-8'>
          {links[isAuthenticated ? 'authenticated' : 'unauthenticated'].map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </ul>
        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <Button
            as={Link}
            to='/signin'
            size='sm'
            variant='flat'
            color='primary'
            startContent={SIGN_IN_ICON}
            className='font-medium'
          >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}
