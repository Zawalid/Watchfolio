import { useCallback, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@heroui/react';
import { addToast } from '@heroui/react';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { Select, SelectItem } from '@heroui/react';
import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { estimateFileSize, formatDateForFilename } from '@/utils/export';

export default function Export({ onClose }: { onClose: () => void }) {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [exportFilter, setExportFilter] = useState<{ status: LibraryFilterStatus; type: 'movie' | 'tv' | 'all' }>({
    status: 'all',
    type: 'all',
  });
  const { getItemsByStatus, getCount, exportLibrary } = useLibraryStore();

  const exportedType = exportFilter.type === 'all' ? undefined : exportFilter.type;

  const handleExport = useCallback(() => {
    try {
      const items = getItemsByStatus(exportFilter.status, exportedType);
      if (items.length === 0) {
        addToast({
          title: 'No items to export',
          description: 'No items to export with the current filter.',
          color: 'warning',
        });
        return;
      }
      const data = exportLibrary(items, exportFormat);

      // Create download
      const blob = new Blob([data], {
        type: exportFormat === 'json' ? 'application/json' : 'text/csv',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watchfolio_library_${formatDateForFilename(new Date())}.${exportFormat}`;
      a.setAttribute('aria-label', 'Download library export file');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast({
        title: 'Export successful',
        description: `${items.length} items exported successfully!`,
        color: 'success',
      });
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      addToast({ title: 'Export error', description: 'Failed to export library. Please try again.', color: 'danger' });
    }
  }, [getItemsByStatus, exportFilter.status, exportedType, exportLibrary, exportFormat, onClose]);

  const exportCount = getCount(exportFilter.status, exportedType);

  return (
    <div className='space-y-5'>
      <div className='space-y-4'>
        <h3 className='text-Primary-50 font-medium'>Export Options</h3>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 items-center gap-3'>
            <label htmlFor='export-format' className='text-Grey-300 text-sm'>
              Format
            </label>
            <Select
              id='export-format'
              aria-label='Export format'
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
              aria-label='Media type'
              classNames={{ ...SELECT_CLASSNAMES, trigger: SELECT_CLASSNAMES.trigger + ' w-full' }}
              selectedKeys={[exportFilter.type]}
              onChange={(e) => setExportFilter({ ...exportFilter, type: e.target.value as 'movie' | 'tv' | 'all' })}
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
              aria-label='Content to export'
              classNames={{ ...SELECT_CLASSNAMES, trigger: SELECT_CLASSNAMES.trigger + ' w-full' }}
              items={[
                { key: 'all', label: `All Items(${getCount('all', exportedType)})` },
                ...LIBRARY_MEDIA_STATUS.map(({ value, label }) => ({
                  key: value,
                  label: `${label} (${getCount(value, exportedType)})`,
                })),
              ]}
              selectedKeys={[exportFilter.status]}
              onChange={(e) => setExportFilter({ ...exportFilter, status: e.target.value as LibraryFilterStatus })}
            >
              {(item) => <SelectItem>{item.label}</SelectItem>}
            </Select>
          </div>
        </div>
      </div>

      <div className='space-y-5'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-Grey-400'>Estimated File Size:</span>
          <span className='text-Primary-300 font-medium'>{estimateFileSize(exportCount, exportFormat)}</span>
        </div>

        <Button
          className='w-full'
          color='primary'
          onPress={handleExport}
          startContent={<Download className='size-4' aria-hidden='true' />}
          aria-label={`Export ${exportCount} items from your library`}
          isDisabled={exportCount === 0}
        >
          Export {exportCount} Items
        </Button>
      </div>
    </div>
  );
}
