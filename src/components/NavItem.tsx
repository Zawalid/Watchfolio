import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  matches?: string[];
  className?: string;
}

export default function NavItem({ label, icon, href, matches = [], className = '' }: NavItemProps) {
  const location = useLocation();

  const isActive =
    matches.length > 0
      ? matches.some((match) => (match === '/' ? location.pathname === match : location.pathname.startsWith(match)))
      : location.pathname === href;

  return (
    <Link
      to={href}
      className={`group relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'text-white'
          : 'text-Grey-300 border border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white'
      } ${className}`}
    >
      {/* Active background and border */}
      {isActive && (
        <motion.div
          layoutId='navbar-active-background'
          className='from-Primary-500/20 to-Secondary-500/20 border-Primary-500/30 shadow-Primary-500/10 absolute inset-0 rounded-t-xl border bg-gradient-to-r shadow-lg'
          transition={{ 
            type: 'spring',
            stiffness: 500,
            damping: 30,
            duration: 0.4
          }}
        />
      )}

      <span className='relative transition-transform group-hover:scale-110 [&>svg]:h-4 [&>svg]:w-4'>{icon}</span>
      <span className='relative font-medium'>{label}</span>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId='navbar-active-indicator'
          className='from-Primary-400 via-Secondary-400 to-Tertiary-400 absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r'
          transition={{ 
            type: 'spring',
            stiffness: 500,
            damping: 30,
            duration: 0.4
          }}
        />
      )}

      {/* Hover glow effect */}
      <div className='from-Primary-500/0 via-Secondary-500/0 to-Tertiary-500/0 group-hover:from-Primary-500/5 group-hover:via-Secondary-500/5 group-hover:to-Tertiary-500/5 absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-300' />
    </Link>
  );
}
