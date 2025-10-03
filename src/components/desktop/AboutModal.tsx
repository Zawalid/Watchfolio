import { ModalBody } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { Info, Github, Globe, Heart } from 'lucide-react';

interface AboutModalProps {
  disclosure: Disclosure;
}

export function AboutModal({ disclosure }: AboutModalProps) {
  const version = '1.0.0'; // TODO: Import from package.json or env

  return (
    <Modal disclosure={disclosure} size='md'>
      <ModalBody className='space-y-6 p-6'>
        {/* Header */}
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Info className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>About Watchfolio</h2>
        </div>

        {/* Logo and Title */}
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold gradient'>Watchfolio</h1>
          <p className='text-Primary-300 text-sm'>AI-Powered Media Library Manager</p>
          <p className='text-Primary-400 text-xs'>Version {version}</p>
        </div>

        {/* Description */}
        <div className='bg-Primary-500/10 border-Primary-500/20 rounded-lg border p-4 space-y-2'>
          <p className='text-Primary-200 text-sm'>
            Track movies and TV shows with real-time cloud sync, powered by AI recommendations.
          </p>
          <p className='text-Primary-300 text-xs'>
            Built with React, TypeScript, Tauri, and lots of{' '}
            <Heart className='inline size-3 text-Error-400 fill-current' />
          </p>
        </div>

        {/* Links */}
        <div className='space-y-2'>
          <a
            href='https://github.com/yourusername/watchfolio'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-Primary-500/5 hover:bg-Primary-500/10 border-Primary-500/20 flex items-center gap-3 rounded-lg border p-3 transition-colors'
          >
            <Github className='text-Primary-300 size-5 shrink-0' />
            <div className='flex-1'>
              <p className='text-Primary-100 text-sm font-medium'>View on GitHub</p>
              <p className='text-Primary-400 text-xs'>Source code & contributions</p>
            </div>
          </a>

          <a
            href='https://watchfolio.app'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-Primary-500/5 hover:bg-Primary-500/10 border-Primary-500/20 flex items-center gap-3 rounded-lg border p-3 transition-colors'
          >
            <Globe className='text-Primary-300 size-5 shrink-0' />
            <div className='flex-1'>
              <p className='text-Primary-100 text-sm font-medium'>Website</p>
              <p className='text-Primary-400 text-xs'>Visit watchfolio.app</p>
            </div>
          </a>
        </div>

        {/* Credits */}
        <div className='border-Primary-500/20 bg-Primary-500/5 rounded-lg border p-3'>
          <p className='text-Primary-300 text-xs text-center'>
            Movie & TV data provided by{' '}
            <a href='https://www.themoviedb.org' target='_blank' rel='noopener noreferrer' className='text-Primary-200 hover:text-Primary-100 underline'>
              TMDB
            </a>
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
}
