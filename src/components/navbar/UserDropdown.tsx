import { Avatar } from '@heroui/react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { ChevronDownIcon, UserIcon, Settings, LibraryBig, Heart, LogOut, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { ShortcutKey } from '../ui/ShortcutKey';
import { UserInfoSection, SignInSection, SyncIndicatorSection } from './Shared';
import { useSignOut, getAvatarUrl, isActive } from './utils';
import { AVATAR_CLASSNAMES, DROPDOWN_CLASSNAMES } from '@/styles/heroui';

export default function UserDropdown() {
  const { user } = useAuthStore();
  const { signOut } = useSignOut();

  const isAuthenticated = !!user;
  const avatarUrl = getAvatarUrl(user, isAuthenticated);
  const firstName = isAuthenticated ? user?.name.split(' ')[0] : 'Guest';

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
        disabledKeys={['user-info', 'sync']}
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
          <UserInfoSection  size='lg' />
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
        {isAuthenticated ? (
          <DropdownSection classNames={{ group: 'border-t border-white/10 pt-2' }}>
            <DropdownItem
              key='sync'
              className='cursor-auto data-[disabled=true]:pointer-events-auto data-[disabled=true]:opacity-100'
            >
              <SyncIndicatorSection />
            </DropdownItem>
          </DropdownSection>
        ) : null}
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
