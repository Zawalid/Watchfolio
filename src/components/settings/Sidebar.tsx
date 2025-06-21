import { RoughNotation } from 'react-rough-notation';
import { Link, useLocation } from 'react-router';

const links = [
  { href: '/settings/account', label: 'Account' },
  { href: '/settings/general', label: 'General' },
];

export default function Sidebar() {
  return (
    <ul className='flex flex-col gap-6'>
      {links.map((link) => (
        <Item key={link.href} href={link.href} label={link.label} />
      ))}
    </ul>
  );
}

function Item({ href, label }: { href: string; label: string }) {
  const location = useLocation()
  const pathname = location.pathname;
  const isActive = pathname === href;

  return (
    <li
      className={`text-lg transition-colors duration-300 ${isActive ? 'text-Primary-200' : 'text-Grey-400 hover:text-Primary-200'}`}
    >
      <RoughNotation type='underline' show={isActive} color='#1ea5fc' padding={10} strokeWidth={2}>
        <Link to={href}>{label}</Link>
      </RoughNotation>
    </li>
  );
}
