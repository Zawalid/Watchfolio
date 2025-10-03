/* eslint-disable react-refresh/only-export-components */
import { useNavigate, useLocation } from 'react-router';
import { Avatar, Button, addToast, closeToast } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { AVATAR_CLASSNAMES } from '@/styles/heroui';
import { UserPlus, SignInIcon, Layers } from '../ui/Icons';
import { Home, Film, Tv, Search, Brain, Users, Tv2Icon, CollectionsIcon, SettingsIcon } from '@/components/ui/Icons';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { getDefaultAvatarUrl } from '@/utils/avatar';
import { UserWithProfile } from '@/lib/appwrite/types';

// Navigation utilities
const links = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/home',
    matches: ['/home'],
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
    id: 'mood-match',
    label: 'Mood Match',
    icon: Brain,
    href: '/mood-match',
    matches: ['/mood-match'],
    description: 'AI-powered recommendations for your mood',
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
    icon: CollectionsIcon,
    href: '/library',
    matches: ['/library'],
    description: 'Your saved content',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    href: '/settings/profile',
    matches: ['/settings'],
    description: 'Account preferences',
  },
] as const;

type Ids = (typeof links)[number]['id'][];
export const getLinks = (ids: Ids) =>
  links.filter((link) => ids.includes(link.id)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

export const isLinkActive = (path: string, username?: string, matches?: readonly string[]) => {
  if (path === '/profile') return location.pathname === `/u/${username}`;
  if (path === '/settings') return location.pathname.startsWith('/settings');
  if (path === '/library')
    return location.pathname.startsWith('/library') && location.pathname !== '/library/favorites';
  if (path === '/library/favorites') return location.pathname === '/library/favorites';
  if(matches) return matches.some((match) =>
    match === '/' ? location.pathname === match : location.pathname.startsWith(match)
  );
  return location.pathname === path
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

export const UserInfoSection = ({ size = 'lg' }: { size?: 'sm' | 'lg' }) => {
  const { user, isAuthenticated } = useAuthStore();
  const avatarUrl = getAvatarUrl(user, isAuthenticated);
  const joinDate = getJoinDate(user, isAuthenticated);

  return (
    <div className='flex items-center gap-3'>
      <Avatar src={avatarUrl} classNames={AVATAR_CLASSNAMES} size={size} />
      <div className='min-w-0 flex-1'>
        <h3 className='text-Primary-50 truncate text-lg font-semibold'>{isAuthenticated ? user?.name : 'Guest'}</h3>
        {isAuthenticated && user && <p className='text-Secondary-400 text-sm font-medium'>@{user.profile.username}</p>}
        <p className='text-Grey-500 mt-1 text-xs'>
          {isAuthenticated ? `Member since ${joinDate}` : 'Sign in to access more features'}
        </p>
      </div>
    </div>
  );
};

export const SignInSection = () => {
  const { openAuthModal } = useAuthStore();

  return (
    <div className='px-3 py-2'>
      <div className='mb-3 text-center'>
        <h4 className='text-Primary-50 heading mb-1 text-base'>
          Join <span className='gradient inline!'>Watchfolio</span>
        </h4>
        <p className='text-Grey-400 text-xs leading-relaxed'>
          Sign in to save your favorite movies & shows, track your watching progress, and discover personalized
          recommendations.
        </p>
      </div>
      <div className='space-y-2'>
        <Button onPress={() => openAuthModal('signin')} size='sm' className='button-primary! w-full'>
          <SignInIcon className='size-4' />
          Sign In
        </Button>
        <Button
          onPress={() => openAuthModal('signup')}
          size='sm'
          className='button-secondary! w-full'
          startContent={<UserPlus className='size-4' />}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};
