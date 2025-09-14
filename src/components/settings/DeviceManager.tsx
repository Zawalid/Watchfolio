import { Models } from 'appwrite';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, addToast } from '@heroui/react';
import { Smartphone, Laptop, Tablet, HelpCircle, LogOut, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from '@/utils';
import { authService } from '@/lib/auth';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';

const BROWSERS_IMAGES = [
  { name: 'Chrome', image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/chrome/chrome.png' },
  { name: 'Firefox', image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/firefox/firefox.png' },
  { name: 'Yandex', image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/yandex/yandex.png' },
  { name: 'Safari', image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/safari/safari.png' },
  { name: 'Brave', image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/brave/brave.png' },
  { name: 'Edge', image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/edge/edge.png' },
  { name: 'Opera', image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/opera/opera.png' },
];

// eslint-disable-next-line react-refresh/only-export-components
export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      return await authService.getActiveSessions();
    },
  });
};

const getDeviceRepresentation = (session: Models.Session) => {
  const browser = BROWSERS_IMAGES.find((b) => session.clientName.toLowerCase().includes(b.name.toLowerCase()));
  if (browser) {
    return <img src={browser.image} alt={browser.name} className='xs:size-7 mobile:size-8 size-6' />;
  }

  const lowerDevice = session.deviceName.toLowerCase();
  const lowerOs = session.osName.toLowerCase();

  if (lowerOs.includes('android') || lowerOs.includes('ios') || lowerDevice.includes('mobile'))
    return <Smartphone className='xs:size-7 mobile:size-8 size-6 text-gray-300' />;
  if (
    lowerDevice.includes('mac') ||
    lowerDevice.includes('windows') ||
    lowerDevice.includes('linux') ||
    lowerDevice.includes('desktop')
  )
    return <Laptop className='xs:size-7 mobile:size-8 size-6 text-gray-300' />;
  if (lowerDevice.includes('ipad') || lowerDevice.includes('tablet'))
    return <Tablet className='xs:size-7 mobile:size-8 size-6 text-gray-300' />;

  return <HelpCircle className='xs:size-7 mobile:size-8 size-6 text-gray-400' />;
};

export default function DeviceManager() {
  const { confirm } = useConfirmationModal();
  const { data: activeSessions = [], isLoading, isError, refetch } = useSessions();

  const handleSignOut = async (sessionId: string, deviceName: string) => {
    const confirmed = await confirm({
      title: 'Confirm Sign Out',
      message: `Are you sure you want to sign out of ${deviceName}?`,
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await authService.deleteSession(sessionId);
        refetch();
        addToast({
          title: 'Device Signed Out',
          description: `Successfully signed out of ${deviceName}.`,
          color: 'success',
        });
      } catch {
        addToast({ title: 'Error', description: 'Failed to sign out device. Please try again.', color: 'danger' });
      }
    }
  };

  const handleSignOutAll = async () => {
    const confirmed = await confirm({
      title: 'Confirm Sign Out',
      message: 'Are you sure you want to sign out of all other devices?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await authService.deleteOtherSessions();
        refetch();
        addToast({
          title: 'All Other Devices Signed Out',
          description: 'You have been signed out of all other sessions.',
          color: 'success',
        });
      } catch {
        addToast({ title: 'Error', description: 'Failed to sign out other devices.', color: 'danger' });
      }
    }
  };

  const renderContent = () => {
    if (isLoading) return [...Array(3)].map((_, i) => <DeviceSkeleton key={i} />);

    if (isError) return <ErrorState onRetry={refetch} />;

    return activeSessions.map((session) => (
      <motion.div
        key={session.$id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
        className='mobile:flex-row mobile:items-center mobile:gap-4 mobile:p-4 flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/[0.07]'
      >
        <div className='xs:gap-4 flex flex-1 items-center gap-3'>
          <div className='xs:size-12 flex size-10 items-center justify-center rounded-full bg-white/5'>
            {getDeviceRepresentation(session)}
          </div>
          <div className='min-w-0 flex-1'>
            <div className='xs:flex-row xs:items-center xs:gap-2 flex flex-col gap-1'>
              <p className='xs:text-base truncate text-sm font-semibold text-white capitalize'>
                {session.deviceName} ({session.clientName})
              </p>
              {session.current && (
                <span className='xs:px-2 xs:py-0.5 flex w-fit items-center gap-1 rounded-full bg-green-500/10 px-1.5 py-0.5 text-xs text-green-400'>
                  <CheckCircle className='xs:size-3 size-2.5' />
                  Current 
                </span>
              )}
            </div>
            <p className='xs:text-sm text-xs text-gray-400'>
              {session.osName} {session.osVersion}
            </p>
            <p className='xs:mt-1 xs:text-xs mt-0.5 text-xs font-medium text-gray-500'>
              Signed In {formatDistanceToNow(new Date(session.$updatedAt), { addSuffix: true })} • IP: {session.ip} (
              {session.countryName})
            </p>
          </div>
        </div>
        {!session.current && (
          <Button
            size='sm'
            color='danger'
            variant='ghost'
            onPress={() => handleSignOut(session.$id, session.deviceName)}
            startContent={<LogOut className='xs:size-4 size-3' />}
            className='xs:w-auto w-full'
          >
            Sign Out
          </Button>
        )}
      </motion.div>
    ));
  };

  return (
    <div className='xs:gap-4 flex flex-col gap-3'>
      <div className='xs:flex-row xs:items-center xs:justify-between xs:gap-4 flex flex-col gap-2'>
        <h3 className='xs:text-lg text-base font-semibold text-white'>Active Sessions</h3>
        {!isLoading && !isError && activeSessions.length > 1 && (
          <Button
            size='sm'
            color='danger'
            onPress={handleSignOutAll}
            startContent={<ShieldAlert className='xs:size-4 size-3' />}
            className='xs:w-auto w-full'
          >
            Sign Out All Other Devices
          </Button>
        )}
      </div>
      <div className='xs:gap-3 flex flex-col gap-2'>
        <AnimatePresence>{renderContent()}</AnimatePresence>
      </div>
    </div>
  );
}

const DeviceSkeleton = () => (
  <div className='xs:flex-row xs:items-center xs:gap-4 xs:p-4 flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-3'>
    <div className='xs:gap-4 flex items-center gap-3'>
      <div className='xs:size-12 size-10 animate-pulse rounded-full bg-gray-700'></div>
      <div className='xs:space-y-2 flex-1 space-y-1'>
        <div className='xs:h-4 xs:w-1/3 h-3 w-2/3 animate-pulse rounded bg-gray-700'></div>
        <div className='xs:h-3 xs:w-2/3 h-2.5 w-1/2 animate-pulse rounded bg-gray-700'></div>
        <div className='xs:h-2.5 xs:w-1/2 h-2 w-3/4 animate-pulse rounded bg-gray-700'></div>
      </div>
    </div>
    <div className='xs:h-8 xs:w-24 h-7 w-20 animate-pulse rounded bg-gray-700'></div>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className='xs:gap-4 xs:p-6 mobile:p-8 flex flex-col items-center justify-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center'
  >
    <div className='xs:p-3 rounded-full border border-red-500/20 bg-red-500/10 p-2'>
      <AlertTriangle className='xs:size-6 size-5 text-red-400' />
    </div>
    <div className='space-y-1'>
      <h4 className='xs:text-base text-sm font-semibold text-red-300'>Could Not Load Devices</h4>
      <p className='xs:text-sm text-xs text-gray-400'>An error occurred while fetching your active sessions.</p>
    </div>
    <Button color='danger' variant='light' onPress={onRetry} className='xs:w-auto w-full'>
      Try Again
    </Button>
  </motion.div>
);
