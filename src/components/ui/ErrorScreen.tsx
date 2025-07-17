import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle, Zap, Code2 } from 'lucide-react';
import { AnimatedRing } from './AnimatedRing';

interface ErrorScreenProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
    },
  },
};

export function ErrorScreen({ error, resetErrorBoundary }: ErrorScreenProps) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(import.meta.env.DEV);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleGoHome = () => {
    navigate('/');
    resetErrorBoundary();
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate retry delay
    setIsRetrying(false);
    resetErrorBoundary();
  };
  return (
    <div className='blur-bg relative flex min-h-dvh items-center justify-center overflow-auto py-12'>
      <div className='relative z-10 container'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='flex min-h-[500px] flex-1 flex-col items-center justify-center gap-8 text-center'
        >
          {/* Main error icon with animated rings */}
          <motion.div variants={itemVariants} className='relative'>
            <AnimatedRing
              color='error'
              size='lg'
              ringCount={2}
              animationSpeed='normal'
              glowEffect={true}
              floatingIcons={[
                {
                  icon: <Zap className='h-4 w-4' />,
                  position: 'top-right',
                  color: 'warning',
                  delay: 0,
                },
                {
                  icon: <Code2 className='h-4 w-4' />,
                  position: 'bottom-left',
                  color: 'secondary',
                  delay: 1,
                },
                {
                  icon: <RefreshCw className='h-4 w-4' />,
                  position: 'top-left',
                  color: 'primary',
                  delay: 2,
                },
              ]}
            >
              <AlertTriangle className='text-Error-400 h-16 w-16' />
            </AnimatedRing>
          </motion.div>
          {/* Title and description */}
          <motion.div variants={itemVariants} className='max-w-2xl space-y-4'>
            <motion.h2
              className='text-Grey-50 from-Grey-50 to-Grey-200 bg-gradient-to-r bg-clip-text text-2xl font-bold sm:text-3xl'
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              Houston, we have a problem!
            </motion.h2>
            <motion.p variants={itemVariants} className='text-Grey-300 text-base leading-relaxed font-medium'>
              Something unexpected happened in the digital realm. Our team of developers has been notified and they're
              working on it faster than you can say "debug"!
            </motion.p>
          </motion.div>

          {/* Error details (dev only) */}
          <AnimatePresence>
            {import.meta.env.DEV && (
              <motion.div variants={itemVariants} className='w-full max-w-3xl'>
                <motion.button
                  onClick={() => setShowDetails(!showDetails)}
                  className='pill-bg text-Grey-300 hover:text-Grey-100 mx-auto mb-4 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:bg-white/10'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Code2 className='h-4 w-4' />
                  {showDetails ? 'Hide' : 'Show'} Error Details
                </motion.button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className='pill-bg overflow-hidden'
                    >
                      <div className='p-6 text-left'>
                        <h3 className='text-Grey-50 mb-3 text-sm font-semibold tracking-wider uppercase'>
                          🐛 Error Details (Development Mode)
                        </h3>
                        <div className='bg-Error-950/50 border-Error-800/30 rounded-lg border p-4'>
                          <pre className='text-Error-400 max-h-40 overflow-auto font-mono text-xs leading-relaxed'>
                            {error.message}
                            {error.stack && '\n\nStack Trace:\n' + error.stack}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <motion.div variants={itemVariants} className='grid w-full max-w-md gap-4 sm:grid-cols-2'>
            <Button
              onPress={handleRetry}
              color='primary'
              isLoading={isRetrying}
              startContent={!isRetrying && <RefreshCw className='h-4 w-4' />}
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>

            <Button
              onPress={handleGoHome}
              variant='bordered'
              className='button-secondary! bg-transparent!'
              startContent={<Home className='h-4 w-4' />}
            >
              Go Home
            </Button>
          </motion.div>

          {/* Footer message */}
          <motion.div
            variants={itemVariants}
            className='mt-8 max-w-lg rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl'
          >
            <p className='text-Grey-400 text-sm leading-relaxed'>
              <span className='text-Grey-300 font-semibold'>Pro tip:</span> If this keeps happening, try refreshing the
              page or clearing your browser cache. Still stuck? Contact our support team – we're always happy to help!
              🚀
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
