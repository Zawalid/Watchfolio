import { ModalBody, ModalHeader } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import {
  Github,
  Heart,
  Database,
  Cloud,
  Sparkles,
  Shield,
  Star,
  Zap,
  Download,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAboutDisclosure } from '@/stores/useUIStore';
import { APP_VERSION, GITHUB_URL } from '@/config/downloads';
import { Link } from 'react-router';
import { WindowsIcon, AppleIcon, LinuxIcon } from '@/components/ui/Icons';

export function AboutModal() {
  const disclosure = useAboutDisclosure();

  const features = [
    {
      icon: Cloud,
      label: 'Real-Time Sync',
      description: 'Seamless cloud sync across all your devices',
      color: 'from-Secondary-500 to-Primary-500',
    },
    {
      icon: Database,
      label: 'Offline First',
      description: 'Full functionality without internet connection',
      color: 'from-Success-500 to-Secondary-500',
    },
    {
      icon: Sparkles,
      label: 'AI-Powered',
      description: 'Mood-based recommendations with Gemini AI',
      color: 'from-Warning-500 to-Tertiary-500',
    },
    {
      icon: Star,
      label: 'Smart Tracking',
      description: 'Rate, review, and organize your watchlist',
      color: 'from-Tertiary-500 to-Primary-500',
    },
    {
      icon: Zap,
      label: 'Lightning Fast',
      description: 'Instant search with 30+ keyboard shortcuts',
      color: 'from-Primary-500 to-Warning-500',
    },
    {
      icon: Shield,
      label: 'Privacy First',
      description: 'Your data is encrypted and secure',
      color: 'from-Error-500 to-Tertiary-500',
    },
  ];

  return (
    <Modal disclosure={disclosure} size='2xl' classNames={{ base: 'full-mobile-modal' }}>
      <ModalHeader className='relative overflow-hidden p-6'>
        <div className='from-Primary-500/10 to-Secondary-500/10 absolute inset-0 bg-gradient-to-br' />
        <div className='relative flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <motion.div
              className='bg-Primary-500/20 rounded-xl p-2'
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <img src='/images/logo.svg' alt='Watchfolio' className='size-8' />
            </motion.div>
            <div>
              <h2 className='gradient text-2xl font-bold'>Watchfolio</h2>
              <p className='text-Grey-400 text-sm'>Your Watchlist Universe</p>
            </div>
          </div>
          <div className='bg-Primary-500/20 border-Primary-500/30 inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-sm'>
            <span className='text-Primary-300 text-xs font-medium'>v{APP_VERSION}</span>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className='max-h-[70vh] space-y-6 overflow-y-auto p-6'>
        {/* Tagline */}
        <div className='text-center'>
          <p className='text-Grey-200 mx-auto max-w-md text-base leading-relaxed'>
            An offline-first, AI-powered media library manager for tracking movies and TV shows with{' '}
            <span className='text-Primary-300 font-semibold'>real-time cloud sync</span>.
          </p>
        </div>

        {/* Key Features */}
        <div>
          <h3 className='gradient mb-4 text-center text-lg font-bold'>Powerful Features</h3>
          <div className='grid gap-3 sm:grid-cols-2'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className='group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10'
              >
                <div className={`from-Primary-500/5 to-Secondary-500/5 absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className='relative flex items-start gap-3'>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} p-2`}>
                    <feature.icon className='size-5 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-Grey-100 mb-1 text-sm font-semibold'>{feature.label}</p>
                    <p className='text-Grey-400 text-xs leading-relaxed'>{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Platform Support */}
        <div className='rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5'>
          <h3 className='text-Grey-100 mb-4 text-center text-sm font-semibold'>Available On All Platforms</h3>
          <div className='grid grid-cols-3 gap-3'>
            {[
              { icon: WindowsIcon, label: 'Windows' },
              { icon: AppleIcon, label: 'macOS' },
              { icon: LinuxIcon, label: 'Linux' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className='flex flex-col items-center gap-2 rounded-lg bg-white/5 p-3 transition-all hover:bg-white/10'>
                <Icon className='text-Primary-400 size-6' />
                <span className='text-Grey-300 text-xs font-medium'>{label}</span>
              </div>
            ))}
          </div>
          <div className='mt-3 text-center'>
            <span className='bg-Success-500/10 border-Success-500/20 text-Success-300 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium'>
              <span className='bg-Success-400 size-1.5 rounded-full' />
              Web version always available
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='grid gap-3 sm:grid-cols-2'>
          <Link
            to='/download'
            onClick={() => disclosure.onClose()}
            className='button-primary! group flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all'
          >
            <Download className='size-4' />
            <span className='font-semibold'>Download App</span>
            <ChevronRight className='size-4 transition-transform group-hover:translate-x-1' />
          </Link>
          <a
            href={GITHUB_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='button-secondary! group flex items-center justify-center gap-2 rounded-xl bg-transparent! px-4 py-2.5 text-sm transition-all'
          >
            <Github className='size-4' />
            <span className='font-semibold'>View Source</span>
            <ChevronRight className='size-4 transition-transform group-hover:translate-x-1' />
          </a>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/5 p-4'>
          {[
            { label: 'Features', value: '30+', subtext: 'Keyboard shortcuts' },
            { label: 'Platforms', value: '4', subtext: 'Web, Desktop & Mobile' },
            { label: 'Status', value: 'Open', subtext: 'Source & Free' },
          ].map((stat) => (
            <div key={stat.label} className='text-center'>
              <div className='gradient mb-1 text-xl font-bold'>{stat.value}</div>
              <div className='text-Grey-300 text-xs font-medium'>{stat.label}</div>
              <div className='text-Grey-500 text-xs'>{stat.subtext}</div>
            </div>
          ))}
        </div>

        {/* Credits & Footer */}
        <div className='space-y-3'>
          <div className='border-Primary-500/20 bg-Primary-500/5 rounded-xl border p-3 text-center'>
            <p className='text-Grey-300 text-xs'>
              Movie & TV data powered by{' '}
              <a
                href='https://www.themoviedb.org'
                target='_blank'
                rel='noopener noreferrer'
                className='text-Primary-300 hover:text-Primary-200 font-semibold underline'
              >
                TMDB
              </a>
            </p>
          </div>
          <div className='text-center'>
            <p className='text-Grey-400 flex items-center justify-center gap-1 text-sm'>
              Made with <Heart className='text-Error-400 size-4 fill-current' /> by
              <a
                href='https://github.com/zawalid'
                target='_blank'
                rel='noopener noreferrer'
                className='text-Primary-400 hover:text-Primary-300 font-semibold transition-colors'
              >
                @zawalid
              </a>
            </p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
