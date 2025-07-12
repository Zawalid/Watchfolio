import { cn } from '@/utils';
import { Link } from 'react-router';

export default function NetworkCard({ network }: { network: Network }) {
  return (
    <Link
      key={network.id}
      to={`/networks/${network.slug}`}
      className='hover:bg-blur group grid aspect-video place-content-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20'
    >
      <img
        src={network.logo}
        alt={network.name}
        className={cn(
          'h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105',
          network.invertOnHover &&
           'group-hover:invert'
        )}
      />
    </Link>
  );
}
