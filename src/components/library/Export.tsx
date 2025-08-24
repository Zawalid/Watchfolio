import { useCallback, useState } from 'react';
import { Download } from 'lucide-react';
import { Button, addToast, Select, SelectItem, closeToast } from '@heroui/react';
import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useWorker } from '@/hooks/useWorker';
import { useLibraryTotalCount } from '@/hooks/library/useLibraryQueries';
import { getAllLibraryItems } from '@/lib/rxdb';
import { useAuthStore } from '@/stores/useAuthStore';

const formatFilename = (type: string, status: string, format: string): string => {
  const date = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  return `watchfolio_library_${type !== 'all' ? type + '_' : ''}${status !== 'all' ? status + '_' : ''}${date}.${format}`;
};

const estimateFileSize = (count: number, format: 'json' | 'csv'): string => {
  const averageSize = format === 'json' ? 400 : 160;
  const bytes = count * averageSize;
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const WORKER_URL = new URL('../../workers/export.worker.ts', import.meta.url);

export default function Export({ onClose }: { onClose: () => void }) {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [exportFilter, setExportFilter] = useState<{ status: LibraryFilterStatus; type: MediaType | 'all' }>({
    status: 'all',
    type: 'all',
  });
  const library = useAuthStore((state) => state.user?.profile.library);

  const exportedType = exportFilter.type === 'all' ? undefined : exportFilter.type;
  const libraryCount = useLibraryTotalCount();

  const { postMessage, isProcessing } = useWorker<string>(WORKER_URL, {
    onSuccess: (data) => {
      const blob = new Blob([data], { type: exportFormat === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const fileName = formatFilename(exportFilter.type, exportFilter.status, exportFormat);
      const key = addToast({
        title: 'Download Ready',
        description: 'Your library file is ready.',
        color: 'success',
        timeout: Infinity,
        endContent: (
          <Button
            color='success'
            onPress={() => {
              const a = document.createElement('a');
              a.href = url;
              a.download = fileName;
              a.click();
              if (key) closeToast(key);
            }}
          >
            Download
          </Button>
        ),
      });
      onClose();
    },
    onError: (errorMsg) => {
      addToast({
        title: 'Export error',
        description: errorMsg || 'Failed to prepare the export file.',
        color: 'danger',
      });
    },
  });

  const handleExport = useCallback(async () => {
    const items = await getAllLibraryItems(library?.$id, {
      status: exportFilter.status,
      mediaType: exportedType,
      limit: 10000,
    });
    if (items.length === 0) {
      addToast({ title: 'No items to export', color: 'warning' });
      return;
    }
    addToast({ title: 'Preparing your export...', description: 'This may take a moment.', color: 'secondary' });
    postMessage({ type: 'serialize', format: exportFormat, items });
  }, [library, exportFilter, exportedType, postMessage, exportFormat]);

  return (
    <div className='space-y-5'>
      <div className='space-y-4'>
        <h3 className='text-Primary-50 font-medium'>Export Options</h3>
        <div className='grid grid-cols-2 items-center gap-3'>
          <label htmlFor='export-format' className='text-Grey-300 text-sm'>
            Format
          </label>
          <Select
            id='export-format'
            classNames={{ ...SELECT_CLASSNAMES, trigger: SELECT_CLASSNAMES.trigger + ' w-full' }}
            selectedKeys={[exportFormat]}
            onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
          >
            <SelectItem key='json'>JSON</SelectItem>
            <SelectItem key='csv'>CSV</SelectItem>
          </Select>
          <label htmlFor='export-type' className='text-Grey-300 text-sm'>
            Media Type
          </label>
          <Select
            id='export-type'
            classNames={{ ...SELECT_CLASSNAMES, trigger: SELECT_CLASSNAMES.trigger + ' w-full' }}
            selectedKeys={[exportFilter.type]}
            onChange={(e) => setExportFilter({ ...exportFilter, type: e.target.value as MediaType | 'all' })}
          >
            <SelectItem key='all'>All</SelectItem>
            <SelectItem key='movie'>Movies</SelectItem>
            <SelectItem key='tv'>TV Shows</SelectItem>
          </Select>
          <label htmlFor='export-filter' className='text-Grey-300 text-sm'>
            Content to Export
          </label>
          <Select
            id='export-filter'
            classNames={{ ...SELECT_CLASSNAMES, trigger: SELECT_CLASSNAMES.trigger + ' w-full' }}
            items={[
              { key: 'all', label: `All Items (${libraryCount['all'] || 0})` },
              ...LIBRARY_MEDIA_STATUS.map(({ value, label }) => ({
                key: value,
                label: `${label} (${libraryCount[value] || 0})`,
              })),
            ]}
            selectedKeys={[exportFilter.status]}
            onChange={(e) => setExportFilter({ ...exportFilter, status: e.target.value as LibraryFilterStatus })}
          >
            {(item) => <SelectItem>{item.label}</SelectItem>}
          </Select>
        </div>
      </div>
      <div className='space-y-5'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-Grey-400'>Estimated File Size:</span>
          <span className='text-Primary-300 font-medium'>
            {estimateFileSize(libraryCount[exportFilter.status], exportFormat)}
          </span>
        </div>
        <Button
          className='w-full'
          color='primary'
          onPress={handleExport}
          startContent={<Download className='size-4' />}
          isDisabled={libraryCount[exportFilter.status] === 0 || isProcessing}
          isLoading={isProcessing}
        >
          Export {libraryCount[exportFilter.status]} Items
        </Button>
      </div>
    </div>
  );
}
