import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Home, Search, Film, Tv, ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '@heroui/button';
import { AnimatedRing } from '@/components/ui/AnimatedRing';

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
}
;
export default function NotFound() {
const navigate = useNavigate()

  return (
    <div className='blur-bg relative flex min-h-dvh items-center justify-center overflow-hidden'>
      <div className='relative z-10 container'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='flex min-h-[500px] flex-1 flex-col items-center justify-center gap-8 text-center'
        >
          {/* Main 404 icon with animated rings */}
          <motion.div variants={itemVariants}>
            <AnimatedRing
              color='secondary'
              size='lg'
              ringCount={2}
              animationSpeed='normal'
              glowEffect={true}
              floatingIcons={[
                {
                  icon: <Film className='h-4 w-4' />,
                  position: 'top-right',
                  color: 'primary',
                  delay: 0,
                },
                {
                  icon: <Tv className='h-4 w-4' />,
                  position: 'bottom-left',
                  color: 'tertiary',
                  delay: 1,
                },
                {
                  icon: <Search className='h-4 w-4' />,
                  position: 'top-left',
                  color: 'warning',
                  delay: 2,
                },
              ]}
            >
              <FileQuestion className='text-Secondary-400 h-16 w-16' />
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
              Page Not Found
            </motion.h2>
            <motion.p variants={itemVariants} className='text-Grey-300 text-base leading-relaxed font-medium'>
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </motion.p>
          </motion.div>

          {/* Action buttons - new layout: Go Home is prominent, others below */}
          <motion.div variants={itemVariants} className='w-full max-w-lg flex flex-col items-center gap-3'>
            <Button
              as={Link}
              to='/home'
              color='primary'
              startContent={<Home className='h-4 w-4' />}
              className='w-full'
            >
              Go Home
            </Button>
            <div className='flex flex-col sm:flex-row w-full gap-3'>
              <Button
                as={Link}
                to='/search'
                variant='bordered'
                className='button-secondary! bg-transparent! flex-1'
                startContent={<Search className='h-4 w-4' />}
              >
                Search
              </Button>
              <Button
                onPress={() => navigate(-1)}
                variant='bordered'
                className='button-secondary! bg-transparent! flex-1'
                startContent={<ArrowLeft className='h-4 w-4' />}
              >
                Go Back
              </Button>
            </div>
          </motion.div>

          {/* Help message */}
          <motion.div
            variants={itemVariants}
            className='mt-8 max-w-lg rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl'
          >
            <p className='text-Grey-400 text-sm leading-relaxed'>
              <span className='text-Grey-300 font-semibold'>Need help?</span> Use the search bar to find movies and TV shows, 
              or navigate back to the home page to explore trending content.
            </p>
          </motion.div>

          {/* Quick navigation */}
          <motion.div variants={itemVariants} className='grid gap-3 text-center'>
            <p className='text-Grey-400 text-sm font-medium'>Quick navigation:</p>
            <div className='flex flex-wrap justify-center gap-2'>
              <Link 
                to='/movies' 
                className='pill-bg text-Grey-300 hover:text-Grey-100 px-3 py-1 text-xs hover:bg-white/10'
              >
                Movies
              </Link>
              <Link 
                to='/tv' 
                className='pill-bg text-Grey-300 hover:text-Grey-100 px-3 py-1 text-xs hover:bg-white/10'
              >
                TV Shows
              </Link>
              <Link 
                to='/celebrities' 
                className='pill-bg text-Grey-300 hover:text-Grey-100 px-3 py-1 text-xs hover:bg-white/10'
              >
                Celebrities
              </Link>
              <Link 
                to='/library' 
                className='pill-bg text-Grey-300 hover:text-Grey-100 px-3 py-1 text-xs hover:bg-white/10'
              >
                Library
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}