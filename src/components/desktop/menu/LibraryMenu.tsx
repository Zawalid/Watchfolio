import { DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { useNavigate } from 'react-router';
import { useClearLibrary } from '@/hooks/library/useLibraryMutations';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { slugify } from '@/utils';
import { GalleryVerticalEnd, BarChart3, Settings, Trash2 } from 'lucide-react';
import { getShortcut } from '@/config/shortcuts';

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

export function LibraryMenu() {
  const navigate = useNavigate();
  const { clearLibrary } = useClearLibrary();

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
            <DropdownItem key={item.value} startContent={<IconComponent className='size-4' />} onPress={() => navigate(item.link)}>
              {item.label}
            </DropdownItem>
          );
        })}
      </DropdownSection>

      <DropdownSection title='Insights' showDivider>
        <DropdownItem key='statistics' startContent={<BarChart3 className='size-4' />} onPress={() => navigate('/u/stats')}>
          Statistics
        </DropdownItem>
        <DropdownItem key='library-settings' startContent={<Settings className='size-4' />} onPress={() => navigate('/settings/library')}>
          Library Settings
        </DropdownItem>
      </DropdownSection>

      <DropdownSection>
        <DropdownItem
          key='clear-library'
          startContent={<Trash2 className='size-4' />}
          onPress={clearLibrary}
          endContent={
            getShortcut('clearLibrary') && (
              <span className='text-Grey-500 kbd-sm'>{getShortcut('clearLibrary')?.label}</span>
            )
          }
          className='text-red-400! hover:text-red-300! hover:bg-red-500/10!'
        >
          Clear Library
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}
