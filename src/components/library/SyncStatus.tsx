// Clickable sync status component for library layout
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { WifiOff, RefreshCw, AlertCircle, Check, Upload, CloudOff } from 'lucide-react';
import { useSyncStatus, useLibrarySync } from '@/hooks/useLibrarySync';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { cn } from '@/utils';

export function SyncStatus({ className }: { className?: string }) {
  const { statusColor, isOnline, isSyncing, hasError, pendingOperations } = useSyncStatus();
  const { syncToCloud, syncFromCloud, clearError, lastSyncTime } = useLibrarySync();
  const { getAllItems } = useLibraryStore();
  const getIcon = () => {
    if (hasError) return <AlertCircle className='size-4' />;
    if (!isOnline) return <WifiOff className='size-4' />;
    if (isSyncing) return <RefreshCw className='size-4 animate-spin' />;
    if (pendingOperations > 0) return <Upload className='size-4' />;

    // Show CloudOff for new users who haven't synced yet
    if (!lastSyncTime) return <CloudOff className='size-4' />;

    return <Check className='size-4' />;
  };
  const getAction = () => {
    if (hasError) {
      return {
        onClick: () => {
          clearError();
          syncToCloud();
        },
        tooltip: 'Clear error and retry sync',
        text: 'Retry Sync',
      };
    }
    if (!isOnline) {
      return {
        onClick: null,
        tooltip: 'You are offline. Sync will resume when connection is restored.',
        text: 'Offline',
      };
    }

    if (isSyncing) {
      return {
        onClick: null,
        tooltip: 'Sync in progress...',
        text: 'Syncing...',
      };
    }

    if (pendingOperations > 0) {
      return {
        onClick: syncToCloud,
        tooltip: `Upload ${pendingOperations} pending changes to cloud`,
        text: `Sync ${pendingOperations} items`,
      };
    } // Check if this is a new user (never synced before)
    if (!lastSyncTime) {
      const localItems = getAllItems();

      // If user has local items but never synced, encourage them to sync to cloud
      if (localItems.length > 0) {
        return {
          onClick: syncToCloud,
          tooltip: `Upload your ${localItems.length} items to cloud`,
          text: `Sync ${localItems.length} items`,
        };
      }

      // New user with no items - show neutral state
      return {
        onClick: null,
        tooltip: 'New account - start adding items to your library to sync',
        text: 'Not synced',
      };
    }

    return {
      onClick: syncFromCloud,
      tooltip: 'Pull latest data from cloud',
      text: 'Pull from Cloud',
    };
  };
  const action = getAction();
  const isClickable = !!action.onClick;

  return (
    <Tooltip content={action.tooltip} className='tooltip-secondary'>
      <Button
        size='sm'
        className={cn(
          'flex items-center gap-2 bg-white/5 px-3 py-1 text-xs font-medium transition-colors duration-200',
          statusColor,
          isClickable ? 'cursor-pointer hover:bg-white/10' : 'cursor-default',
          className
        )}
        onPress={isClickable ? action.onClick : undefined}
        disabled={!isClickable}
      >
        {getIcon()}
        <span>{action.text}</span>
      </Button>
    </Tooltip>
  );
}
