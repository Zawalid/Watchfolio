import { Button } from '@heroui/button';
import { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { AnimatedRing } from './ui/AnimatedRing';
import { Search, Sparkles, Users, Plus } from 'lucide-react';

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
      className='flex min-h-[500px] flex-1 flex-col items-center justify-center gap-8 text-center'
    >
      <motion.div variants={itemVariants}>
        <AnimatedRing
          color='secondary'
          size='lg'
          ringCount={2}
          animationSpeed='normal'
          glowEffect={true}
        >
          <Search className='h-12 w-12 text-Secondary-400' />
        </AnimatedRing>
      </motion.div>
      <motion.h2 variants={itemVariants} className='text-Grey-50 text-xl font-semibold sm:text-2xl'>
        Sorry, No results found
      </motion.h2>
      <motion.p variants={itemVariants} className='text-Grey-300 font-medium'>
        There are no movies or tv shows matching your search terms.
      </motion.p>
      {children && <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
}

export function EmptyWatchList({
  type = 'all',
  className = '',
}: {
  type?: 'all' | 'movies' | 'tv';
  className?: string;
}) {
  const heading = type === 'all' ? 'There are no items in your list' : `There are no ${type} in your list`;

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
      className={`flex min-h-[500px] flex-1 flex-col items-center justify-center gap-8 text-center ${className}`}
    >
      <motion.div variants={itemVariants}>
        <AnimatedRing
          color='tertiary'
          size='lg'
          ringCount={2}
          animationSpeed='normal'
          glowEffect={true}
          floatingIcons={[
            {
              icon: <Users className='h-4 w-4' />,
              position: 'top-right',
              color: 'secondary',
              delay: 0,
            },
            {
              icon: <Plus className='h-4 w-4' />,
              position: 'bottom-left',
              color: 'primary',
              delay: 1,
            },
            {
              icon: <Sparkles className='h-4 w-4' />,
              position: 'top-left',
              color: 'warning',
              delay: 2,
            },
          ]}
        >
          <Sparkles className='h-12 w-12 text-Tertiary-400' />
        </AnimatedRing>
      </motion.div>
      
      <motion.h2 variants={itemVariants} className='text-Grey-50 text-xl font-semibold sm:text-2xl'>
        {heading}
      </motion.h2>
      <motion.p variants={itemVariants} className='text-Grey-300 font-medium'>
        Your watchlist is empty! Maybe your friends have some great suggestions?
        <br />
        Check your friends{' '}
        <Link
          to='/suggestions'
          className='text-Primary-400 hover:text-Primary-500 mx-1 w-fit font-medium transition-colors duration-200'
        >
          suggestions
        </Link>{' '}
        or{' '}
        <Link
          to='/'
          className='text-Primary-400 hover:text-Primary-500 mx-1 w-fit font-medium transition-colors duration-200'
        >
          add
        </Link>{' '}
        some {type === 'all' ? 'movies or tv shows' : type} to fill your list.
      </motion.p>
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
  return (
    <div className='flex min-h-[500px] flex-1 flex-col items-center justify-center gap-1 text-center'>
      <div className='relative aspect-square w-[300px]'>
        <img src='/images/error.svg' alt='' className='size-full object-contain' />
      </div>
      <h2 className='text-Grey-50 text-xl font-semibold sm:text-2xl'>Oops! An error occurred</h2>
      <p className='text-Grey-300 mb-4 font-medium'>{message}</p>

      <div className='flex gap-3'>
        {onRetry && (
          <Button onPress={onRetry} variant='solid' color='primary' className='min-w-24'>
            Try Again
          </Button>
        )}
        <Button as={Link} to='/' variant='bordered' color='default' className='min-w-24'>
          Go Home
        </Button>
      </div>
      {children}
    </div>
  );
}
