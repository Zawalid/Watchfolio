import { useHotkeys } from 'react-hotkeys-hook';
import { Upload, Download, FileJson } from 'lucide-react';
import { ModalBody } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { Tab, Tabs } from '@heroui/react';
import { getShortcut } from '@/utils/keyboardShortcuts';
import Import from '@/components/library/Import';
import Export from '@/components/library/Export';
import { ShortcutKey } from '@/components/ui/ShortcutKey';
import { TABS_CLASSNAMES } from '@/styles/heroui';

interface ImportExportModalProps {
  disclosure: Disclosure;
}

export default function ImportExportModal({ disclosure }: ImportExportModalProps) {
  const { isOpen, onClose, onOpen } = disclosure;

  // Keyboard shortcuts for modal
  useHotkeys(getShortcut('escape')?.hotkey || '', () => (isOpen ? onClose() : null), { enabled: isOpen });
  useHotkeys(getShortcut('toggleImportExport')?.hotkey || '', () => (isOpen ? onClose() : onOpen()), [isOpen]);

  return (
    <Modal disclosure={disclosure} size='xl' classNames={{ base: 'full-mobile-modal' }}>
      <ModalBody className='space-y-6 p-6'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <FileJson className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Import / Export Library</h2>
        </div>

        <Tabs classNames={{ ...TABS_CLASSNAMES, tabList: `${TABS_CLASSNAMES.tabList} w-full` }}>
          <Tab
            key='import'
            title={
              <div className='flex items-center gap-2'>
                <Upload className='size-4' />
                <span>Import</span>
              </div>
            }
          >
            <Import onClose={onClose} />
          </Tab>
          <Tab
            key='export'
            title={
              <div className='flex items-center gap-2'>
                <Download className='size-4' />
                <span>Export</span>
              </div>
            }
          >
            <Export onClose={onClose} />
          </Tab>
        </Tabs>

        <div className='border-Primary-500/20 mt-auto bg-Primary-500/10 rounded-lg border p-3'>
          <p className='text-Primary-300 text-xs'>
            <span className='font-medium'>Tip:</span> Press <ShortcutKey shortcutName='toggleImportExport' /> to toggle
            this panel
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
}
