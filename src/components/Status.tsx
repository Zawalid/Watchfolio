import { Button } from '@heroui/button';
import { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { AnimatedRing } from './ui/AnimatedRing';
import { SearchSlash, ListX, AlertTriangle, RotateCcw } from 'lucide-react';

export function NoResults({ children }: { children?: ReactNode }) {
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

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='flex min-h-[500px] flex-1 flex-col items-center justify-center gap-8 px-4 text-center'
    >
      {/* Clean AnimatedRing */}
      <motion.div variants={itemVariants}>
        <AnimatedRing
          color='secondary'
          size='md'
          ringCount={2}
          animationSpeed='normal'
          glowEffect={true}
          floatingIcons={[
            {
              icon: <ListX className='h-4 w-4' />,
              position: 'top-right',
              color: 'tertiary',
              delay: 0.5,
            },
          ]}
        >
          <SearchSlash className='text-Secondary-400 h-12 w-12' />
        </AnimatedRing>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants} className='space-y-4'>
        <h2 className='text-Grey-50 text-xxl font-semibold sm:text-2xl'>No matches found</h2>
        <p className='text-Grey-300 max-w-md font-medium'>
          We couldn't find any movies or TV shows matching your search. Try different keywords or explore trending
          content.
        </p>
      </motion.div>

      {children && <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
}

export function Error({
  children,
  message = 'Something went wrong',
  onRetry,
}: {
  children?: ReactNode;
  message?: string;
  onRetry?: () => void;
}) {
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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='flex min-h-[500px] flex-1 flex-col items-center justify-center gap-8 text-center'
    >
      <motion.div variants={itemVariants}>
        <AnimatedRing
          color='error'
          size='md'
          ringCount={3}
          animationSpeed='slow'
          glowEffect={true}
          floatingIcons={[
            {
              icon: <AlertTriangle className='h-4 w-4' />,
              position: 'top-center',
              color: 'warning',
              delay: 0,
            },
            {
              icon: <RotateCcw className='h-4 w-4' />,
              position: 'bottom-right',
              color: 'primary',
              delay: 1.5,
            },
          ]}
        >
          <motion.div variants={pulseVariants} animate='pulse' className='flex items-center justify-center'>
            <AlertTriangle className='h-12 w-12 text-red-400' />
          </motion.div>
        </AnimatedRing>
      </motion.div>

      <motion.h2 variants={itemVariants} className='text-Grey-50 text-xl font-semibold sm:text-2xl'>
        Oops! Something went wrong
      </motion.h2>

      <motion.p variants={itemVariants} className='text-Grey-300 max-w-md font-medium'>
        {message}
      </motion.p>

      <motion.div variants={itemVariants} className='flex gap-3'>
        {onRetry && (
          <Button onPress={onRetry} variant='solid' color='primary' startContent={<RotateCcw className='h-4 w-4' />}>
            Try Again
          </Button>
        )}
        <Button as={Link} to='/' className='button-secondary!'>
          Go Home
        </Button>
      </motion.div>

      {children && <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
}
