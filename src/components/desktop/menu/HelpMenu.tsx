import { DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { useUIStore } from '@/stores/useUIStore';
import { useDesktopActions } from '@/contexts/DesktopActionsContext';
import { Keyboard, Bug, Github, RotateCw, Info, ExternalLink } from 'lucide-react';
import { getShortcut } from '@/config/shortcuts';

export function HelpMenu() {
  const openShortcuts = useUIStore((state) => state.openShortcuts);
  const openAbout = useUIStore((state) => state.openAbout);
  const { checkForUpdates } = useDesktopActions();

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
          onPress={openShortcuts}
          endContent={
            getShortcut('toggleShortcutsHelp') && (
              <span className='text-Grey-500 kbd-sm'>{getShortcut('toggleShortcutsHelp')?.label}</span>
            )
          }
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
        <DropdownItem key='about' startContent={<Info className='size-4' />} onPress={openAbout}>
          About Watchfolio
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}
