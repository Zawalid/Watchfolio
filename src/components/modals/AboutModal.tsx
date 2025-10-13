import { ModalBody, ModalHeader } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { Info, Github, Globe, Heart, Database, Cloud, Sparkles, Shield, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

interface AboutModalProps {
  disclosure: Disclosure;
}

export function AboutModal({ disclosure }: AboutModalProps) {
  const version = '0.0.0';

  const features = [
    { icon: Cloud, label: 'Sync Everywhere', description: 'Access your library on any device' },
    { icon: Database, label: 'Works Offline', description: 'Full functionality without internet' },
    { icon: Sparkles, label: 'AI Recommendations', description: 'Get personalized suggestions' },
    { icon: Shield, label: 'Your Privacy Matters', description: 'Your data stays yours' },
  ];

  return (
    <Modal disclosure={disclosure} size='xl' classNames={{ base: 'full-mobile-modal' }}>
      <ModalHeader className='flex-col gap-2 p-6'>
        <div className='flex items-center gap-3'>
          <motion.div
            className='bg-Primary-500/20 rounded-xl p-2.5'
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Info className='text-Primary-400 size-6' />
          </motion.div>
          <div>
            <h2 className='gradient text-2xl font-bold'>Watchfolio</h2>
            <p className='text-Grey-400 text-sm'>Your Personal Media Library</p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className='max-h-[70vh] space-y-6 overflow-y-auto p-6'>
        {/* Version */}
        <div className='flex justify-center'>
          <div className='bg-Grey-800/50 flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2'>
            <span className='text-Grey-300 text-sm'>Version {version}</span>
          </div>
        </div>

        {/* Description */}
        <div className='bg-Primary-500/10 border-Primary-500/20 space-y-3 rounded-xl border p-4'>
          <p className='text-Grey-200 text-center text-sm leading-relaxed'>
            Track, organize, and discover movies and TV shows with ease. Watchfolio helps you manage your watchlist,
            keep track of what you've seen, and find your next favorite show.
          </p>
        </div>

        {/* Key Features */}
        <div>
          <h3 className='text-Primary-100 mb-3 text-center text-sm font-semibold'>What You Get</h3>
          <div className='grid gap-3 sm:grid-cols-2'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className='bg-Grey-800/50 flex items-start gap-3 rounded-lg border border-white/10 p-3'
              >
                <div className='bg-Primary-500/20 rounded-lg p-2'>
                  <feature.icon className='text-Primary-400 size-4' />
                </div>
                <div className='flex-1'>
                  <p className='text-Grey-200 text-sm font-medium'>{feature.label}</p>
                  <p className='text-Grey-400 text-xs'>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Platform Support */}
        <div className='bg-Grey-800/50 rounded-xl border border-white/10 p-4'>
          <div className='mb-3 flex items-center justify-center gap-2'>
            <Monitor className='text-Primary-400 size-5' />
            <h3 className='text-Grey-200 text-sm font-semibold'>Available On</h3>
          </div>
          <div className='flex flex-wrap justify-center gap-2'>
            <span className='bg-Primary-500/20 text-Primary-200 rounded-full px-3 py-1 text-xs font-medium'>
              Web
            </span>
            <span className='bg-Primary-500/20 text-Primary-200 rounded-full px-3 py-1 text-xs font-medium'>
              Windows
            </span>
            <span className='bg-Primary-500/20 text-Primary-200 rounded-full px-3 py-1 text-xs font-medium'>macOS</span>
            <span className='bg-Primary-500/20 text-Primary-200 rounded-full px-3 py-1 text-xs font-medium'>Linux</span>
          </div>
        </div>

        {/* Links */}
        <div className='space-y-2'>
          <a
            href='https://github.com/zawalid/watchfolio'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-Grey-800/50 hover:bg-Grey-800/80 flex items-center gap-3 rounded-xl border border-white/10 p-3 transition-all hover:border-white/20'
          >
            <div className='bg-Grey-700/50 rounded-lg p-2'>
              <Github className='text-Grey-300 size-4' />
            </div>
            <div className='flex-1'>
              <p className='text-Grey-100 text-sm font-medium'>GitHub</p>
              <p className='text-Grey-400 text-xs'>Report issues & contribute</p>
            </div>
          </a>

          <a
            href='https://watchfolio.app'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-Grey-800/50 hover:bg-Grey-800/80 flex items-center gap-3 rounded-xl border border-white/10 p-3 transition-all hover:border-white/20'
          >
            <div className='bg-Grey-700/50 rounded-lg p-2'>
              <Globe className='text-Grey-300 size-4' />
            </div>
            <div className='flex-1'>
              <p className='text-Grey-100 text-sm font-medium'>Website</p>
              <p className='text-Grey-400 text-xs'>Learn more & get help</p>
            </div>
          </a>
        </div>

        {/* Credits */}
        <div className='border-Primary-500/20 bg-Primary-500/5 rounded-xl border p-3'>
          <p className='text-Grey-300 text-center text-xs'>
            Movie & TV data from{' '}
            <a
              href='https://www.themoviedb.org'
              target='_blank'
              rel='noopener noreferrer'
              className='text-Primary-300 hover:text-Primary-200 font-medium underline'
            >
              TMDB
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className='text-center'>
          <p className='text-Grey-400 text-xs'>
            Made with <Heart className='text-Error-400 mx-1 inline size-3 fill-current' /> by{' '}
            <a
              href='https://github.com/zawalid'
              target='_blank'
              rel='noopener noreferrer'
              className='text-Primary-400 hover:text-Primary-300 font-medium'
            >
              @zawalid
            </a>
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
}
