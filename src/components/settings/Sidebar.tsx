import { Link, useLocation } from 'react-router';
import { User, Lock, Sliders, LibraryBig, Monitor } from 'lucide-react';

const links = [
  { href: '/settings/profile', label: 'Profile', icon: User },
  { href: '/settings/privacy', label: 'Privacy & Security', icon: Lock },
  { href: '/settings/preferences', label: 'Preferences', icon: Sliders },
  { href: '/settings/library', label: 'Library', icon: LibraryBig },
  { href: '/settings/devices', label: 'Devices', icon: Monitor },
];

export default function Sidebar() {
  return (
    <ul className="flex flex-col gap-1">
      {links.map((link) => (
        <Item key={link.href} href={link.href} label={link.label} icon={link.icon} />
      ))}
    </ul>
  );
}

type ItemProps = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function Item({ href, label, icon: Icon }: ItemProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = pathname === href;

  return (
    <li>
      <Link
        to={href}
        className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200 ${
          isActive
            ? 'bg-Primary-500/10 text-Primary-300 border-Primary-400 border-l-2'
            : 'text-Grey-400 hover:text-Grey-200 hover:bg-white/5'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
        <span>{label}</span>
      </Link>
    </li>
  );
}
