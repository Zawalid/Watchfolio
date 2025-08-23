import { useCallback, useState } from 'react';
import { AlertTriangle, CheckCircle2, Upload, HelpCircle } from 'lucide-react';
import { Button } from '@heroui/react';
import { Select, SelectItem, SelectSection } from '@heroui/react';
import { Switch } from '@heroui/react';
import { Tooltip } from '@heroui/react';
import { FileDropper } from '@/components/ui/FileDropper';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { generateMediaId } from '@/utils/library';
import { addToast } from '@heroui/react';
import { useImportParser } from '@/hooks/useImportParser';
import { LIBRARY_IMPORT_MAX_SIZE } from '@/utils/constants';

interface ImportProps {
  onClose: () => void;
}

// Strategy descriptions for better user understanding
const STRATEGY_DESCRIPTIONS = {
  smart: 'Updates existing items with new data while preserving your ratings and custom fields. Adds new items.',
  overwrite: 'Replaces all existing items with imported data. Your current settings for these items will be lost.',
  skip: 'Only adds new items. Existing items in your library will remain unchanged.',
};

export default function Import({ onClose }: ImportProps) {
  const [importPreview, setImportPreview] = useState<{
    totalItems: number;
    movies: number;
    tvShows: number;
    newItems: number;
    updatedItems: number;
  } | null>(null);
  const [importStage, setImportStage] = useState<'select' | 'preview' | 'options' | 'complete'>('select');
  const [importOptions, setImportOptions] = useState({
    mergeStrategy: 'smart' as 'smart' | 'overwrite' | 'skip',
    keepExistingFavorites: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<LibraryMedia[] | null>(null);

  const library = useLibraryStore((state) => state.library);
  const { importLibrary } = useLibraryStore();

  // Use the import parser hook for WebWorker processing
  const { parseContent, isProcessing } = useImportParser({
    onSuccess: (items) => {
      setParsedItems(items as LibraryMedia[]);

      // Calculate preview information
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

      // Validate that we're actually importing something useful
      if (newItemsCount === 0 && updatedItemsCount === 0) {
        addToast({
          title: 'No new items found.',
          description: 'The import file contains no new items for your library.',
          color: 'warning',
        });
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
    },
  });

  // Add better file validation before processing
  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];

    // Double Check
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['json', 'csv'].includes(fileExtension)) {
      addToast({ title: 'Invalid file format.', description: 'Please select a JSON or CSV file.', color: 'danger' });
      return;
    }

    if (file.size > LIBRARY_IMPORT_MAX_SIZE) {
      addToast({ title: 'File is too large.', description: 'Maximum size is 10MB.', color: 'danger' });
      return;
    }

    if (file.size === 0) {
      addToast({ title: 'The file is empty.', description: 'Please select a non-empty file.', color: 'danger' });
      return;
    }

    processFile(file);
  };

  const processFile = useCallback(
    (file: File) => {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;

          if (!content || content.trim() === '') throw new Error('The file appears to be empty');

          // Determine format from file extension
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          const format = fileExtension === 'json' ? 'json' : 'csv';

          // Use WebWorker to parse the content
          parseContent(content, format);
        } catch (error) {
          console.error('File reading error:', error);
          addToast({
            title: 'File reading error',
            description: error instanceof Error ? error.message : 'Error reading file',
            color: 'danger',
          });
        }
      };

      reader.onerror = () => {
        addToast({
          title: 'File reading error',
          description: 'Failed to read the file. It may be corrupted or inaccessible.',
          color: 'danger',
        });
      };

      reader.readAsText(file);
    },
    [parseContent]
  );

  const handleImport = useCallback(async () => {
    if (!parsedItems) {
      addToast({ title: 'No data to import', description: 'Please select a valid file to import.', color: 'warning' });
      return;
    }

    try {
      // Validate import options
      if (!importOptions.mergeStrategy || !['smart', 'overwrite', 'skip'].includes(importOptions.mergeStrategy)) {
        throw new Error('Invalid merge strategy selected');
      }

      // Confirmation for overwrite strategy
      if (importOptions.mergeStrategy === 'overwrite' && Object.keys(library || {}).length > 0) {
        console.info('Overwriting existing library...');
      }

      // Use already parsed items for import
      const importedCount = await importLibrary(parsedItems, importOptions);

      // Validate the result
      if (importedCount === 0) {
        addToast({ title: 'No items imported', description: 'No items were imported or updated', color: 'warning' });
        return;
      }

      setImportStage('complete');

      setTimeout(() => {
        addToast({
          title: 'Import successful',
          description: `${importedCount} items imported/updated successfully!`,
          color: 'success',
        });
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Import error:', error);
      addToast({
        title: 'Import error',
        description: `Failed to import library: ${error instanceof Error ? error.message : 'Unknown error'}`,
        color: 'danger',
      });
    }
  }, [parsedItems, importOptions, library, importLibrary, onClose]);

  const handleReset = () => {
    setSelectedFile(null);
    setImportStage('select');
    setImportPreview(null);
  };

  function renderStage() {
    switch (importStage) {
      case 'select':
        return (
          <>
            <p className='text-Grey-300 text-sm'>
              Import a previously exported library file. This will merge the data with your existing library.
            </p>

            <div className='rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-left'>
              <div className='flex items-start gap-3'>
                <AlertTriangle className='size-5 flex-shrink-0 text-yellow-400' aria-hidden='true' />
                <div>
                  <h4 className='font-semibold text-yellow-300'>Important</h4>
                  <p className='mt-1 text-xs text-yellow-400/80'>
                    Importing will merge with your existing library. You'll have options to control how conflicts are
                    handled.
                  </p>
                </div>
              </div>
            </div>

            <FileDropper
              accept={{
                'application/json': ['.json'],
                'text/csv': ['.csv'],
              }}
              maxSize={LIBRARY_IMPORT_MAX_SIZE}
              maxFiles={1}
              multiple={false}
              onFileSelect={handleFileSelect}
              className='mt-4'
            />
          </>
        );
      case 'preview':
        if (!importPreview || !selectedFile) return null;
        return (
          <>
            <div className='space-y-4'>
              <div className='text-Primary-300 flex items-center gap-2 text-sm font-medium'>
                <CheckCircle2 className='size-4 text-green-400' aria-hidden='true' />
                <span>File loaded successfully: {selectedFile.name}</span>
              </div>
              <h3 className='text-Primary-50 font-medium'>Import Preview</h3>

              <div className='bg-blur space-y-3 rounded-lg border border-white/10 p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-Grey-300 text-sm'>Total Items</span>
                  <span className='text-Primary-50 font-medium'>{importPreview.totalItems}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-Grey-300 text-sm'>Movies</span>
                  <span className='text-Primary-50'>{importPreview.movies}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-Grey-300 text-sm'>TV Shows</span>
                  <span className='text-Primary-50'>{importPreview.tvShows}</span>
                </div>

                <div className='my-2 border-t border-white/10'></div>

                <div className='flex items-center justify-between'>
                  <span className='text-Grey-300 text-sm'>New Items</span>
                  <span className='text-green-400'>{importPreview.newItems}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-Grey-300 text-sm'>Updated Items</span>
                  <span className='text-blue-400'>{importPreview.updatedItems}</span>
                </div>
              </div>
            </div>

            <div className='flex justify-between'>
              <Button
                className='button-secondary!'
                onPress={handleReset}
                aria-label='Choose another file'
                isDisabled={isProcessing}
              >
                Choose Another File
              </Button>

              <Button
                color='primary'
                onPress={() => setImportStage('options')}
                aria-label='Continue to import options'
                isDisabled={isProcessing}
              >
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
                  <div className='flex items-center gap-1'>
                    <label htmlFor='merge-strategy' className='text-Grey-300 text-sm'>
                      Merge Strategy
                    </label>
                    <Tooltip
                      content='How to handle conflicts between your library and imported data'
                      className='tooltip-secondary!'
                    >
                      <HelpCircle className='text-Grey-400 size-3.5' />
                    </Tooltip>
                  </div>
                  <Select
                    id='merge-strategy'
                    aria-label='Merge strategy'
                    classNames={{ ...SELECT_CLASSNAMES, trigger: SELECT_CLASSNAMES.trigger + ' w-full' }}
                    selectedKeys={[importOptions.mergeStrategy]}
                    onChange={(e) => {
                      if (e) {
                        setImportOptions({
                          ...importOptions,
                          mergeStrategy: e.target.value as 'smart' | 'overwrite' | 'skip',
                        });
                      }
                    }}
                    isDisabled={isProcessing}
                  >
                    <SelectSection title='Conflict Resolution'>
                      <SelectItem key='smart'>Smart Merge</SelectItem>
                      <SelectItem key='overwrite'>Overwrite Existing</SelectItem>
                      <SelectItem key='skip'>Skip Existing</SelectItem>
                    </SelectSection>
                  </Select>
                </div>

                {/* Strategy description */}
                <div className='bg-Secondary-500/10 border-Secondary-500/20 rounded-md border px-3 py-2'>
                  <p className='text-Secondary-300 text-xs'>{STRATEGY_DESCRIPTIONS[importOptions.mergeStrategy]}</p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <label htmlFor='keep-favorites' className='text-Grey-300 text-sm'>
                    Keep Existing Favorites
                  </label>
                  <Tooltip
                    content='Preserve your favorite status even when overwriting items'
                    className='tooltip-secondary!'
                  >
                    <HelpCircle className='text-Grey-400 size-3.5' />
                  </Tooltip>
                </div>
                <Switch
                  id='keep-favorites'
                  aria-label='Keep existing favorites'
                  isSelected={importOptions.keepExistingFavorites}
                  onValueChange={(val) => setImportOptions({ ...importOptions, keepExistingFavorites: val })}
                  isDisabled={isProcessing}
                />
              </div>
            </div>
            <div className='flex justify-between'>
              <Button
                className='button-secondary!'
                onPress={() => setImportStage('preview')}
                aria-label='Back to preview'
                isDisabled={isProcessing}
              >
                Back to Preview
              </Button>

              <Button
                color='primary'
                startContent={<Upload className='size-4' aria-hidden='true' />}
                onPress={handleImport}
                aria-label='Import library'
                isDisabled={isProcessing}
                isLoading={isProcessing}
              >
                Import Library
              </Button>
            </div>
          </>
        );
      case 'complete':
        return (
          <div className='flex flex-col items-center justify-center py-8' role='status' aria-live='polite'>
            <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/20'>
              <CheckCircle2 className='size-8 text-green-500' aria-hidden='true' />
            </div>
            <h3 className='text-Primary-50 mb-2 text-lg font-medium'>Import Successful!</h3>
            <p className='text-Grey-300 max-w-xs text-center'>Your library has been updated with the imported data.</p>
          </div>
        );
      default:
        return null;
    }
  }

  return <div className='space-y-8'>{renderStage()}</div>;
}
