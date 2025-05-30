import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown';
import { Avatar } from '@heroui/avatar';
import { useDisclosure } from '@heroui/modal';
import { SETTINGS_ICON, SIGN_OUT_ICON } from './ui/Icons';
import ConfirmationModal from './ConfirmationModal';
import { useNavigate } from 'react-router';

export default function UserDropdown({ user }: { user: User | null }) {
  const disclosure = useDisclosure();
  const navigate = useNavigate();

  if (!user) return null;

  const signOut = async (confirmation?: 'enabled' | 'disabled') => {
    // Mock implementation - would be replaced with actual API call
    console.log(confirmation)
    const mockSignOut = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          localStorage.removeItem('user'); // Example implementation
          resolve();
        }, 500);
      });
    };

    try {
      await mockSignOut();
      navigate('/signin');
    } catch (error) {
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
              if (user.preferences?.signOutConfirmation === 'DISABLED') signOut();
              else disclosure.onOpen();
            }
          }}
        >
          <DropdownSection showDivider>
            <DropdownItem key='profile' className='cursor-auto data-[hover=true]:bg-transparent'>
              <h5 className='text-base font-bold text-Primary-100'>{user.name}</h5>
              <h6 className='font-medium text-Primary-200'>{user.email}</h6>
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
      <ConfirmationModal
        disclosure={disclosure}
        icon={SIGN_OUT_ICON}
        heading='Sign Out'
        message='Are you sure you want to sign out?'
        confirmText='Sign Out'
        action={signOut}
      />
    </>
  );
}
