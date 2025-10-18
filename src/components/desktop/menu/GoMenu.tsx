import { DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { useNavigate, useLocation } from 'react-router';
import { getLinks } from '@/components/navbar/Shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getShortcut } from '@/config/shortcuts';

export function GoMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);
  const mainLinks = getLinks(['home', 'library', 'movies', 'tv', 'search']);
  const discoverLinks = getLinks(['mood-match', 'collections', 'celebrities', 'networks']);

  return (
    <DropdownMenu
      aria-label='Go menu'
      itemClasses={{
        base: 'hover:bg-white/5! data-[focus=true]:bg-white/5! rounded-lg px-3 py-2 text-sm data-[focus=true]:text-Primary-50',
      }}
    >
      <DropdownSection title='Pages' showDivider>
        {mainLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <DropdownItem
              key={link.id}
              startContent={<IconComponent className='size-4' />}
              onPress={() => navigate(link.href)}
              className={isActive(link.href) ? 'text-Primary-400! bg-Primary-500/20!' : 'text-Grey-200 hover:text-Primary-50'}
              endContent={<span className='text-Grey-500 kbd-sm'>{link.shortcutName ? getShortcut(link.shortcutName)?.label : null}</span>}
            >
              {link.label}
            </DropdownItem>
          );
        })}
      </DropdownSection>

      <DropdownSection title='Explore' showDivider>
        {discoverLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <DropdownItem
              key={link.id}
              startContent={<IconComponent className='size-4' />}
              onPress={() => navigate(link.href)}
              className={isActive(link.href) ? 'text-Primary-400! bg-Primary-500/20!' : 'text-Grey-200 hover:text-Primary-50'}
            >
              {link.label}
            </DropdownItem>
          );
        })}
      </DropdownSection>

      <DropdownSection title='Navigation'>
        <DropdownItem
          key='go-back'
          startContent={<ChevronLeft className='size-4' />}
          onPress={() => navigate(-1)}
          endContent={getShortcut('goBack') && <span className='text-Grey-500 kbd-sm'>{getShortcut('goBack')?.label}</span>}
        >
          Back
        </DropdownItem>
        <DropdownItem
          key='go-forward'
          startContent={<ChevronRight className='size-4' />}
          onPress={() => navigate(1)}
          endContent={getShortcut('goForward') && <span className='text-Grey-500 kbd-sm'>{getShortcut('goForward')?.label}</span>}
        >
          Forward
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}
