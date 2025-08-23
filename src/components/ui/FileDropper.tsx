import { useState, useCallback, useMemo } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, X, File, CheckCircle2 } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { cn } from '@/utils';
import { Button } from '@heroui/react';
import { addToast } from '@heroui/react';

interface FileUploadStatus {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileDropperProps {
  onFileSelect: (files: File[]) => void;
  value?: File | File[];
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  className?: string;
  maxFiles?: number;
  disabled?: boolean;
}

export function FileDropper({
  onFileSelect,
  value,
  accept = {},
  multiple = true,
  maxSize = 5242880, // 5MB
  maxFiles = 10,
  className,
  disabled
}: FileDropperProps) {
  const [, setError] = useState<string>('');
  const [fileStatuses, setFileStatuses] = useState<Map<string, FileUploadStatus>>(new Map());

  const files = useMemo(() => (Array.isArray(value) ? value : value ? [value] : []), [value]);

  const simulateUpload = (file: File) => {
    const fileId = `${file.name}-${file.size}`;
    setFileStatuses((prev) => new Map(prev).set(fileId, { progress: 0, status: 'uploading' }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFileStatuses((prev) => new Map(prev).set(fileId, { progress: 100, status: 'completed' }));
      } else {
        setFileStatuses((prev) => new Map(prev).set(fileId, { progress, status: 'uploading' }));
      }
    }, 500);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError('');
      const newFiles = [...files, ...acceptedFiles];
      if (newFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        addToast({
          title: 'Too many files',
          description: `Maximum ${maxFiles} files allowed`,
          color: 'danger',
        });
        return;
      }
      acceptedFiles.forEach((file) => simulateUpload(file));
      onFileSelect(newFiles);
    },
    [files, onFileSelect, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    onDropRejected: (fileRejections: FileRejection[]) => {
      const error = fileRejections[0]?.errors[0];
      let errorMessage = 'Error uploading file';
      let errorDetails = '';

      if (error.code === 'file-too-large') {
        errorMessage = 'File is too large';
        errorDetails = `Maximum size is ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
      } else if (error.code === 'file-invalid-type') {
        errorMessage = 'Invalid file type';
        errorDetails = 'Please check the accepted file types';
      } else if (error.code === 'too-many-files') {
        errorMessage = 'Too many files';
        errorDetails = `Maximum ${maxFiles} files allowed`;
      }

      setError(errorMessage);
      addToast({
        title: errorMessage,
        description: errorDetails,
        color: 'danger',
      });
    },
    disabled,
  });

  const [parent] = useAutoAnimate();

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    const fileId = `${fileToRemove.name}-${fileToRemove.size}`;
    const newFiles = files.filter((_, i) => i !== index);
    onFileSelect(newFiles);
    setError('');
    setFileStatuses((prev) => {
      const newStatuses = new Map(prev);
      newStatuses.delete(fileId);
      return newStatuses;
    });
  };

  // Recommendations:

  // 1. Add file type checking icons based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'json':
        return <File className='h-4 w-4 text-blue-400' />;
      case 'csv':
        return <File className='h-4 w-4 text-green-400' />;
      default:
        return <File className='text-Primary-300 h-4 w-4' />;
    }
  };

  // 2. Add retry capability for failed uploads
  const retryUpload = (file: File) => {
    const fileId = `${file.name}-${file.size}`;
    setFileStatuses((prev) => {
      const newStatuses = new Map(prev);
      newStatuses.set(fileId, { progress: 0, status: 'uploading' });
      return newStatuses;
    });

    addToast({
      title: 'Retrying upload',
      description: `Retrying upload for ${file.name}`,
      color: 'secondary',
    });

    simulateUpload(file);
  };

  return (
    <div className={className} ref={parent}>
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragActive
            ? 'border-Primary-400 bg-Primary-500/10'
            : 'hover:border-Primary-400/70 hover:bg-Primary-500/5 border-white/20',
          files.length > 0 && 'border-Primary-400/70',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center gap-2 text-center'>
          <div className='bg-Primary-500/20 grid size-12 place-content-center rounded-full'>
            <Upload className='text-Primary-300' size={20} strokeWidth={1.5} />
          </div>
          <p className='text-Primary-50 text-sm font-medium'>
            {isDragActive ? 'Drop the file here' : 'Drag & Drop your file here'}
          </p>
          <p className='text-Grey-300 text-xs font-normal'>
            or <span className='text-Primary-300 cursor-pointer'>browse</span> to choose a file
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className='mt-4 space-y-3' ref={parent}>
          {files.map((file, index) => {
            const fileId = `${file.name}-${file.size}`;
            const status = fileStatuses.get(fileId);

            return (
              <div key={`${file.name}-${index}`} className='rounded-md border border-white/10 bg-white/5 px-4 py-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    {getFileIcon(file.name)}
                    <span className='text-Primary-50 text-sm font-medium'>{file.name}</span>
                    <span className='text-Grey-300 text-xs'>
                      {file.size >= 1048576
                        ? `(${(file.size / 1048576).toFixed(2)} MB)`
                        : `(${(file.size / 1024).toFixed(1)} KB)`}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    {status?.status === 'completed' && <CheckCircle2 className='h-4 w-4 text-green-500' />}
                    <Button
                      type='button'
                      variant='ghost'
                      isIconOnly
                      className='text-Grey-400 h-8 w-8 hover:text-white'
                      onClick={() => removeFile(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                {status && status.status !== 'completed' && (
                  <div className='mt-2 space-y-2'>
                    <div className='h-1 w-full overflow-hidden rounded-full bg-white/10'>
                      <div className='bg-Primary-400 h-full rounded-full' style={{ width: `${status.progress}%` }} />
                    </div>
                    <p className='text-Grey-400 text-xs'>
                      {status.status === 'uploading'
                        ? `Processing... ${Math.round(status.progress)}%`
                        : status.error || 'Error processing file'}
                    </p>
                    {status.status === 'error' && (
                      <Button variant='ghost' size='sm' className='w-full' onPress={() => retryUpload(file)}>
                        Retry
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
