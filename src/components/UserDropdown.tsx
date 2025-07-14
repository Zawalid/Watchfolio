import { useLocation, useNavigate } from 'react-router';
import { Avatar } from '@heroui/avatar';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/dropdown';
import { ChevronDownIcon, UserIcon, Settings, Bookmark, Heart, LogOut } from 'lucide-react';
import { addToast } from '@heroui/toast';
import { useAuthStore } from '@/stores/useAuthStore';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { AVATAR_CLASSNAMES, DROPDOWN_CLASSNAMES } from '@/styles/heroui';

export default function UserDropdown() {
  const { user, signOut: authSignOut } = useAuthStore();
  const { confirm } = useConfirmationModal();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const signOut = async () => {
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
      if (location.pathname.includes('settings')) navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      addToast({ title: 'Sign out failed', description: errorMessage, color: 'danger' });
      console.error('Error signing out:', error);
    }
  };

  const avatarUrl = user.profile.avatarUrl || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.name}`;
  const firstName = user.name.split(' ')[0];
  const joinDate = new Date(user.$createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isActive = (path: string) => {
    if (path === '/settings/profile') return location.pathname === '/settings/profile';
    if (path === '/settings')
      return location.pathname.startsWith('/settings') && location.pathname !== '/settings/profile';
    if (path === '/library')
      return location.pathname.startsWith('/library') && location.pathname !== '/library/favorites';
    if (path === '/library/favorites') return location.pathname === '/library/favorites';
    return false;
  };

  return (
    <Dropdown
      classNames={{ ...DROPDOWN_CLASSNAMES, content: DROPDOWN_CLASSNAMES.content.replace('bg-white/5', 'bg-blur') }}
      placement='bottom-end'
    >
      <DropdownTrigger>
        <button className='flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2 transition-all duration-200 hover:border-white/20 hover:bg-white/5'>
          <Avatar src={avatarUrl} classNames={AVATAR_CLASSNAMES} size='sm' />
          <span className='text-Primary-50 hidden text-sm font-medium sm:block'>{firstName}</span>
          <ChevronDownIcon className='text-Grey-300 h-4 w-4' />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label='User menu' className='w-80 p-0' disabledKeys={['user-info']}>
        {/* User Info Header */}
        <DropdownItem
          key='user-info'
          className='cursor-default opacity-100 hover:!bg-transparent'
          classNames={{
            base: 'border-b border-white/10 py-2 mb-2 px-4 data-[hover=true]:bg-transparent',
          }}
        >
          <div className='flex items-center gap-3'>
            <Avatar src={avatarUrl} classNames={AVATAR_CLASSNAMES} size='md' />
            <div className='min-w-0 flex-1'>
              <h3 className='text-Primary-50 truncate font-semibold'>{user.name}</h3>
              <p className='text-Grey-400 truncate text-sm'>{user.email}</p>
              <p className='text-Grey-500 mt-1 text-xs'>Member since {joinDate}</p>
            </div>
          </div>
        </DropdownItem>

        {/* Account Section */}
        <DropdownSection
          title='Account'
          classNames={{
            heading: 'text-Grey-400 px-3 py-2 text-xs font-medium tracking-wider uppercase',
            group: 'space-y-1',
          }}
        >
          <DropdownItem
            key='profile'
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive('/settings/profile')
                ? 'text-Primary-400 bg-Primary-500/20'
                : 'text-Grey-200 hover:text-Primary-50'
            }`}
            startContent={<UserIcon className='h-4 w-4' />}
            onPress={() => navigate('/settings/profile')}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            key='settings'
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive('/settings') ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-200 hover:text-Primary-50'
            }`}
            startContent={<Settings className='h-4 w-4' />}
            onPress={() => navigate('/settings')}
          >
            Settings
          </DropdownItem>
        </DropdownSection>

        {/* Library Section */}
        <DropdownSection
          title='Library'
          classNames={{
            heading: 'text-Grey-400 px-3 py-2 text-xs font-medium tracking-wider uppercase',
            group: 'space-y-1',
          }}
        >
          <DropdownItem
            key='library'
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive('/library') ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-200 hover:text-Primary-50'
            }`}
            startContent={<Bookmark className='h-4 w-4' />}
            onPress={() => navigate('/library')}
          >
            My Library
          </DropdownItem>
          <DropdownItem
            key='favorites'
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive('/library/favorites')
                ? 'text-Primary-400 bg-Primary-500/20'
                : 'text-Grey-200 hover:text-Primary-50'
            }`}
            startContent={<Heart className='h-4 w-4' />}
            onPress={() => navigate('/library/favorites')}
          >
            Favorites
          </DropdownItem>
        </DropdownSection>

        {/* Logout Button */}
        <DropdownSection
          classNames={{
            group: 'border-t border-white/10 pt-2',
          }}
        >
          <DropdownItem
            key='logout'
            className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:text-red-300'
            startContent={<LogOut className='h-4 w-4' />}
            onPress={signOut}
          >
            Sign Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
