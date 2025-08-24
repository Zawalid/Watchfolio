import { motion } from 'framer-motion';
import { Cloud, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSessions } from './DeviceManager';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { cn, formatDistanceToNow } from '@/utils';
import { Button } from '@heroui/react';

export default function SyncStatusWidget() {
  const { syncStatus, lastSyncTime } = useLibraryStore();
  const { data: activeSessions = [], isLoading, isError, refetch } = useSessions();

  const isSynced = syncStatus === 'online' || syncStatus === 'syncing';

  const lastSyncText = lastSyncTime
    ? `Last sync: ${formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true })}`
    : 'Syncing now...';

  const renderDeviceList = () => {
    if (isLoading)
      return [...Array(3)].map((_, i) => (
        <div
          key={i}
          className='flex flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-center'
        >
          <div className='mt-1 h-4 w-20 animate-pulse rounded bg-gray-700'></div>
          <div className='h-3 w-12 animate-pulse rounded bg-gray-700'></div>
        </div>
      ));

    if (isError) return <ErrorState onRetry={refetch} />;

    if (activeSessions.length === 0) {
      return <div className='col-span-full py-4 text-center text-sm text-gray-400'>No active devices found.</div>;
    }

    return activeSessions.map((session, i) => (
      <motion.div
        key={session.$id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 + i * 0.1 }}
        className='flex flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-center'
      >
        <p className='mt-1 truncate text-sm font-medium text-white capitalize'>{session.deviceName}</p>
        <div className='text-Success-400 flex items-center justify-center gap-1.5 text-xs'>
          <div className='h-1.5 w-1.5 rounded-full bg-green-400'></div>
          <span>Online</span>
        </div>
      </motion.div>
    ));
  };

  return (
    <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-4'>
      <div className='flex items-center justify-between rounded-lg bg-white/5 p-4'>
        <div className='flex items-center gap-4'>
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b',
              isSynced ? 'from-Secondary-500/40 to-Primary-500/40' : 'from-gray-600/40 to-gray-800/40'
            )}
          >
            <Cloud className={cn('h-6 w-6', isSynced ? 'text-Secondary-300' : 'text-gray-400')} />
          </div>
          <div>
            <p className='font-semibold text-white'>Library Sync Status</p>
            <p className='text-xs text-gray-400'>{lastSyncText}</p>
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs',
            isSynced ? 'bg-Success-500/20 text-Success-400' : 'bg-gray-500/20 text-gray-300'
          )}
        >
          <CheckCircle className='size-3.5' />
          <span>{isSynced ? 'Synced' : 'Offline'}</span>
        </div>
      </div>

      <div className={cn('grid gap-3', `grid-cols-${Math.min(4, isLoading ? 3 : activeSessions.length)}`)}>{renderDeviceList()}</div>
    </div>
  );
}

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center'>
    <AlertTriangle className='size-5 text-red-400' />
    <p className='text-sm font-medium text-red-300'>Could not load devices</p>
    <Button size='sm' color='danger' variant='light' onPress={onRetry}>
      Retry
    </Button>
  </div>
);
