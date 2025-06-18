import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown';
import { Avatar } from '@heroui/avatar';
import { useDisclosure } from '@heroui/modal';
import { SETTINGS_ICON, SIGN_OUT_ICON } from './ui/Icons';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { addToast } from '@heroui/toast';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';

export default function UserDropdown({ user }: { user: User | null }) {
  const disclosure = useDisclosure();
  const navigate = useNavigate();
  const { signOut: authSignOut } = useAuthStore();
  const { confirm } = useConfirmationModal();

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
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      addToast({ title: 'Sign out failed', description: errorMessage, color: 'danger' });
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <Dropdown
        classNames={{ content: 'blur-bg backdrop-blur-2xl' }}
        backdrop='opaque'
        radius='sm'
        placement='bottom-end'
      >
        <DropdownTrigger>
          <Avatar
            src={user.image || ''}
            isBordered
            classNames={{
              base: 'bg-transparent',
              icon: 'text-Primary-100',
            }}
            color='secondary'
            size='sm'
            showFallback
            as='button'
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label='User Actions'
          variant='faded'
          itemClasses={{
            base: [
              'rounded-md',
              'border-none',
              'text-default-500',
              'data-[hover=true]:text-foreground data-[disabled=true]:opacity-100',
            ],
          }}
          disabledKeys={['profile']}
          onAction={(key) => {
            if (key === 'sign out') {
              if (user.preferences?.signOutConfirmation === 'disabled') signOut();
              else disclosure.onOpen();
            }
          }}
        >
          <DropdownSection showDivider>
            <DropdownItem key='profile' className='cursor-auto data-[hover=true]:bg-transparent'>
              <h5 className='text-Primary-100 text-base font-bold'>{user.name}</h5>
              <h6 className='text-Primary-200 font-medium'>{user.email}</h6>
            </DropdownItem>
          </DropdownSection>
          <DropdownItem
            key='settings'
            href='/settings'
            className='data-[hover=true]:bg-black/20'
            startContent={SETTINGS_ICON}
          >
            Settings
          </DropdownItem>
          <DropdownItem
            key='sign out'
            color='danger'
            variant='solid'
            className='data-[focus-visible=true]:ring-danger-700'
            startContent={SIGN_OUT_ICON}
          >
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
