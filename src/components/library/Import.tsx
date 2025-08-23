import { useCallback, useState } from 'react';
import { CheckCircle2, Upload, DatabaseZap, Film, Tv } from 'lucide-react';
import { Button, addToast, Select, SelectItem, SelectSection, Switch } from '@heroui/react';
import { FileDropper } from '@/components/ui/FileDropper';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { generateMediaId } from '@/utils/library';
import { useWorker } from '@/hooks/useWorker';
import { LIBRARY_IMPORT_MAX_SIZE } from '@/utils/constants';

interface ImportProps {
  onClose: () => void;
}

type ImportStage = 'select' | 'processing' | 'preview' | 'options' | 'complete';

const STRATEGY_DESCRIPTIONS = {
  smart: 'Updates existing items with new data while preserving your ratings and custom fields. Adds new items.',
  overwrite: 'Replaces all existing items with imported data. Your current settings for these items will be lost.',
  skip: 'Only adds new items. Existing items in your library will remain unchanged.',
};

const WORKER_URL = new URL('../../workers/import.worker.ts', import.meta.url);

const ProcessingView = ({ message, icon }: { message: string; icon: React.ReactNode }) => (
  <div className='flex flex-col items-center justify-center py-8 text-center' aria-live='polite'>
    <div className='relative flex size-16 items-center justify-center'>
      <div className='bg-Primary-500/10 absolute size-full animate-pulse rounded-full delay-500'></div>
      <div className='border-Primary-500/20 absolute size-12 rounded-full border-2'></div>
      <div className='border-Primary-500/40 border-t-Primary-400 absolute size-16 animate-spin rounded-full border-2'></div>
      {icon}
    </div>
    <h3 className='text-Primary-100 mt-4 text-lg font-medium'>{message}</h3>
    <p className='text-Grey-300 mt-1 text-sm'>Please wait, this won't take long...</p>
  </div>
);

export default function Import({ onClose }: ImportProps) {
  const [importPreview, setImportPreview] = useState<{
    totalItems: number;
    movies: number;
    tvShows: number;
    newItems: number;
    updatedItems: number;
  } | null>(null);
  const [importStage, setImportStage] = useState<ImportStage>('select');
  const [importOptions, setImportOptions] = useState({
    mergeStrategy: 'smart' as 'smart' | 'overwrite' | 'skip',
    keepExistingFavorites: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<LibraryMedia[] | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const library = useLibraryStore((state) => state.library);
  const { importLibrary } = useLibraryStore();

  const { postMessage: parseContent, isProcessing: isParsing } = useWorker<LibraryMedia[]>(WORKER_URL, {
    onSuccess: (items) => {
      setParsedItems(items);
      const movieCount = items.filter((item) => item.media_type === 'movie').length;
      const tvCount = items.filter((item) => item.media_type === 'tv').length;
      const currentLibrary = library || {};
      let newItemsCount = 0;
      let updatedItemsCount = 0;

      for (const item of items) {
        const id = generateMediaId(item);
        if (currentLibrary[id]) updatedItemsCount++;
        else newItemsCount++;
      }

      if (newItemsCount === 0 && updatedItemsCount === 0) {
        addToast({
          title: 'No items to process',
          description: 'The import file does not contain any valid items for your library.',
          color: 'warning',
        });
        handleReset();
        return;
      }

      setImportPreview({
        totalItems: items.length,
        movies: movieCount,
        tvShows: tvCount,
        newItems: newItemsCount,
        updatedItems: updatedItemsCount,
      });
      setImportStage('preview');
    },
    onError: (errorMsg) => {
      addToast({
        title: 'File parsing error',
        description: errorMsg || 'The selected file is invalid.',
        color: 'danger',
      });
      handleReset();
    },
  });

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !['json', 'csv'].includes(fileExtension)) {
      addToast({ title: 'Invalid file format.', description: 'Please select a JSON or CSV file.', color: 'danger' });
      return;
    }
    if (file.size > LIBRARY_IMPORT_MAX_SIZE) {
      addToast({ title: 'File is too large.', description: 'Maximum size is 10MB.', color: 'danger' });
      return;
    }
    processFile(file);
  };

  const processFile = useCallback(
    (file: File) => {
      setSelectedFile(file);
      setImportStage('processing');
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const format = file.name.split('.').pop()?.toLowerCase() as 'json' | 'csv';
        parseContent({ type: 'parse', content, format });
      };
      reader.onerror = () =>
        addToast({ title: 'File reading error', description: 'Failed to read the file.', color: 'danger' });
      reader.readAsText(file);
    },
    [parseContent]
  );

  const handleImport = useCallback(async () => {
    if (!parsedItems) return;
    setIsImporting(true);
    setImportStage('processing');

    try {
      const importedCount = await importLibrary(parsedItems, importOptions);
      setImportStage('complete');
      setTimeout(() => {
        addToast({
          title: 'Import successful',
          description: `${importedCount} items were processed.`,
          color: 'success',
        });
        onClose();
      }, 1500);
    } catch (error) {
      addToast({
        title: 'Import error',
        description: `Failed to import library: ${error instanceof Error ? error.message : 'Unknown error'}`,
        color: 'danger',
      });
      setImportStage('options');
    } finally {
      setIsImporting(false);
    }
  }, [parsedItems, importOptions, importLibrary, onClose]);

  const handleReset = () => {
    setSelectedFile(null);
    setImportStage('select');
    setImportPreview(null);
  };

  const isBusy = isParsing || isImporting;

  function renderStage() {
    switch (importStage) {
      case 'select':
        return (
          <>
            <div className='border-Secondary-500/20 bg-Secondary-500/10 rounded-lg border p-3 text-left'>
              <div className='flex items-start gap-3'>
                <Upload className='text-Secondary-300 size-5 flex-shrink-0' />
                <div>
                  <h4 className='text-Secondary-200 font-semibold'>Import Your Library</h4>
                  <p className='text-Secondary-300/80 mt-1 text-xs'>
                    Import a previously exported library file. This will merge with your existing library.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <FileDropper
                accept={{ 'application/json': ['.json'], 'text/csv': ['.csv'] }}
                maxSize={LIBRARY_IMPORT_MAX_SIZE}
                maxFiles={1}
                multiple={false}
                onFileSelect={handleFileSelect}
                className='mt-4'
                disabled={isBusy}
              />
              <p className='text-Grey-400 mt-2 text-xs font-medium'>Supported formats: JSON, CSV</p>
            </div>
          </>
        );
      case 'processing':
        return (
          <ProcessingView
            message={isParsing ? 'Parsing your file...' : 'Importing to library...'}
            icon={
              isParsing ? (
                <Upload className='text-Primary-400 size-6' />
              ) : (
                <DatabaseZap className='text-Primary-400 size-6' />
              )
            }
          />
        );
      case 'preview':
        if (!importPreview || !selectedFile) return null;
        return (
          <>
            <div className='space-y-4'>
              <div className='bg-blur border-Secondary-500/20 flex items-center gap-3 rounded-lg border px-4 py-3'>
                <div className='flex size-8 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10'>
                  <CheckCircle2 className='size-5 text-green-400' aria-hidden='true' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-Primary-100 text-sm font-semibold'>File Ready</span>
                  <span className='text-Grey-300 max-w-[240px] truncate text-xs sm:max-w-xs'>{selectedFile.name}</span>
                </div>
              </div>

              <div className='space-y-3'>
                <h3 className='text-Primary-50 font-medium'>File Summary</h3>
                <div className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-3'>
                  <div className='bg-blur flex flex-col justify-between rounded-lg border border-white/10 p-3'>
                    <span className='text-Grey-300'>Total Items</span>
                    <span className='text-Primary-50 text-xl font-semibold'>{importPreview.totalItems}</span>
                  </div>
                  <div className='bg-blur flex flex-col justify-between rounded-lg border border-white/10 p-3'>
                    <span className='text-Grey-300 flex items-center gap-1.5'>
                      <Film className='size-4' /> Movies
                    </span>
                    <span className='text-Primary-50 text-xl font-semibold'>{importPreview.movies}</span>
                  </div>
                  <div className='bg-blur flex flex-col justify-between rounded-lg border border-white/10 p-3'>
                    <span className='text-Grey-300 flex items-center gap-1.5'>
                      <Tv className='size-4' /> TV Shows
                    </span>
                    <span className='text-Primary-50 text-xl font-semibold'>{importPreview.tvShows}</span>
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                <h3 className='text-Primary-50 font-medium'>Changes to Your Library</h3>
                <div className='bg-blur space-y-3 rounded-lg border border-white/10 p-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-Grey-300 text-sm'>New Items to Add</span>
                    <span className='font-medium text-green-400'>{importPreview.newItems}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-Grey-300 text-sm'>Existing Items to Update</span>
                    <span className='font-medium text-blue-400'>{importPreview.updatedItems}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-8 flex justify-between'>
              <Button className='button-secondary!' onPress={handleReset}>
                Choose Another File
              </Button>
              <Button color='primary' onPress={() => setImportStage('options')}>
                Continue to Options
              </Button>
            </div>
          </>
        );
      case 'options':
        return (
          <>
            <div className='space-y-4'>
              <h3 className='text-Primary-50 font-medium'>Import Options</h3>
              <div className='space-y-2'>
                <div className='grid grid-cols-2 items-center gap-3'>
                  <label htmlFor='merge-strategy' className='text-Grey-300 text-sm'>
                    Merge Strategy
                  </label>
                  <Select
                    id='merge-strategy'
                    classNames={{ ...SELECT_CLASSNAMES, trigger: SELECT_CLASSNAMES.trigger + ' w-full' }}
                    selectedKeys={[importOptions.mergeStrategy]}
                    onChange={(e) =>
                      setImportOptions({
                        ...importOptions,
                        mergeStrategy: e.target.value as 'smart' | 'overwrite' | 'skip',
                      })
                    }
                  >
                    <SelectSection title='Conflict Resolution'>
                      <SelectItem key='smart'>Smart Merge</SelectItem>
                      <SelectItem key='overwrite'>Overwrite Existing</SelectItem>
                      <SelectItem key='skip'>Skip Existing</SelectItem>
                    </SelectSection>
                  </Select>
                </div>
                <div className='bg-Secondary-500/10 border-Secondary-500/20 rounded-md border px-3 py-2'>
                  <p className='text-Secondary-300 text-xs'>{STRATEGY_DESCRIPTIONS[importOptions.mergeStrategy]}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <label htmlFor='keep-favorites' className='text-Grey-300 text-sm'>
                  Keep Existing Favorites
                </label>
                <Switch
                  id='keep-favorites'
                  isSelected={importOptions.keepExistingFavorites}
                  onValueChange={(isSelected: boolean) =>
                    setImportOptions({ ...importOptions, keepExistingFavorites: isSelected })
                  }
                />
              </div>
            </div>
            <div className='flex justify-between'>
              <Button className='button-secondary!' onPress={() => setImportStage('preview')}>
                Back to Preview
              </Button>
              <Button
                color='primary'
                startContent={<Upload className='size-4' />}
                onPress={handleImport}
                isLoading={isBusy}
              >
                Import Library
              </Button>
            </div>
          </>
        );
      case 'complete':
        return (
          <div className='flex flex-col items-center justify-center py-8'>
            <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/20'>
              <CheckCircle2 className='size-8 text-green-500' />
            </div>
            <h3 className='text-Primary-50 mb-2 text-lg font-medium'>Import Successful!</h3>
            <p className='text-Grey-300 max-w-xs text-center'>Your library has been updated.</p>
          </div>
        );
      default:
        return null;
    }
  }

  return <div className='space-y-8'>{renderStage()}</div>;
}
