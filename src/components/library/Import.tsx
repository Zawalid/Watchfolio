import { useCallback, useState } from 'react';
import { AlertTriangle, CheckCircle2, Upload, HelpCircle } from 'lucide-react';
import { Button } from '@heroui/button';
import { Select, SelectItem, SelectSection } from '@heroui/select';
import { Switch } from '@heroui/switch';
import { Tooltip } from '@heroui/tooltip';
import { FileDropper } from '@/components/ui/FileDropper';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { generateMediaKey, parseImportContent } from '@/utils/library';
import { addToast } from '@heroui/toast';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const library = useLibraryStore((state) => state.library);
  const { importLibrary } = useLibraryStore();

  // Add better file validation before processing
  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];

    // Check file extension more explicitly
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['json', 'csv'].includes(fileExtension)) {
      addToast({ title: 'Invalid file format.', description: 'Please select a JSON or CSV file.', color: 'danger' });
      return;
    }

    // Add additional validation for file size
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      addToast({ title: 'File is too large.', description: 'Maximum size is 10MB.', color: 'danger' });
      return;
    }

    // Check for empty files
    if (file.size === 0) {
      addToast({ title: 'The file is empty.', description: 'Please select a non-empty file.', color: 'danger' });
      return;
    }

    processFile(file);
  };

  const processFile = useCallback(
    (file: File) => {
      setIsProcessing(true);
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;

          // Check for empty content
          if (!content || content.trim() === '') {
            throw new Error('The file appears to be empty');
          }

          setFileContent(content);

          // Try to parse the content to see if it's valid
          const importedItems = parseImportContent(content);

          // Additional validation - ensure we have at least some items
          if (!importedItems || importedItems.length === 0) {
            throw new Error('No valid items found in the import file');
          }

          // Categorize and count items
          const movieCount = importedItems.filter((item) => item.media_type === 'movie').length;
          const tvCount = importedItems.filter((item) => item.media_type === 'tv').length;

          const currentLibrary = library || {};
          let newItemsCount = 0;
          let updatedItemsCount = 0;

          for (const item of importedItems) {
            const key = generateMediaKey(item.media_type as 'movie' | 'tv', item.id);
            if (currentLibrary[key]) updatedItemsCount++;
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
            totalItems: importedItems.length,
            movies: movieCount,
            tvShows: tvCount,
            newItems: newItemsCount,
            updatedItems: updatedItemsCount,
          });

          setImportStage('preview');
        } catch (error) {
          console.error('File parsing error:', error);
          addToast({
            title: 'File parsing error',
            description:
              error instanceof Error ? `Error parsing file: ${error.message}` : 'The selected file is invalid.',
            color: 'danger',
          });
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = (event) => {
        console.error('File reading error:', event);
        addToast({
          title: 'File reading error',
          description: 'Failed to read the file. It may be corrupted or inaccessible.',
          color: 'danger',
        });
        setIsProcessing(false);
      };

      reader.readAsText(file);
    },
    [library]
  );

  const handleImport = useCallback(() => {
    if (!fileContent) {
      addToast({ title: 'No file selected', description: 'Please select a file to import.', color: 'warning' });
      return;
    }

    setIsProcessing(true);
    try {
      // Try to validate import options
      if (!importOptions.mergeStrategy || !['smart', 'overwrite', 'skip'].includes(importOptions.mergeStrategy)) {
        throw new Error('Invalid merge strategy selected');
      }

      // Confirmation for overwrite strategy
      if (importOptions.mergeStrategy === 'overwrite' && Object.keys(library || {}).length > 0) {
        // This is where you might want to add a confirmation dialog in a real app
        console.info('Overwriting existing library...');
      }

      const importedCount = importLibrary(fileContent, importOptions);

      // Validate the result
      if (importedCount === 0) {
        addToast({ title: 'No items imported', description: 'No items were imported or updated', color: 'warning' });
        setIsProcessing(false);
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
    } finally {
      setIsProcessing(false);
    }
  }, [fileContent, importLibrary, importOptions, library, onClose]);

  const handleReset = () => {
    setSelectedFile(null);
    setFileContent(null);
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
                className='button-secondary'
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
                      className='tooltip-secondary'
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
                    className='tooltip-secondary'
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
                className='button-secondary'
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
