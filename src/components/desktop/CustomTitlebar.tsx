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
      className="fixed top-0 left-0 right-0 h-9 z-[9999] flex items-center bg-Grey-900 border-b border-white/5"
      style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitAppRegion: 'drag' } as React.CSSProperties}
    >

      <TitlebarMenu />
      
      <div className="flex flex-1 justify-center items-center gap-2 px-3 pointer-events-none">
        <img src="/images/logo.svg" alt="Watchfolio" className="size-5" />
        <span className="text-Primary-50 text-sm font-medium select-none  pointer-events-none">Watchfolio</span>
      </div>

      <div className="ml-auto flex items-center">
        <SyncStatusIndicator />
        <div className="flex items-center pointer-events-auto" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <button
            onClick={handleMinimize}
            className="h-8 w-12 flex items-center justify-center hover:bg-white/5 transition-colors"
            aria-label="Minimize"
          >
            <Minus className="size-3.5 text-Grey-400 group-hover:text-white" />
          </button>
          <button
            onClick={handleMaximize}
            className="h-8 w-12 flex items-center justify-center hover:bg-white/5 transition-colors"
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <Square className="size-3 text-Grey-400 group-hover:text-white" />
            ) : (
              <Maximize2 className="size-3 text-Grey-400 group-hover:text-white" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="h-8 w-12 flex items-center justify-center hover:bg-red-500 transition-colors group"
            aria-label="Close"
          >
            <X className="size-3.5 text-Grey-400 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>  
  );
}
