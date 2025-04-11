import { Link, useLocation } from 'react-router';
import { RoughNotation } from 'react-rough-notation';

export default function NavItem({ link: { label, href, icon, checks } }: { link: Link }) {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = pathname === href || (pathname.includes(href) && checks && checks.some((c) => pathname.includes(c)));

  return (
    <RoughNotation type='highlight' show={isActive} color='#1ea5fc' >
      <li className='group'>
        <Link
          to={href}
          className={`flex items-center gap-1.5 font-medium transition-colors duration-300 hover:text-Grey-50 group-has-[.active]:font-semibold group-has-[.active]:text-Primary-400 ${isActive ? 'text-Grey-50' : 'text-Grey-300'}`}
        >
          <span className='[&>svg]:h-4'>{icon}</span>
          {label}
        </Link>
      </li>
    </RoughNotation>
  );
}
