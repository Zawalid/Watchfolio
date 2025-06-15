import { useState, useEffect, useCallback, useRef } from 'react';

interface ImportParserOptions {
  onSuccess?: (data: LibraryMedia[]) => void;
  onError?: (error: string) => void;
}

export function useImportParser(options?: ImportParserOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<LibraryMedia[] | null>(null);

  // Use ref for worker to avoid recreation on each render
  const workerRef = useRef<Worker | null>(null);

  // Use refs for callbacks to avoid dependency changes triggering effect recreation
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  // Update callback refs when options change
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  // Create worker once on mount
  useEffect(() => {
    // Skip worker creation in SSR
    if (typeof window === 'undefined') return;

    try {
      // Create a new worker instance
      const importWorker = new Worker(new URL('../workers/library-import-parser.worker.ts', import.meta.url), {
        type: 'module',
      });

      // Set up message handler
      importWorker.onmessage = (event) => {
        const { type, data, error } = event.data;

        if (type === 'success') {
          setParsedData(data);
          setError(null);
          onSuccessRef.current?.(data);
        } else if (type === 'error') {
          setParsedData(null);
          setError(error);
          onErrorRef.current?.(error);
        }

        setIsProcessing(false);
      };

      // Store worker reference
      workerRef.current = importWorker;

      // Clean up worker on unmount
      return () => {
        importWorker.terminate();
        workerRef.current = null;
      };
    } catch (err) {
      console.error('Error creating WebWorker:', err);
      setError('WebWorkers are not supported in your browser or environment.');
      return undefined;
    }
  }, []); // Empty dependency array ensures worker is created once

  // Function to parse content
  const parseContent = useCallback((content: string, format: 'json' | 'csv') => {
    if (!workerRef.current) {
      setError('WebWorker not available. Try reloading the page.');
      onErrorRef.current?.('WebWorker not available. Try reloading the page.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setParsedData(null);

    workerRef.current.postMessage({
      type: 'parse',
      content,
      format,
    });
  }, []); 

  return {
    parseContent,
    isProcessing,
    error,
    parsedData,
  };
}
