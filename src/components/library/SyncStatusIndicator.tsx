import { Tooltip } from '@heroui/react';
import { WifiOff, RefreshCw, AlertCircle, CloudCheck, CloudOff } from '@/components/ui/Icons';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSyncStore } from '@/stores/useSyncStore';
import { cn, formatTimeAgo } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';

export function SyncStatusIndicator({ className, asPill }: { className?: string; asPill?: boolean }) {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { syncStatus, lastSyncTime, manualSync } = useSyncStore();
  const queryClient = useQueryClient();
  const isOnline = navigator.onLine;

  const getStatusInfo = () => {
    if (!isAuthenticated) {
      return {
        color: 'text-gray-400',
        icon: <CloudOff className='size-4' />,
        text: 'Sign in to sync',
        tooltip: 'Sign in to sync your library across devices',
        onClick: () => openAuthModal('signin'),
      };
    }

    if (!isOnline) {
      return {
        color: 'text-gray-400',
        icon: <WifiOff className='size-4' />,
        text: 'Offline',
        tooltip: 'You are offline. Sync will resume when connection is restored.',
        onClick: null,
      };
    }

    switch (syncStatus) {
      case 'error':
        return {
          color: 'text-red-400',
          icon: <AlertCircle className='size-4' />,
          text: 'Sync Error',
          tooltip: 'Sync error occurred. Click to retry.',
          onClick: () => manualSync(),
        };
      case 'connecting':
        return {
          color: 'text-yellow-400',
          icon: <RefreshCw className='size-4 animate-spin' />,
          text: 'Connecting...',
        };
      case 'syncing':
        return {
          color: 'text-blue-400',
          icon: <RefreshCw className='size-4 animate-spin' />,
          text: 'Syncing...',
          tooltip: 'Sync in progress...',
          onClick: null,
        };
      case 'online':
        return {
          color: 'text-green-400',
          icon: <CloudCheck className='size-4' />,
          text: 'Synced',
          tooltip: lastSyncTime
            ? `Last synced: ${new Date(lastSyncTime).toLocaleString()}`
            : 'Your library is up to date.',
          onClick: () => manualSync(),
        };
      case 'offline':
      default:
        return {
          color: 'text-gray-400',
          icon: <CloudOff className='size-4' />,
          text: 'Sync Offline',
          tooltip: 'Sync is currently offline. Click to sync.',
          onClick: () => manualSync(),
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (asPill) {
    return (
      <Tooltip content={statusInfo.tooltip} className='tooltip-secondary!'>
        <button
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-1 text-xs font-medium transition-colors duration-200',
            statusInfo.color,
            statusInfo.onClick ? 'cursor-pointer hover:bg-white/10' : 'cursor-default',
            className
          )}
          onClick={() => {
            if (statusInfo.onClick) statusInfo.onClick();
            queryClient.invalidateQueries({ queryKey: ['library'] });
          }}
        >
          {statusInfo.icon}
          <span>{statusInfo.text}</span>
        </button>
      </Tooltip>
    );
  }

  return (
    <button
      className={cn(
        'group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2 transition-all duration-200 hover:scale-[1.02] hover:bg-white/5',
        className
      )}
      onClick={manualSync}
      disabled={syncStatus === 'syncing'}
    >
      <div className='flex items-center gap-3'>
        <div className={`relative flex items-center justify-center [&>svg]:size-5 ${statusInfo.color}`}>
          {statusInfo.icon}
          {syncStatus === 'syncing' && (
            <div className='border-t-Secondary-400 absolute inset-0 animate-spin rounded-full border-2 border-transparent' />
          )}
        </div>
        <div className='flex flex-col items-start'>
          <span className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
          {lastSyncTime && <span className='text-Grey-500 text-xs font-medium'>{formatTimeAgo(lastSyncTime)}</span>}
        </div>
      </div>

      {syncStatus !== 'syncing' && (
        <div className='opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
          <div className='bg-Primary-400 h-2 w-2 rounded-full' />
        </div>
      )}
    </button>
  );
}
