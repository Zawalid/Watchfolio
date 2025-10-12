import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { useDesktopActions } from '@/contexts/DesktopActionsContext';
import { useNavigate, useLocation } from 'react-router';
import { isDesktop } from '@/lib/platform';
import { getLinks } from '@/components/navbar/Shared';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { slugify } from '@/utils';
import {
  Settings,
  RotateCw,
  Keyboard,
  Github,
  Bug,
  Plus,
  Upload,
  Download,
  ExternalLink,
  Heart,
  Star,
  Zap,
  GalleryVerticalEnd,
  BarChart3,
} from 'lucide-react';

const libraryMenuItems = [
  {
    label: 'All',
    icon: GalleryVerticalEnd,
    value: 'all',
    link: '/library/all',
  },
  ...LIBRARY_MEDIA_STATUS.map((status) => {
    const IconComponent = status.icon;
    return {
      label: status.label,
      icon: IconComponent,
      value: status.value,
      link: `/library/${slugify(status.value)}`,
    };
  }),
];

// File Menu Component
function FileMenu() {
  const navigate = useNavigate();
  const { quickAdd, openImportExport, triggerSync } = useDesktopActions();

  return (
    <DropdownMenu
      aria-label='File menu'
      itemClasses={{
        base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm text-Grey-200 hover:text-Primary-50 data-[focus=true]:text-Primary-50',
      }}
    >
      <DropdownSection title='New'>
        <DropdownItem
          key='quick-add'
          startContent={<Plus className='size-4' />}
          onPress={quickAdd}
          endContent={<span className='text-Grey-500 text-xs'>Ctrl+N</span>}
        >
          Add Media
        </DropdownItem>
      </DropdownSection>

      <DropdownSection title='Data' showDivider>
        <DropdownItem key='import' startContent={<Upload className='size-4' />} onPress={openImportExport}>
          Import Library
        </DropdownItem>
        <DropdownItem key='export' startContent={<Download className='size-4' />} onPress={openImportExport}>
          Export Library
        </DropdownItem>
        <DropdownItem key='sync' startContent={<RotateCw className='size-4' />} onPress={triggerSync}>
          Sync Library
        </DropdownItem>
      </DropdownSection>

      <DropdownSection title='Settings'>
        <DropdownItem
          key='preferences'
          startContent={<Settings className='size-4' />}
          onPress={() => navigate('/settings/preferences')}
        >
          Preferences
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}

// Edit Menu Component
function EditMenu() {
  const { quickSearch } = useDesktopActions();

  return (
    <DropdownMenu
      aria-label='Edit menu'
      itemClasses={{
        base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm text-Grey-200 hover:text-Primary-50 data-[focus=true]:text-Primary-50',
      }}
    >
      <DropdownSection title='Search' showDivider>
        <DropdownItem
          key='quick-search'
          startContent={<Zap className='size-4' />}
          onPress={quickSearch}
          endContent={<span className='text-Grey-500 text-xs'>Ctrl+K</span>}
        >
          Quick Search
        </DropdownItem>
      </DropdownSection>

      <DropdownSection title='Actions'>
        <DropdownItem
          key='toggle-favorite'
          startContent={<Heart className='size-4' />}
          endContent={<span className='text-Grey-500 text-xs'>Alt+F</span>}
        >
          Toggle Favorite
        </DropdownItem>
        <DropdownItem
          key='rate-media'
          startContent={<Star className='size-4' />}
          endContent={<span className='text-Grey-500 text-xs'>Alt+R</span>}
        >
          Rate Media
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}

// View Menu Component
function ViewMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);
  const mainLinks = getLinks(['home', 'library', 'movies', 'tv', 'search']);
  const discoverLinks = getLinks(['mood-match', 'collections', 'celebrities', 'networks']);

  return (
    <DropdownMenu
      aria-label='View menu'
      itemClasses={{
        base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm data-[focus=true]:text-Primary-50',
      }}
    >
      <DropdownSection title='Navigation' showDivider>
        {mainLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <DropdownItem
              key={link.id}
              startContent={<IconComponent className='size-4' />}
              onPress={() => navigate(link.href)}
              className={
                isActive(link.href) ? 'text-Primary-400! bg-Primary-500/20!' : 'text-Grey-200 hover:text-Primary-50'
              }
              endContent={<span className='text-Grey-500 text-xs'>Ctrl+{index + 1}</span>}
            >
              {link.label}
            </DropdownItem>
          );
        })}
      </DropdownSection>

      <DropdownSection title='Discover'>
        {discoverLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <DropdownItem
              key={link.id}
              startContent={<IconComponent className='size-4' />}
              onPress={() => navigate(link.href)}
              className={
                isActive(link.href) ? 'text-Primary-400! bg-Primary-500/20!' : 'text-Grey-200 hover:text-Primary-50'
              }
            >
              {link.label}
            </DropdownItem>
          );
        })}
      </DropdownSection>
    </DropdownMenu>
  );
}

// Library Menu Component
function LibraryMenu() {
  const navigate = useNavigate();

  return (
    <DropdownMenu
      aria-label='Library menu'
      itemClasses={{
        base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm text-Grey-200 hover:text-Primary-50 data-[focus=true]:text-Primary-50',
      }}
    >
      <DropdownSection title='Browse' showDivider>
        {libraryMenuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <DropdownItem
              key={item.value}
              startContent={<IconComponent className='size-4' />}
              onPress={() => navigate(item.link)}
            >
              {item.label}
            </DropdownItem>
          );
        })}
      </DropdownSection>

      <DropdownSection title='Insights'>
        <DropdownItem
          key='statistics'
          startContent={<BarChart3 className='size-4' />}
          onPress={() => navigate('/u/stats')}
        >
          Statistics
        </DropdownItem>
        <DropdownItem
          key='library-settings'
          startContent={<Settings className='size-4' />}
          onPress={() => navigate('/settings/library')}
        >
          Library Settings
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}

// Help Menu Component
function HelpMenu() {
  const { checkForUpdates, openKeyboardShortcuts } = useDesktopActions();

  return (
    <DropdownMenu
      aria-label='Help menu'
      itemClasses={{
        base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm text-Grey-200 hover:text-Primary-50 data-[focus=true]:text-Primary-50',
      }}
    >
      <DropdownSection title='Resources' showDivider>
        <DropdownItem
          key='shortcuts'
          startContent={<Keyboard className='size-4' />}
          onPress={openKeyboardShortcuts}
          endContent={<span className='text-Grey-500 text-xs'>?</span>}
        >
          Keyboard Shortcuts
        </DropdownItem>
      </DropdownSection>

      <DropdownSection title='Support' showDivider>
        <DropdownItem
          key='report'
          startContent={<Bug className='size-4' />}
          onPress={() => window.open('https://github.com/zawalid/watchfolio/issues', '_blank')}
          endContent={<ExternalLink className='size-3' />}
        >
          Report Issue
        </DropdownItem>
        <DropdownItem
          key='github'
          startContent={<Github className='size-4' />}
          onPress={() => window.open('https://github.com/zawalid/watchfolio', '_blank')}
          endContent={<ExternalLink className='size-3' />}
        >
          GitHub Repository
        </DropdownItem>
      </DropdownSection>

      <DropdownSection title='About'>
        <DropdownItem key='updates' startContent={<RotateCw className='size-4' />} onPress={checkForUpdates}>
          Check for Updates
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}

export function TitlebarMenu() {
  if (!isDesktop()) return null;

  const menuButtonClass =
    'h-8 px-3 text-xs text-Grey-400 hover:bg-white/5 hover:text-white transition-colors pointer-events-auto';

  return (
    <div
      className='pointer-events-none flex h-8 items-center'
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      {/* FILE MENU */}
      <Dropdown
        classNames={{
          base: 'min-w-52',
          content: 'backdrop-blur-xl bg-blur border border-white/5 p-1',
        }}
        placement='bottom-start'
      >
        <DropdownTrigger>
          <button className={menuButtonClass}>File</button>
        </DropdownTrigger>
        <FileMenu />
      </Dropdown>

      {/* EDIT MENU */}
      <Dropdown
        classNames={{
          base: 'min-w-52',
          content: 'backdrop-blur-xl bg-blur border border-white/5 p-1',
        }}
        placement='bottom-start'
      >
        <DropdownTrigger>
          <button className={menuButtonClass}>Edit</button>
        </DropdownTrigger>
        <EditMenu />
      </Dropdown>

      {/* VIEW MENU */}
      <Dropdown
        classNames={{
          base: 'min-w-52',
          content: 'backdrop-blur-xl bg-blur border border-white/5 p-1',
        }}
        placement='bottom-start'
      >
        <DropdownTrigger>
          <button className={menuButtonClass}>View</button>
        </DropdownTrigger>
        <ViewMenu />
      </Dropdown>

      {/* LIBRARY MENU */}
      <Dropdown
        classNames={{
          base: 'min-w-52',
          content: 'backdrop-blur-xl bg-blur border border-white/5 p-1',
        }}
        placement='bottom-start'
      >
        <DropdownTrigger>
          <button className={menuButtonClass}>Library</button>
        </DropdownTrigger>
        <LibraryMenu />
      </Dropdown>

      {/* HELP MENU */}
      <Dropdown
        classNames={{
          base: 'min-w-52',
          content: 'backdrop-blur-xl bg-blur border border-white/5 p-1',
        }}
        placement='bottom-start'
      >
        <DropdownTrigger>
          <button className={menuButtonClass}>Help</button>
        </DropdownTrigger>
        <HelpMenu />
      </Dropdown>
    </div>
  );
}
