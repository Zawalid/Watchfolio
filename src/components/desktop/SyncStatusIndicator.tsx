import { useSyncStore, type SyncStatus } from '@/stores/useSyncStore';
import { Cloud, CloudOff, Loader2, AlertCircle } from 'lucide-react';
import { isDesktop } from '@/lib/platform';
import { Tooltip } from '@heroui/react';

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

  if (!isDesktop()) return null;

  const config = statusConfig[syncStatus];
  const Icon = config.icon;

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

  return (
    <Tooltip
      content={
        <div className="px-2 py-1">
          <p className="text-xs font-medium text-white">{config.label}</p>
          <p className="text-xs text-Grey-300">Last sync: {formatLastSync()}</p>
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
        <Icon className={`size-3.5 ${config.color} ${config.spin ? 'animate-spin' : ''}`} />
      </div>
    </Tooltip>
  );
}
