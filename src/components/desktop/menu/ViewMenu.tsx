import { DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { useUIStore } from '@/stores/useUIStore';
import { GalleryVerticalEnd, Settings, RotateCw, Maximize } from 'lucide-react';
import { getShortcut } from '@/config/shortcuts';
import { isDesktop } from '@/lib/platform';

export function ViewMenu() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleFilters = useUIStore((state) => state.toggleFilters);

  const handleFullscreen = async () => {
    if (!isDesktop()) return;

    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const appWindow = getCurrentWindow();
      const isFullscreen = await appWindow.isFullscreen();
      await appWindow.setFullscreen(!isFullscreen);
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
  };

  return (
    <DropdownMenu
      aria-label='View menu'
      itemClasses={{
        base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm text-Grey-200 hover:text-Primary-50 data-[focus=true]:text-Primary-50',
      }}
    >
      <DropdownSection title='Layout' showDivider>
        <DropdownItem
          key='toggle-sidebar'
          startContent={<GalleryVerticalEnd className='size-4' />}
          onPress={toggleSidebar}
          endContent={
            getShortcut('toggleSidebar') && (
              <span className='text-Grey-500 kbd-sm'>{getShortcut('toggleSidebar')?.label}</span>
            )
          }
        >
          Toggle Sidebar
        </DropdownItem>
        <DropdownItem
          key='toggle-filters'
          startContent={<Settings className='size-4' />}
          onPress={toggleFilters}
          endContent={
            getShortcut('toggleFilters') && (
              <span className='text-Grey-500 kbd-sm'>{getShortcut('toggleFilters')?.label}</span>
            )
          }
        >
          Toggle Filters
        </DropdownItem>
      </DropdownSection>

      <DropdownSection title='Display'>
        <DropdownItem
          key='reload'
          startContent={<RotateCw className='size-4' />}
          onPress={() => window.location.reload()}
          endContent={<span className='text-Grey-500 kbd-sm'>Ctrl+R</span>}
        >
          Reload
        </DropdownItem>
        <DropdownItem
          key='fullscreen'
          startContent={<Maximize className='size-4' />}
          onPress={handleFullscreen}
          endContent={<span className='text-Grey-500 kbd-sm'>F11</span>}
        >
          Toggle Fullscreen
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}
