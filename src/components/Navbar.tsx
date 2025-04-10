import UserDropdown from './UserDropdown';
import NavItem from './NavItem';
import { HOME_ICON, MOVIES_ICON, SEARCH_ICON, TV_ICON } from './ui/Icons';

const explore: Link = {
  label: 'Explore',
  href: '/',
  checks: ['popular', 'top-rated', 'now-playing', 'upcoming', 'airing-today', 'no-the-air', 'search'],
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
      checks: ['popular', 'top-rated', 'airing-today', 'no-the-air'],
    },
    { label: 'Search', icon: SEARCH_ICON, href: '/search' },
  ],
};

export default function Navbar() {
  const isAuthenticated: boolean = false;

  return (
    <nav className='sticky top-0 z-30 mb-12 py-4 backdrop-blur-lg'>
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
