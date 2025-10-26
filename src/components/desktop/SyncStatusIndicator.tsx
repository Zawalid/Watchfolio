import { useSyncStore, type SyncStatus } from '@/stores/useSyncStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Cloud, CloudOff, Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { isDesktop } from '@/lib/platform';
import { Tooltip } from '@heroui/react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const statusConfig: Record<SyncStatus, { icon: typeof Cloud; color: string; label: string; spin?: boolean }> = {
  offline: { icon: CloudOff, color: 'text-Grey-400', label: 'Offline' },
  connecting: { icon: Loader2, color: 'text-Secondary-400', label: 'Connecting...', spin: true },
  online: { icon: Cloud, color: 'text-[#05ce91]', label: 'Connected' },
  syncing: { icon: Loader2, color: 'text-Primary-400', label: 'Syncing...', spin: true },
  error: { icon: AlertCircle, color: 'text-[#ff6161]', label: 'Sync error' },
};

export function SyncStatusIndicator() {
  const syncStatus = useSyncStore((state) => state.syncStatus);
  const lastSyncTime = useSyncStore((state) => state.lastSyncTime);
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const isOnline = useNetworkStatus();

  if (!isDesktop()) return null;

  // Check authentication first
  if (!isAuthenticated) {
    return (
      <Tooltip
        content={
          <div className="px-2 py-1">
            <p className="text-xs font-medium text-white">Sign in to sync</p>
            <p className="text-xs text-Grey-300">Click to sign in</p>
          </div>
        }
        placement="bottom"
        delay={500}
        closeDelay={0}
        classNames={{
          content: 'bg-Grey-800/95 backdrop-blur-xl border border-white/10',
        }}
      >
        <button
          onClick={() => openAuthModal('signin')}
          className="flex items-center px-3 h-8 pointer-events-auto border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <CloudOff className="size-3.5 text-Grey-400" />
        </button>
      </Tooltip>
    );
  }

  // Override sync status if actually offline
  const actualStatus = !isOnline ? 'offline' : syncStatus;
  const config = statusConfig[actualStatus];
  const Icon = !isOnline ? WifiOff : config.icon;

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never synced';
    const date = new Date(lastSyncTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getLabel = () => {
    if (!isOnline) return 'No Internet Connection';
    return config.label;
  };

  return (
    <Tooltip
      content={
        <div className="px-2 py-1">
          <p className="text-xs font-medium text-white">{getLabel()}</p>
          {isOnline && <p className="text-xs text-Grey-300">Last sync: {formatLastSync()}</p>}
        </div>
      }
      placement="bottom"
      delay={500}
      closeDelay={0}
      classNames={{
        content: 'bg-Grey-800/95 backdrop-blur-xl border border-white/10',
      }}
    >
      <div className="flex items-center px-3 h-8 pointer-events-auto border-r border-white/5" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <Icon className={`size-3.5 ${!isOnline ? 'text-warning' : config.color} ${config.spin && isOnline ? 'animate-spin' : ''}`} />
      </div>
    </Tooltip>
  );
}
