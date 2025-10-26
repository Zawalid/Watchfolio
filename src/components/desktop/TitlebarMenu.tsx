import { Dropdown, DropdownTrigger } from '@heroui/react';
import { isDesktop } from '@/lib/platform';
import { Navigation } from './menu/Navigation';
import { FileMenu } from './menu/FileMenu';
import { ViewMenu } from './menu/ViewMenu';
import { LibraryMenu } from './menu/LibraryMenu';
import { GoMenu } from './menu/GoMenu';
import { HelpMenu } from './menu/HelpMenu';

export function TitlebarMenu() {
  if (!isDesktop()) return null;

  const menuButtonClass =
    'h-8 px-3 text-xs text-Grey-400 hover:bg-white/5 hover:text-white transition-colors pointer-events-auto';

  const dropdownClassNames = {
    base: 'min-w-52',
    content: 'backdrop-blur-xl bg-blur border border-white/5 p-1',
  };

  return (
    <div
      className='pointer-events-none flex h-8 items-center'
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <Navigation />

      <Dropdown classNames={dropdownClassNames} placement='bottom-start'>
        <DropdownTrigger>
          <button className={menuButtonClass}>File</button>
        </DropdownTrigger>
        <FileMenu />
      </Dropdown>

      <Dropdown classNames={dropdownClassNames} placement='bottom-start'>
        <DropdownTrigger>
          <button className={menuButtonClass}>View</button>
        </DropdownTrigger>
        <ViewMenu />
      </Dropdown>

      <Dropdown classNames={dropdownClassNames} placement='bottom-start'>
        <DropdownTrigger>
          <button className={menuButtonClass}>Library</button>
        </DropdownTrigger>
        <LibraryMenu />
      </Dropdown>

      <Dropdown classNames={dropdownClassNames} placement='bottom-start'>
        <DropdownTrigger>
          <button className={menuButtonClass}>Go</button>
        </DropdownTrigger>
        <GoMenu />
      </Dropdown>

      <Dropdown classNames={dropdownClassNames} placement='bottom-start'>
        <DropdownTrigger>
          <button className={menuButtonClass}>Help</button>
        </DropdownTrigger>
        <HelpMenu />
      </Dropdown>
    </div>
  );
}
