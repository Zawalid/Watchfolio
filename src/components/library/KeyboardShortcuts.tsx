import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/button';
import { X, Keyboard } from 'lucide-react';
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: '?', description: 'Show/hide keyboard shortcuts' },
  { key: '/', description: 'Focus search input' },
  { key: 'g + g', description: 'Switch to grid view' },
  { key: 'g + l', description: 'Switch to list view' },
  { key: 'f', description: 'Toggle favorite (when card is focused)' },
  { key: 'e', description: 'Edit status (when card is focused)' },
  { key: 'Delete', description: 'Remove from library (when card is focused)' },
  { key: 'Enter', description: 'Open details (when card is focused)' },
  { key: 'Escape', description: 'Close modals/blur focus' },
  { key: '→ ←', description: 'Navigate between cards' },
  { key: 'Tab', description: 'Navigate interface elements' },
];

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className='bg-background/95 mx-4 w-full max-w-md rounded-2xl border border-white/20 p-6 shadow-2xl backdrop-blur-xl'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='bg-Primary-500/20 rounded-lg p-2'>
                  <Keyboard className='text-Primary-400 size-5' />
                </div>
                <h2 className='text-Primary-50 text-xl font-semibold'>Keyboard Shortcuts</h2>
              </div>
              <Button
                isIconOnly
                variant='ghost'
                className='text-Grey-400 h-8 w-8 hover:text-white'
                onPress={onClose}
                aria-label='Close keyboard shortcuts'
              >
                <X className='size-4' />
              </Button>
            </div>

            {/* Shortcuts list */}
            <div className='max-h-96 space-y-3 overflow-y-auto'>
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className='flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10'
                >
                  <span className='text-Grey-300 text-sm'>{shortcut.description}</span>
                  <div className='flex items-center gap-1'>
                    {shortcut.key.split(' + ').map((key, keyIndex) => (
                      <div key={keyIndex} className='flex items-center gap-1'>
                        <kbd className='rounded border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white shadow-sm'>
                          {key}
                        </kbd>
                        {keyIndex < shortcut.key.split(' + ').length - 1 && (
                          <span className='text-Grey-500 text-xs'>+</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className='border-Primary-500/20 bg-Primary-500/10 mt-6 rounded-lg border p-3'>
              <p className='text-Primary-300 text-xs'>
                <span className='font-medium'>Tip:</span> Press{' '}
                <kbd className='bg-Primary-500/20 rounded px-1 py-0.5 text-xs'>?</kbd> to toggle this help panel
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
