import { Button, Progress } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationPreference } from '@/contexts/providers/AnimationProvider';

interface UpdateNotificationProps {
  updater: {
    updateAvailable: boolean;
    updateInfo: {
      version: string;
      currentVersion: string;
      date?: string;
      body?: string;
    } | null;
    downloading: boolean;
    downloadProgress: number;
    readyToInstall: boolean;
    downloadAndInstall: () => void;
    dismissUpdate: () => void;
  };
}

export function UpdateNotification({ updater }: UpdateNotificationProps) {
  const { isAnimationEnabled } = useAnimationPreference();

  const {
    updateAvailable,
    updateInfo,
    downloading,
    downloadProgress,
    readyToInstall,
    downloadAndInstall,
    dismissUpdate,
  } = updater;

  if (!updateAvailable || !updateInfo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={isAnimationEnabled ? { y: -100, opacity: 0 } : undefined}
        animate={isAnimationEnabled ? { y: 0, opacity: 1 } : undefined}
        exit={isAnimationEnabled ? { y: -100, opacity: 0 } : undefined}
        transition={{ duration: 0.3 }}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
      >
        <div className="mx-4 bg-blur backdrop-blur-xl border border-white/10 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">
                Update Available
              </h3>
              <p className="text-sm text-white/60 mt-1">
                Version {updateInfo.version} is ready to download
              </p>
              {updateInfo.body && (
                <p className="text-xs text-white/50 mt-2 line-clamp-2">
                  {updateInfo.body}
                </p>
              )}
            </div>

            <button
              onClick={dismissUpdate}
              className="text-white/40 hover:text-white/60 transition-colors"
              aria-label="Dismiss update notification"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {downloading && (
            <div className="mt-4">
              <Progress
                value={downloadProgress}
                className="w-full"
                color="primary"
                size="sm"
              />
              <p className="text-xs text-white/50 mt-2">
                Downloading... {Math.round(downloadProgress)}%
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            {readyToInstall ? (
              <Button
                onClick={downloadAndInstall}
                className="button-primary flex-1"
                size="sm"
              >
                Restart to Install
              </Button>
            ) : (
              <>
                <Button
                  onClick={downloadAndInstall}
                  className="button-primary flex-1"
                  size="sm"
                  isLoading={downloading}
                  isDisabled={downloading}
                >
                  {downloading ? 'Downloading...' : 'Download & Install'}
                </Button>
                <Button
                  onClick={dismissUpdate}
                  variant="flat"
                  size="sm"
                  className="text-white/60"
                >
                  Later
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
