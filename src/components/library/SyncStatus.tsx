import { Tooltip } from '@heroui/react';
import { WifiOff, RefreshCw, AlertCircle, Check, CloudOff } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSyncStore } from '@/stores/useSyncStore';
import { cn } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';

export function SyncStatus({ className }: { className?: string }) {
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
      case 'syncing':
      case 'connecting':
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
          icon: <Check className='size-4' />,
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

  return (
    <Tooltip content={statusInfo.tooltip} className='tooltip-secondary!'>
      <div
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
      </div>
    </Tooltip>
  );
}
