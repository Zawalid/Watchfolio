import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Upload, Download, FileJson } from 'lucide-react';
import { ModalBody } from '@heroui/modal';
import Modal from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { getShortcut } from '@/utils/keyboardShortcuts';
import Import from './Import';
import Export from './Export';
import { ShortcutKey } from '../ui/ShortcutKey';

interface ImportExportModalProps {
  disclosure: Disclosure;
}

export default function ImportExportModal({ disclosure }: ImportExportModalProps) {
  const { isOpen, onClose, onOpen } = disclosure;
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');

  // Keyboard shortcuts for modal
  useHotkeys(getShortcut('escape').hotkey, onClose, { enabled: isOpen });
  useHotkeys(getShortcut('toggleImportExport').hotkey, () => (isOpen ? onClose() : onOpen()), [isOpen]);

  return (
    <Modal disclosure={disclosure} classNames={{ base: 'max-w-xl' }}>
      <ModalBody className='space-y-6 p-6'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <FileJson className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Import / Export Library</h2>
        </div>

        <Tabs
          className='w-full rounded-lg border-none border-white/10 bg-transparent p-0 [&>li]:flex-1'
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'export' | 'import')}
          tabClassName='bg-white/5 border- border-white/5 rounded-lg backdrop-blur-md hover:bg-white/10! hover:text-white justify-center text-sm'
          indicatorClassName='border border-Secondary-400 bg-Secondary-500/20 text-Secondary-50'
          tabs={[
            {
              label: 'Export',
              value: 'export',
              icon: <Download className='size-4' />,
            },
            {
              label: 'Import',
              value: 'import',
              icon: <Upload className='size-4' />,
            },
          ]}
        />

        {activeTab === 'export' && <Export onClose={onClose} />}
        {activeTab === 'import' && <Import onClose={onClose} />}

        <div className='border-Primary-500/20 bg-Primary-500/10 rounded-lg border p-3'>
          <div className='text-Primary-300 text-xs'>
            <span className='font-medium'>Tip:</span> Press <ShortcutKey shortcutName='toggleImportExport' /> to toggle
            this panel
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
