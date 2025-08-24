import { useLocation, useNavigate } from 'react-router';
import { Avatar, Button } from '@heroui/react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { ChevronDownIcon, UserIcon, Settings, LibraryBig, Heart, LogOut, HelpCircle, UserPlus } from 'lucide-react';
import { addToast } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { AVATAR_CLASSNAMES, DROPDOWN_CLASSNAMES } from '@/styles/heroui';
import { getDefaultAvatarUrl } from '@/utils/avatar';
import { ShortcutKey } from './ui/ShortcutKey';
import { SIGN_IN_ICON } from './ui/Icons';

const isActive = (path: string, username?: string) => {
  if (path === '/profile') return location.pathname === `/u/${username}`;
  if (path === '/settings') return location.pathname.startsWith('/settings');
  if (path === '/library')
    return location.pathname.startsWith('/library') && location.pathname !== '/library/favorites';
  if (path === '/library/favorites') return location.pathname === '/library/favorites';
  return false;
};

export default function UserDropdown() {
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
      await authSignOut();
      addToast({ title: 'Signed out successfully', description: 'You have been signed out.', color: 'success' });
      // navigate('/home'); // TODO : restore after finishing
      if (location.pathname.includes('settings')) navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      addToast({ title: 'Sign out failed', description: errorMessage, color: 'danger' });
      console.error('Error signing out:', error);
    }
  };

  const avatarUrl = isAuthenticated
    ? user.profile.avatarUrl || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.name}`
    : getDefaultAvatarUrl('guest');
  const firstName = isAuthenticated ? user.name.split(' ')[0] : 'Guest';
  const joinDate = isAuthenticated
    ? new Date(user.$createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <Dropdown
      classNames={{ ...DROPDOWN_CLASSNAMES, content: DROPDOWN_CLASSNAMES.content.replace('bg-white/5', 'bg-blur') }}
      placement='bottom-end'
    >
      <DropdownTrigger>
        <button className='flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2 transition-all duration-200 hover:border-white/20 hover:bg-white/5'>
          <Avatar src={avatarUrl} classNames={AVATAR_CLASSNAMES} size='sm' />
          <span className='text-Primary-50 hidden text-sm font-medium sm:block'>{firstName}</span>
          <ChevronDownIcon className='text-Grey-300 size-4' />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='User menu'
        className='w-80 p-0'
        disabledKeys={['user-info']}
        itemClasses={{
          base: 'flex items-center hover:bg-white/5! gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-Grey-200 hover:text-Primary-50 [&.active]:text-Primary-400! [&.active]:bg-Primary-500/20!',
        }}
      >
        <DropdownItem
          key='user-info'
          className='cursor-default opacity-100 hover:!bg-transparent'
          classNames={{
            base: 'border-b border-white/10 py-2 mb-2 px-4 data-[hover=true]:bg-transparent',
          }}
        >
          <div className='flex items-center gap-3'>
            <Avatar src={avatarUrl} classNames={AVATAR_CLASSNAMES} size='lg' />
            <div className='min-w-0 flex-1'>
              <h3 className='text-Primary-50 truncate text-lg font-semibold'>
                {isAuthenticated ? user.name : 'Guest'}
              </h3>
              {isAuthenticated && <p className='text-Secondary-400 text-sm font-medium'>@{user.profile.username}</p>}
              <p className='text-Grey-500 mt-1 text-xs'>
                {isAuthenticated ? `Member since ${joinDate}` : 'Sign in to access more features'}
              </p>
            </div>
          </div>
        </DropdownItem>

        <DropdownSection
          title='Account & Settings'
          classNames={{
            heading: 'text-Grey-400 px-3 py-2 text-xs font-medium tracking-wider uppercase',
            group: 'space-y-1',
          }}
        >
          {isAuthenticated ? (
            <DropdownItem
              key='profile'
              href={`/u/${user.profile.username}`}
              className={isActive('/profile', user.profile.username) ? 'active' : ''}
              startContent={<UserIcon className='size-4' />}
            >
              Profile
            </DropdownItem>
          ) : null}
          <DropdownItem
            key='settings'
            href='/settings'
            className={isActive('/settings') ? 'active' : ''}
            startContent={<Settings className='size-4' />}
          >
            Settings
          </DropdownItem>
        </DropdownSection>

        <DropdownSection
          title='Library'
          classNames={{
            heading: 'text-Grey-400 px-3 py-2 text-xs font-medium tracking-wider uppercase',
            group: 'space-y-1',
          }}
        >
          <DropdownItem
            key='library'
            className={isActive('/library') ? 'active' : ''}
            startContent={<LibraryBig className='size-4' />}
            href='/library'
          >
            My Library
          </DropdownItem>
          <DropdownItem
            key='favorites'
            className={isActive('/library/favorites') ? 'active' : ''}
            startContent={<Heart className='size-4' />}
            href='/library/favorites'
          >
            Favorites
          </DropdownItem>
        </DropdownSection>

        <DropdownSection
          title='Help'
          classNames={{
            heading: 'text-Grey-400 px-3 py-2 text-xs font-medium tracking-wider uppercase',
            group: 'space-y-1',
          }}
        >
          <DropdownItem
            key='help'
            className='text-Grey-200 hover:text-Primary-50'
            startContent={<HelpCircle className='size-4' />}
            onPress={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))}
            endContent={<ShortcutKey shortcutName='toggleShortcutsHelp' />}
          >
            Keyboard Shortcuts
          </DropdownItem>
        </DropdownSection>

        {/* Logout Button */}
        <DropdownSection classNames={{ group: 'border-t border-white/10 pt-2' }}>
          {isAuthenticated ? (
            <DropdownItem
              key='logout'
              className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:text-red-300'
              startContent={<LogOut className='size-4' />}
              onPress={signOut}
            >
              Sign Out
            </DropdownItem>
          ) : (
            <DropdownItem
              key='signin'
              className='cursor-auto hover:!bg-transparent data-[disabled=true]:pointer-events-auto data-[disabled=true]:opacity-100'
            >
              <SignInSection />
            </DropdownItem>
          )}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

const SignInSection = () => {
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
          <span className='[&>svg]:h-4 [&>svg]:w-4'>{SIGN_IN_ICON}</span>
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
