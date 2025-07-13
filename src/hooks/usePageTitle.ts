import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Watchfolio` : 'Watchfolio';
    return () => {
      document.title = 'Watchfolio';
    };
  }, [title]);
}
