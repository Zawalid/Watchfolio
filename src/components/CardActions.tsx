import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/dropdown';
import { useDisclosure } from '@heroui/modal';
import AddToList from './AddToList';
import { ADD_TO_LIST_ICON, FAVORITE_ICON, SIGN_OUT_ICON, WATCHLIST_ADDED_ICON, WATCHLIST_ICON } from './ui/Icons';
import ConfirmationModal from './ConfirmationModal';
import { actionToast } from '@/utils';
import { Link } from 'react-router';

type Props = {
  media: Movie | TvShow;
  isAdded: boolean;
  user: User | null;
};

export default function CardActions({ media, isAdded, user }: Props) {
  const confirmationDisclosure = useDisclosure();
  const listDisclosure = useDisclosure();

  const title = (media as Movie).title || (media as TvShow).name;

  const remove = async (confirmation?: 'enabled' | 'disabled') => {
    // Mock implementation - would be replaced with actual API call
    actionToast(
      async () => {
        return new Promise((resolve) => setTimeout(resolve, 500));
      },
      'Removing from watchlist...',
      `"${title}" was removed from your watchlist`,
      'Failed to remove the item. Please try again'
    );
  };

  const toggle = async () => {
    if (isAdded) {
      if (user?.preferences?.removeFromWatchlistConfirmation === 'DISABLED') remove();
      else confirmationDisclosure.onOpen();
      return;
    }

    // Mock implementation - would be replaced with actual API call
    actionToast(
      async () => {
        return new Promise((resolve) => setTimeout(resolve, 500));
      },
      'Adding to watchlist...',
      `"${title}" was add to your watchlist`,
      'Failed to add the item. Please try again'
    );
  };

  return (
    <>
      <Dropdown classNames={{ content: 'blur-bg  backdrop-blur-2xl' }} backdrop='opaque' radius='sm'>
        <DropdownTrigger>
          <button className='absolute right-2 top-2 z-10 grid size-7 place-content-center rounded-full border border-Grey-600 bg-Grey-900 text-white shadow-md transition-transform duration-300 hover:scale-110'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z'
              />
            </svg>
          </button>
        </DropdownTrigger>
        {user ? (
          <DropdownMenu
            variant='faded'
            aria-label='Card actions'
            itemClasses={{
              base: [
                'rounded-md',
                'border-none',
                'text-default-500',
                'data-[hover=true]:text-foreground',
                'data-[hover=true]:bg-Primary-500',
                'data-[selectable=true]:focus:bg-Primary-500',
                'data-[focus-visible=true]:ring-Primary-700',
              ],
            }}
            onAction={(key) => {
              if (key === 'watchlist') toggle();
              if (key === 'add_to_list') listDisclosure.onOpen();
            }}
          >
            <DropdownItem key='watchlist' startContent={isAdded ? WATCHLIST_ADDED_ICON : WATCHLIST_ICON}>
              {isAdded ? 'In your watchlist' : 'Add to watchlist'}
            </DropdownItem>
            <DropdownItem key='add_to_list' startContent={ADD_TO_LIST_ICON}>
              Add to list
            </DropdownItem>
            <DropdownItem key='favorite' startContent={FAVORITE_ICON}>
              Favorite
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <Unauthenticated />
        )}
      </Dropdown>
      {user && (
        <>
          <AddToList disclosure={listDisclosure} />
          <ConfirmationModal
            disclosure={confirmationDisclosure}
            icon={SIGN_OUT_ICON}
            heading='Remove Item'
            message={`Are you sure you want to remove "${title}" from your watchlist?`}
            confirmText='Remove'
            action={async (confirmation) => await remove(confirmation)}
          />
        </>
      )}
    </>
  );
}

function Unauthenticated() {
  return (
    <DropdownMenu
      disabledKeys={['signin', 'signup']}
      itemClasses={{
        base: 'data-[disabled="true"]:opacity-100 py-1 data-[disabled="true"]:cursor-auto data-[disabled="true"]:pointer-events-auto',
      }}
    >
      <DropdownSection showDivider>
        <DropdownItem key='signin'>
          <p className='mb-1 text-Grey-100'>Want add this item to a list?</p>
          <Link to='/signin' className='text-Primary-400 transition-colors duration-200 hover:text-Primary-500'>
            Sign in
          </Link>
        </DropdownItem>
      </DropdownSection>
      <DropdownItem key='signup'>
        <p className='mb-1 text-Grey-100'>Not a member?</p>
        <Link to='/signup' className='text-Primary-400 transition-colors duration-200 hover:text-Primary-500'>
          Sign up and join the community
        </Link>
      </DropdownItem>
    </DropdownMenu>
  );
}
