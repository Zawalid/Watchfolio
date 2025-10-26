import { motion } from 'framer-motion';
import { Cloud, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSessions } from './DeviceManager';
import { useSyncStore } from '@/stores/useSyncStore';
import { cn, formatDistanceToNow } from '@/utils';
import { Button } from '@heroui/react';

export default function SyncStatusWidget() {
  const { syncStatus, lastSyncTime } = useSyncStore();
  const { data: activeSessions = [], isLoading, isError, refetch } = useSessions();

  const isSynced = syncStatus === 'online' || syncStatus === 'syncing';

  const lastSyncText = lastSyncTime
    ? `Last sync: ${formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true })}`
    : 'Synced';

  const renderDeviceList = () => {
    if (isLoading)
      return [...Array(3)].map((_, i) => (
        <div
          key={i}
          className='sm:gap-2 sm:p-3 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 p-2 text-center'
        >
          <div className='sm:h-4 sm:w-20 mt-1 h-3 w-16 animate-pulse rounded bg-gray-700'></div>
          <div className='sm:h-3 sm:w-12 h-2.5 w-10 animate-pulse rounded bg-gray-700'></div>
        </div>
      ));

    if (isError) return <ErrorState onRetry={refetch} />;

    if (activeSessions.length === 0) {
      return (
        <div className='sm:py-4 sm:text-sm col-span-full py-3 text-center text-xs text-gray-400'>
          No active devices found.
        </div>
      );
    }

    return activeSessions.map((session, i) => (
      <motion.div
        key={session.$id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 + i * 0.1 }}
        className='sm:gap-2 sm:p-3 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 p-2 text-center'
      >
        <p className='sm:text-sm mt-1 truncate text-xs font-medium text-white capitalize'>{session.deviceName}</p>
        <div className='text-Success-400 sm:gap-1.5 flex items-center justify-center gap-1 text-xs'>
          <div className='sm:h-1.5 sm:w-1.5 h-1 w-1 rounded-full bg-green-400'></div>
          <span>Online</span>
        </div>
      </motion.div>
    ));
  };

  return (
    <div className='sm:space-y-4 sm:p-4 space-y-3 rounded-xl border border-white/10 bg-white/5 p-3'>
      <div className='xs:flex-row xs:justify-between xs:items-center sm:gap-4 sm:p-4 flex flex-col gap-3 rounded-lg bg-white/5 p-3'>
        <div className='sm:gap-4 flex items-center gap-3'>
          <div
            className={cn(
              'sm:h-12 sm:w-12 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b',
              isSynced ? 'from-Secondary-500/40 to-Primary-500/40' : 'from-gray-600/40 to-gray-800/40'
            )}
          >
            <Cloud className={cn('sm:h-6 sm:w-6 h-5 w-5', isSynced ? 'text-Secondary-300' : 'text-gray-400')} />
          </div>
          <div className='flex-1'>
            <p className='sm:text-base text-sm font-semibold text-white'>Library Sync Status</p>
            <p className='sm:text-sm text-xs text-gray-400'>{lastSyncText}</p>
          </div>
        </div>
        <div
          className={cn(
            'sm:px-3 sm:text-sm flex w-full items-center justify-center xs:w-fit gap-1.5 rounded-full px-2 py-1 text-xs',
            isSynced ? 'bg-Success-500/20 text-Success-400' : 'bg-gray-500/20 text-gray-300'
          )}
        >
          <CheckCircle className='sm:size-3.5 size-3' />
          <span>{isSynced ? 'Synced' : 'Offline'}</span>
        </div>
      </div>

      <div
        className={cn('sm:gap-3 grid gap-2', {
          'grid-cols-1': activeSessions.length === 1,
          'grid-cols-2': activeSessions.length === 2,
          'grid-cols-3': activeSessions.length >= 3,
        },
        'max-mobile:grid-cols-2'
      )}
      >
        {renderDeviceList()}
      </div>
    </div>
  );
}

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className='sm:gap-3 sm:p-4 flex flex-col items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center'>
    <AlertTriangle className='sm:size-5 size-4 text-red-400' />
    <p className='sm:text-sm text-xs font-medium text-red-300'>Could not load devices</p>
    <Button size='sm' color='danger' variant='light' onPress={onRetry} className='sm:w-auto w-full'>
      Retry
    </Button>
  </div>
);
