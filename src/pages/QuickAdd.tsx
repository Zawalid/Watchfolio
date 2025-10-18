import { useEffect } from 'react';
import QuickAddModal from '@/components/modals/QuickAddModal';
import { isDesktop } from '@/lib/platform';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Providers } from '@/providers';


export default function QuickAddPage() {
  useEffect(() => {
    if (!isDesktop()) return;

    const handleEscape = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') await getCurrentWindow().hide();
    };

    const setupBlurListener = async () => {
      const unlisten = await getCurrentWindow().onFocusChanged(({ payload: focused }) => {
        if (!focused) getCurrentWindow().hide();
      });

      return unlisten;
    };

    window.addEventListener('keydown', handleEscape);
    const unlistenPromise = setupBlurListener();

    return () => {
      window.removeEventListener('keydown', handleEscape);
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  return (
    <Providers>
      <QuickAddModal standalone />
    </Providers>
  );
}
