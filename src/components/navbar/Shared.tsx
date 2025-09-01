import { Avatar, Button } from '@heroui/react';
import { RefreshCw, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { AVATAR_CLASSNAMES } from '@/styles/heroui';
import { SIGN_IN_ICON } from '../ui/Icons';
import { useSyncStore } from '@/stores/useSyncStore';
import { formatTimeAgo } from '@/utils';
import { getAvatarUrl, getJoinDate } from './utils';

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

export const SyncIndicatorSection = () => {
  const { lastSyncTime, manualSync, syncStatus } = useSyncStore();
  return (
    <button className='flex w-full items-center justify-between gap-2' onClick={manualSync}>
      <div className='flex items-center gap-2'>
        <RefreshCw className={'size-4' + (syncStatus === 'syncing' ? ' animate-spin text-blue-400' : '')} />
        <span className={syncStatus === 'syncing' ? 'text-blue-400' : ''}>
          {syncStatus === 'syncing' ? 'Syncing' : 'Sync'}
        </span>
      </div>
      {lastSyncTime && <span className='text-Grey-500'>{formatTimeAgo(lastSyncTime)}</span>}
    </button>
  );
};
