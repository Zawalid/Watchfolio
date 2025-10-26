import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useSyncStore } from '@/stores/useSyncStore';

export function OfflineBanner() {
  const isOnline = useNetworkStatus();
  const { pendingChanges } = useSyncStore();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-warning/20 bg-warning/10 px-3 py-2 text-xs font-medium text-warning shadow-lg backdrop-blur-md"
        >
          <WifiOff className="h-3.5 w-3.5" />
          <span>
            Offline{pendingChanges > 0 && ` • ${pendingChanges} pending`}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OnlineToast() {
  const isOnline = useNetworkStatus();
  const [showToast, setShowToast] = useState(false);
  const prevOnlineRef = useRef(isOnline);

  useEffect(() => {
    // Only show toast when transitioning from offline to online
    if (!prevOnlineRef.current && isOnline) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-2 text-xs font-medium text-success shadow-lg backdrop-blur-md"
        >
          <Wifi className="h-3.5 w-3.5" />
          <span>Back online</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
