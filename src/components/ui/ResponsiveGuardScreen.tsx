import { motion } from 'framer-motion';
import { Smartphone, Laptop, ArrowRight } from 'lucide-react';
import { AnimatedRing } from './AnimatedRing';

export function ResponsiveScreen() {
  return (
    <div className='blur-bg relative flex min-h-dvh items-center justify-center overflow-auto'>
      <div className='relative z-10 container'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className='flex min-h-[500px] flex-1 flex-col items-center justify-center gap-8 text-center px-5'
        >
          {/* Main icon with animated rings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='relative'
          >
            <AnimatedRing
              color='primary'
              size='lg'
              ringCount={2}
              animationSpeed='normal'
              glowEffect={true}
              floatingIcons={[
                {
                  icon: <Smartphone className='h-4 w-4' />,
                  position: 'top-right',
                  color: 'warning',
                  delay: 0,
                },
                {
                  icon: <ArrowRight className='h-4 w-4' />,
                  position: 'bottom-left',
                  color: 'secondary',
                  delay: 1,
                },
                {
                  icon: <Laptop className='h-4 w-4' />,
                  position: 'top-left',
                  color: 'primary',
                  delay: 2,
                },
              ]}
            >
              <Smartphone className='text-Primary-400 h-16 w-16' />
            </AnimatedRing>
          </motion.div>

          {/* Title and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className='max-w-2xl space-y-4'
          >
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
              Mobile Version Coming Soon!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className='text-Grey-300 text-base leading-relaxed font-medium'
            >
              We're working hard to bring you the best mobile experience. For now, please use a larger screen to access
              Watchfolio and enjoy all its features to the fullest!
            </motion.p>
          </motion.div>

          {/* Footer message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className='mt-8 max-w-lg rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl'
          >
            <p className='text-Grey-400 text-sm leading-relaxed'>
              <span className='text-Grey-300 font-semibold'>Recommended:</span> For the best experience, use a device
              with a screen width of at least 768 pixels. We'll notify you when the mobile version is ready! 🚀
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}