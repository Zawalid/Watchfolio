import Image from 'next/image';
import UserDropdown from './UserDropdown';
import NavItem from './NavItem';
import { HOME_ICON, MOVIES_ICON, SEARCH_ICON, TV_ICON } from './ui/Icons';
import { getUser } from '@/lib/db/user';

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
    // { label: 'Suggest me', href: '/suggest' },
    // { label: 'Sign In', href: '/signin', icon: SIGN_IN_ICON },
  ],
};

export default async function Navbar() {
  const user = await getUser();
  const isAuthenticated: boolean = Boolean(user);

  return (
    <nav className='sticky top-0 z-30 mb-12 py-4 backdrop-blur-lg'>
      <div className='container flex items-center justify-between'>
        <Image src='/images/logo.svg' alt='watchfolio' width={40} height={20} />
        <ul className='flex items-center gap-8'>
          {links[isAuthenticated ? 'authenticated' : 'unauthenticated'].map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </ul>
        <UserDropdown user={user as User} />
      </div>
    </nav>
  );
}
