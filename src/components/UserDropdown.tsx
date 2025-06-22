import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown';
import { Avatar } from '@heroui/avatar';
import { SETTINGS_ICON, SIGN_OUT_ICON } from './ui/Icons';
import { useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { addToast } from '@heroui/toast';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { ChevronDownIcon } from 'lucide-react';
import { AVATAR_CLASSNAMES, DROPDOWN_CLASSNAMES } from '@/styles/heroui';

export default function UserDropdown() {
  const { user, signOut: authSignOut } = useAuthStore();
  const { confirm } = useConfirmationModal();
  const navigate = useNavigate();
  const location = useLocation()

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

  return (
    <>
      <Dropdown classNames={DROPDOWN_CLASSNAMES} backdrop='opaque' radius='sm' placement='bottom-end'>
        <DropdownTrigger className='cursor-pointer'>
          <div className='flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2 transition-colors duration-200 hover:border-white/20 hover:bg-white/5'>
            <Avatar src={avatarUrl} classNames={AVATAR_CLASSNAMES} size='sm' />
            <span className='text-Primary-50 text-sm font-bold'>{user.name.split(' ')[0]}</span>
            <ChevronDownIcon className='text-Grey-300 size-4' />
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label='User Actions' disabledKeys={['profile']}>
          <DropdownSection showDivider>
            <DropdownItem
              key='profile'
              classNames={{ title: 'flex items-center gap-3', base: 'data-[disabled=true]:opacity-100' }}
              className='cursor-auto data-[hover=true]:bg-transparent'
            >
              <Avatar src={avatarUrl} classNames={AVATAR_CLASSNAMES} />
              <div className='flex-1'>
                <h5 className='text-Primary-100 text-base font-bold'>{user.name}</h5>
                <h6 className='text-Primary-200 font-medium'>{user.email}</h6>
              </div>
            </DropdownItem>
          </DropdownSection>
          <DropdownItem
            key='settings'
            href='/settings'
            startContent={SETTINGS_ICON}
            onPress={() => navigate('/settings')}
          >
            Settings
          </DropdownItem>
          <DropdownItem
            key='sign out'
            color='danger'
            className='text-danger'
            startContent={SIGN_OUT_ICON}
            onPress={signOut}
          >
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
