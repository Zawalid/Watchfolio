import { useEffect } from 'react';

export function usePageTitle(title?: string | null) {
  useEffect(() => {
    if (!title) return;
    
    document.title = title ? `${title} | Watchfolio` : 'Watchfolio';
    return () => {
      document.title = 'Watchfolio';
    };
  }, [title]);
}
