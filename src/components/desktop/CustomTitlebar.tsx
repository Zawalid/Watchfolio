import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { isDesktop } from '@/lib/platform';
import { TitlebarMenu } from './TitlebarMenu';
import { SyncStatusIndicator } from './SyncStatusIndicator';

export function CustomTitlebar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!isDesktop()) return;

    const checkMaximized = async () => {
      const appWindow = getCurrentWindow();
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    };

    checkMaximized();

    const appWindow = getCurrentWindow();
    const unlisten = appWindow.listen('tauri://resize', checkMaximized);

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  if (!isDesktop()) return null;

  const handleMinimize = () => {
    getCurrentWindow().minimize();
  };

  const handleMaximize = () => {
    const appWindow = getCurrentWindow();
    if (isMaximized) {
      appWindow.unmaximize();
    } else {
      appWindow.maximize();
    }
  };

  const handleClose = () => {
    getCurrentWindow().hide();
  };

  return (
    <div
      data-tauri-drag-region
      className=' bg-Grey-900/40 fixed top-0 right-0 left-0 z-[9999] flex h-9 items-center border-b border-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl'
      style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <TitlebarMenu />

      <div className='pointer-events-none flex flex-1 items-center justify-center gap-2 px-3'>
        <img src='/images/logo.svg' alt='Watchfolio' className='size-5' />
        <span className='text-Primary-50 pointer-events-none text-sm font-medium select-none'>Watchfolio</span>
      </div>

      <div className='ml-auto flex items-center'>
        <SyncStatusIndicator />
        <div
          className='pointer-events-auto flex items-center'
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            onClick={handleMinimize}
            className='flex h-8 w-12 items-center justify-center transition-colors hover:bg-white/5'
            aria-label='Minimize'
          >
            <Minus className='text-Grey-400 size-3.5 group-hover:text-white' />
          </button>
          <button
            onClick={handleMaximize}
            className='flex h-8 w-12 items-center justify-center transition-colors hover:bg-white/5'
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <Square className='text-Grey-400 size-3 group-hover:text-white' />
            ) : (
              <Maximize2 className='text-Grey-400 size-3 group-hover:text-white' />
            )}
          </button>
          <button
            onClick={handleClose}
            className='group flex h-8 w-12 items-center justify-center transition-colors hover:bg-red-500'
            aria-label='Close'
          >
            <X className='text-Grey-400 size-3.5 group-hover:text-white' />
          </button>
        </div>
      </div>
    </div>
  );
}
