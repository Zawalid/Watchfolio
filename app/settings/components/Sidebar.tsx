'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoughNotation } from 'react-rough-notation';

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
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li
      className={`text-lg transition-colors duration-300 ${isActive ? 'text-Primary/200' : 'text-Grey/400 hover:text-Primary/200'}`}
    >
      <RoughNotation type='underline' show={isActive} color='#1ea5fc' padding={10} strokeWidth={2}>
        <Link href={href}>{label}</Link>
      </RoughNotation>
    </li>
  );
}
