import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useDesktopActions } from '@/contexts/DesktopActionsContext';
import { useNavigate, useLocation } from 'react-router';
import { isDesktop } from '@/lib/platform';
import { Settings, Search, Home, Library, Film, Tv, Sparkles, RotateCw, Keyboard, Github, Bug } from 'lucide-react';

export function TitlebarMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkForUpdates, openKeyboardShortcuts, quickSearch } = useDesktopActions();

  if (!isDesktop()) return null;

  const menuButtonClass = "h-8 px-3 text-xs text-Grey-400 hover:bg-white/5 hover:text-white transition-colors pointer-events-auto";

  return (
    <div className="flex items-center h-8 pointer-events-none" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
      <Dropdown
        classNames={{
          base: 'min-w-48',
          content: 'backdrop-blur-xl bg-blur blur-bg border border-white/5 p-1'
        }}
        placement='bottom-start'
      >
        <DropdownTrigger>
          <button className={menuButtonClass}>File</button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="File menu"
          itemClasses={{
            base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm text-Grey-200 hover:text-Primary-50 data-[focus=true]:text-Primary-50'
          }}
        >
          <DropdownItem
            key="preferences"
            startContent={<Settings className="size-4" />}
            onPress={() => navigate('/settings/preferences')}
          >
            Preferences
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown
        classNames={{
          base: 'min-w-48',
          content: 'backdrop-blur-xl bg-blur blur-bg border border-white/5 p-1'
        }}
        placement='bottom-start'
      >
        <DropdownTrigger>
          <button className={menuButtonClass}>Edit</button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Edit menu"
          itemClasses={{
            base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm text-Grey-200 hover:text-Primary-50 data-[focus=true]:text-Primary-50'
          }}
        >
          <DropdownItem
            key="search"
            startContent={<Search className="size-4" />}
            onPress={quickSearch}
          >
            Search
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown
        classNames={{
          base: 'min-w-48',
          content: 'backdrop-blur-xl bg-blur blur-bg border border-white/5 p-1'
        }}
        placement='bottom-start'
      >
        <DropdownTrigger>
          <button className={menuButtonClass}>View</button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="View menu"
          itemClasses={{
            base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm data-[focus=true]:text-Primary-50'
          }}
        >
          <DropdownItem
            key="home"
            startContent={<Home className="size-4" />}
            onPress={() => navigate('/')}
            className={location.pathname === '/' ? 'text-Primary-400! bg-Primary-500/20!' : 'text-Grey-200 hover:text-Primary-50'}
          >
            Home
          </DropdownItem>
          <DropdownItem
            key="library"
            startContent={<Library className="size-4" />}
            onPress={() => navigate('/library')}
            className={location.pathname === '/library' ? 'text-Primary-400! bg-Primary-500/20!' : 'text-Grey-200 hover:text-Primary-50'}
          >
            Library
          </DropdownItem>
          <DropdownItem
            key="movies"
            startContent={<Film className="size-4" />}
            onPress={() => navigate('/movies')}
            className={location.pathname === '/movies' ? 'text-Primary-400! bg-Primary-500/20!' : 'text-Grey-200 hover:text-Primary-50'}
          >
            Movies
          </DropdownItem>
          <DropdownItem
            key="tv"
            startContent={<Tv className="size-4" />}
            onPress={() => navigate('/tv')}
            className={location.pathname === '/tv' ? 'text-Primary-400! bg-Primary-500/20!' : 'text-Grey-200 hover:text-Primary-50'}
          >
            TV Shows
          </DropdownItem>
          <DropdownItem
            key="recommendations"
            startContent={<Sparkles className="size-4" />}
            onPress={() => navigate('/recommendations')}
            className={location.pathname === '/recommendations' ? 'text-Primary-400! bg-Primary-500/20!' : 'text-Grey-200 hover:text-Primary-50'}
          >
            Recommendations
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown
        classNames={{
          base: 'min-w-48',
          content: 'backdrop-blur-xl bg-blur blur-bg border border-white/5 p-1'
        }}
        placement='bottom-start'
      >
        <DropdownTrigger>
          <button className={menuButtonClass}>Help</button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Help menu"
          itemClasses={{
            base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm text-Grey-200 hover:text-Primary-50 data-[focus=true]:text-Primary-50'
          }}
        >
          <DropdownItem
            key="updates"
            startContent={<RotateCw className="size-4" />}
            onPress={checkForUpdates}
          >
            Check for Updates
          </DropdownItem>
          <DropdownItem
            key="shortcuts"
            startContent={<Keyboard className="size-4" />}
            onPress={openKeyboardShortcuts}
          >
            Keyboard Shortcuts
          </DropdownItem>
          <DropdownItem
            key="github"
            startContent={<Github className="size-4" />}
            onPress={() => window.open('https://github.com/zawalid/watchfolio', '_blank')}
          >
            View on GitHub
          </DropdownItem>
          <DropdownItem
            key="report"
            startContent={<Bug className="size-4" />}
            onPress={() => window.open('https://github.com/zawalid/watchfolio/issues', '_blank')}
          >
            Report Issue
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
