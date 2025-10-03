import { ModalBody } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { Keyboard } from 'lucide-react';
import { KEYBOARD_SHORTCUTS, type ShortcutCategory } from '@/utils/keyboardShortcuts';
import { ShortcutKey } from '@/components/ui/ShortcutKey';

interface KeyboardShortcutsModalProps {
  disclosure: Disclosure;
}

const categoryLabels: Record<ShortcutCategory, string> = {
  general: 'General',
  library: 'Library',
  cardFocus: 'Card Focus',
  modal: 'Modals',
  filters: 'Filters',
  mediaStatus: 'Media Status',
};

export function KeyboardShortcutsModal({ disclosure }: KeyboardShortcutsModalProps) {
  // Group shortcuts by category
  const shortcutsByCategory = Object.entries(KEYBOARD_SHORTCUTS).reduce(
    (acc, [key, shortcut]) => {
      const category = shortcut.category as ShortcutCategory;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ name: key, ...shortcut });
      return acc;
    },
    {} as Record<ShortcutCategory, Array<{ name: string; hotkey: string; label: string; description: string }>>
  );

  return (
    <Modal disclosure={disclosure} size='2xl' scrollBehavior='inside'>
      <ModalBody className='p-6'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Keyboard className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Keyboard Shortcuts</h2>
        </div>

        {/* Shortcuts by category */}
        <div className='space-y-6'>
          {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className='text-Primary-200 text-sm font-semibold mb-3 uppercase tracking-wider'>
                {categoryLabels[category as ShortcutCategory] || category}
              </h3>
              <div className='space-y-2'>
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.name}
                    className='bg-Primary-500/5 hover:bg-Primary-500/10 border-Primary-500/20 flex items-center justify-between rounded-lg border p-3 transition-colors'
                  >
                    <span className='text-Primary-200 text-sm'>{shortcut.description}</span>
                    <ShortcutKey shortcutName={shortcut.name as keyof typeof KEYBOARD_SHORTCUTS} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop-specific shortcuts */}
        <div className='mt-6 pt-6 border-t border-Primary-500/20'>
          <h3 className='text-Primary-200 text-sm font-semibold mb-3 uppercase tracking-wider'>
            Desktop Global Shortcuts
          </h3>
          <div className='space-y-2'>
            <div className='bg-Primary-500/5 hover:bg-Primary-500/10 border-Primary-500/20 flex items-center justify-between rounded-lg border p-3 transition-colors'>
              <span className='text-Primary-200 text-sm'>Quick Add (works anywhere)</span>
              <kbd className='kbd kbd-sm'>Ctrl+Shift+W</kbd>
            </div>
            <div className='bg-Primary-500/5 hover:bg-Primary-500/10 border-Primary-500/20 flex items-center justify-between rounded-lg border p-3 transition-colors'>
              <span className='text-Primary-200 text-sm'>Global Search (works anywhere)</span>
              <kbd className='kbd kbd-sm'>Ctrl+Shift+F</kbd>
            </div>
            <div className='bg-Primary-500/5 hover:bg-Primary-500/10 border-Primary-500/20 flex items-center justify-between rounded-lg border p-3 transition-colors'>
              <span className='text-Primary-200 text-sm'>Show/Hide App (works anywhere)</span>
              <kbd className='kbd kbd-sm'>Ctrl+Shift+Space</kbd>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className='border-Primary-500/20 bg-Primary-500/5 rounded-lg border p-3 mt-6'>
          <p className='text-Primary-300 text-xs text-center'>
            Press <kbd className='kbd kbd-sm'>?</kbd> anywhere to toggle this panel
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
}
