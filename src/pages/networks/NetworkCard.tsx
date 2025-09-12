import { cn } from '@/utils';
import { Button } from '@heroui/react';
import { Link } from 'react-router';

export default function NetworkCard({
  network,
  className,
  type = 'link',
  isSelected,
  onSelect,
}: {
  network: Network;
  className?: string;
  type?: 'link' | 'button';
  isSelected?: boolean;
  onSelect?: (network: Network) => void;
}) {
  if (type === 'link') {
    return (
      <Link
        key={network.id}
        to={`/networks/${network.slug}`}
        className={cn(
          'hover:bg-blur group grid min-h-38 mobile:aspect-video place-content-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20',
          className
        )}
      >
        <img
          src={network.logo}
          alt={network.name}
          className={cn(
            'h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105',
            network.invertOnHover && 'group-hover:invert'
          )}
        />
      </Link>
    );
  }
  return (
    <Button className='selectable-button! h-28 w-32' data-is-selected={isSelected} onPress={() => onSelect?.(network)}>
      {network.logo ? (
        <img
          src={network.logo}
          alt={network.name}
          className={cn(
            'max-h-20 object-contain transition-all duration-300 group-hover:scale-105',
            isSelected && 'invert',
            network.invertOnHover && 'group-hover:invert'
          )}
          loading='lazy'
        />
      ) : (
        network.name
      )}
    </Button>
  );
}
