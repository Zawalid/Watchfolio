import { useNavigate, useLocation } from 'react-router';
import { addToast, closeToast } from '@heroui/react';
import { Home, Film, Tv, Search, Layers, Users, Tv2Icon } from 'lucide-react';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { getDefaultAvatarUrl } from '@/utils/avatar';
import { UserWithProfile } from '@/lib/appwrite/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { COLLECTIONS_ICON } from '../ui/Icons';

// Navigation utilities
const links = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/',
    matches: ['/'],
    description: 'Discover trending content',
  },
  {
    id: 'movies',
    label: 'Movies',
    icon: Film,
    href: '/movies',
    matches: ['/movies'],
    description: 'Browse movies',
  },
  {
    id: 'tv',
    label: 'TV Shows',
    icon: Tv,
    href: '/tv',
    matches: ['/tv'],
    description: 'Explore TV series',
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    href: '/search',
    matches: ['/search'],
    description: 'Find your favorites',
  },
  {
    id: 'collections',
    label: 'Collections',
    icon: Layers,
    href: '/collections',
    matches: ['/collections'],
    description: 'Curated lists',
  },
  {
    id: 'celebrities',
    label: 'Celebrities',
    icon: Users,
    href: '/celebrities',
    matches: ['/celebrities'],
    description: 'Actors & creators',
  },
  {
    id: 'networks',
    label: 'Networks',
    icon: Tv2Icon,
    href: '/networks',
    matches: ['/networks'],
    description: 'Streaming platforms',
  },
  {
    id: 'library',
    label: 'Library',
    icon: COLLECTIONS_ICON,
    href: '/library',
    matches: ['/library'],
    description: 'Your saved content',
  },
];

type Ids = typeof links[number]['id'][];
export const getLinks = (ids: Ids) => links.filter((link) => ids.includes(link.id));

export const isActive = (path: string, username?: string) => {
  if (path === '/profile') return location.pathname === `/u/${username}`;
  if (path === '/settings') return location.pathname.startsWith('/settings');
  if (path === '/library')
    return location.pathname.startsWith('/library') && location.pathname !== '/library/favorites';
  if (path === '/library/favorites') return location.pathname === '/library/favorites';
  return false;
};

export const getAvatarUrl = (user: UserWithProfile | null, isAuthenticated: boolean) => {
  return isAuthenticated && user
    ? user.profile.avatarUrl || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.name}`
    : getDefaultAvatarUrl('guest');
};

export const getJoinDate = (user: UserWithProfile | null, isAuthenticated: boolean) => {
  return isAuthenticated && user
    ? new Date(user.$createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';
};

// Sign out hook
export const useSignOut = () => {
  const { user, signOut: authSignOut } = useAuthStore();
  const { confirm } = useConfirmationModal();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!user;

  const signOut = async () => {
    if (!isAuthenticated) return;
    try {
      const confirmed = await confirm({
        title: 'Sign Out',
        message: 'Are you sure you want to sign out?',
        confirmText: 'Sign Out',
        cancelText: 'Cancel',
        confirmationKey: 'sign-out',
      });
      if (!confirmed) return;
      const key = addToast({
        title: 'Signing out...',
        description: 'Please wait while we sign you out.',
        color: 'default',
        promise: authSignOut().then(() => {
          addToast({
            title: 'Signed out successfully',
            description: 'We hope to see you again soon!',
            color: 'success',
          });
          if (key) closeToast(key);
          // navigate('/home'); // TODO : restore after finishing
          if (location.pathname.includes('settings')) navigate('/');
        }),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      addToast({ title: 'Sign out failed', description: errorMessage, color: 'danger' });
      console.error('Error signing out:', error);
    }
  };

  return { signOut, isAuthenticated };
};
