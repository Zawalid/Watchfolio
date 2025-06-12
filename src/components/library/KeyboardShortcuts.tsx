import { ModalBody } from '@heroui/modal';
import { Keyboard } from 'lucide-react';
import { useEffect } from 'react';
import Modal from '@/components/ui/Modal';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: '?', description: 'Show/hide keyboard shortcuts' },
  { key: 't', description: 'Show/hide tabs' },
  { key: '/', description: 'Focus search input' },
  { key: 'f', description: 'Toggle favorite (when card is focused)' },
  { key: 'e', description: 'Edit status (when card is focused)' },
  { key: 'Delete', description: 'Remove from library (when card is focused)' },
  { key: 'Enter', description: 'Open details (when card is focused)' },
  { key: 'Escape', description: 'Close modals/blur focus' },
  { key: 'Tab', description: 'Navigate interface elements' },
  { key: '↑ ↓', description: 'Navigate between items' },
];

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' || (e.key === 'Escape' && isOpen)) {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, onClose]);

  // Create disclosure object for Modal component
  const disclosure = {
    isOpen,
    onOpen: () => {},
    onClose,
    onOpenChange: (open: boolean) => {
      if (!open) onClose();
    },
  };

  return (
    <Modal disclosure={disclosure}>
      <ModalBody className='space-y-6 p-6'>
        {/* Header */}
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Keyboard className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Keyboard Shortcuts</h2>
        </div>

        {/* Shortcuts list */}
        <div className='max-h-96 space-y-3 overflow-y-auto py-2'>
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className='flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10'
            >
              <span className='text-Grey-300 text-sm'>{shortcut.description}</span>
              <div className='flex items-center gap-1'>
                {shortcut.key.split(' ').map((key, keyIndex) => (
                  <div key={keyIndex} className='flex items-center gap-1'>
                    <kbd className='rounded border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white shadow-sm'>
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className='border-Primary-500/20 bg-Primary-500/10 rounded-lg border p-3'>
          <p className='text-Primary-300 text-xs'>
            <span className='font-medium'>Tip:</span> Press{' '}
            <kbd className='bg-Primary-500/20 rounded px-1 py-0.5 text-xs'>?</kbd> to toggle this help panel
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
}
