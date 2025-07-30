import { Keyboard } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ModalBody, useDisclosure } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { getShortcut, getShortcutsByCategory, type ShortcutCategory } from '@/utils/keyboardShortcuts';
import { ShortcutKey } from '@/components/ui/ShortcutKey';


const CATEGORY_TITLES: Record<ShortcutCategory, string> = {
  general: 'General',
  library: 'Library',
  cardFocus: 'Media Actions (When focused)',
  modal: 'Media Status',
  filters: 'Filters',
};

const CATEGORY_ORDER: ShortcutCategory[] = ['general', 'library', 'cardFocus', 'filters', 'modal'];

export default function KeyboardShortcuts(  ) {
  const disclosure = useDisclosure();
  const { isOpen, onOpen, onClose } = disclosure;

  useHotkeys(getShortcut('toggleShortcutsHelp')?.hotkey || '', () => (isOpen ? onClose() : onOpen()), [isOpen], {
    useKey: true,
  });
  useHotkeys(getShortcut('escape')?.hotkey || '', onClose, { enabled: isOpen });

  return (
    <Modal disclosure={disclosure}>
      <ModalBody className='space-y-6 p-6'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <Keyboard className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Keyboard Shortcuts</h2>
        </div>

        <div className='max-h-[70vh] space-y-6 overflow-y-auto py-2'>
          {CATEGORY_ORDER.map((category) => {
            const shortcuts = getShortcutsByCategory(category);
            if (shortcuts.length === 0) return null;

            return (
              <div key={category} className='space-y-3'>
                <h3 className='text-Grey-400 border-Primary-500/20 text-sm font-medium'>{CATEGORY_TITLES[category]}</h3>

                <div className='space-y-2'>
                  {shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.name}
                      className='flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10'
                    >
                      <span className='text-Grey-300 text-sm'>{shortcut.description}</span>
                      <ShortcutKey shortcutName={shortcut.name} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className='border-Primary-500/20 bg-Primary-500/10 rounded-lg border p-3'>
          <p className='text-Primary-300 text-xs'>
            <span className='font-medium'>Tip:</span> Press <ShortcutKey shortcutName='toggleShortcutsHelp' /> to toggle
            this help panel
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
}
