import { addToast } from '@heroui/toast';
import { useCallback, useState } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      addToast({
        title: 'Copied to clipboard',
        description: 'The link has been copied to your clipboard',
        color: 'success',
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);

      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopied(false);
      return false;
    }
  }, []);

  return { copied, copy };
}
