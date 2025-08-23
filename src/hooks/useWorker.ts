// src/hooks/useWorker.ts

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWorkerOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useWorker<T>(workerUrl: URL, options?: UseWorkerOptions<T>) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const worker = new Worker(workerUrl, { type: 'module' });

      worker.onmessage = (event: MessageEvent) => {
        const { type, data, error } = event.data;
        if (type === 'success') {
          setData(data);
          setError(null);
          onSuccessRef.current?.(data);
        } else if (type === 'error') {
          setData(null);
          setError(error);
          onErrorRef.current?.(error);
        }
        setIsProcessing(false);
      };

      workerRef.current = worker;

      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch (err) {
      console.error('Error creating WebWorker:', err);
      setError('WebWorkers are not supported in this environment.');
    }
  }, [workerUrl]);

  const postMessage = useCallback((message: unknown) => {
    if (!workerRef.current) {
      const errorMsg = 'WebWorker not available. Try reloading the page.';
      setError(errorMsg);
      onErrorRef.current?.(errorMsg);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setData(null);
    workerRef.current.postMessage(message);
  }, []);

  return { postMessage, isProcessing, error, data };
}
