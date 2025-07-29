import { Link, useLocation } from 'react-router';

const links = [
  { href: '/settings/profile', label: 'Profile' },
  { href: '/settings/privacy', label: 'Privacy & Security' },
  { href: '/settings/preferences', label: 'Preferences' },
  { href: '/settings/library', label: 'Library' },
];

export default function Sidebar() {
  return (
    <ul className='flex flex-col gap-1'>
      {links.map((link) => (
        <Item key={link.href} href={link.href} label={link.label} />
      ))}
    </ul>
  );
}

function Item({ href, label }: { href: string; label: string }) {
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = pathname === href;

  return (
    <li>
      <Link
        to={href}
        className={`block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
          isActive
            ? 'bg-Primary-500/10 text-Primary-300 border-Primary-400 border-l-2'
            : 'text-Grey-400 hover:text-Grey-200 hover:bg-white/5'
        }`}
      >
        {label}
      </Link>
    </li>
  );
}
