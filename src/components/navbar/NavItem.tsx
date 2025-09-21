import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';

interface NavItemProps {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  matches?: readonly string[];
  className?: string;
}

export default function NavItem({ label, icon, href, matches = [], className = '' }: NavItemProps) {
  const location = useLocation();
  const isActive =
    matches.length > 0
      ? matches.some((match) => (match === '/' ? location.pathname === match : location.pathname.startsWith(match)))
      : location.pathname === href;

  const Icon = icon;

  return (
    <Link
      to={href}
      className={`group focus:ring-Primary-500/50 relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 focus:ring-2 focus:outline-none sm:px-4 sm:py-2.5 sm:text-base ${
        isActive
          ? 'text-white'
          : 'text-Grey-300 border border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white'
      } ${className}`}
      aria-current={isActive ? 'page' : undefined}
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
            duration: 0.4,
          }}
        />
      )}

      <motion.span
        className='relative transition-transform group-hover:scale-110 [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-4 sm:[&>svg]:w-4'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon />
      </motion.span>
      <span className='relative text-nowrap font-medium'>{label}</span>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId='navbar-active-indicator'
          className='from-Primary-400 via-Secondary-400 to-Tertiary-400 absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-gradient-to-r'
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
            duration: 0.4,
          }}
        />
      )}

      {/* Hover glow effect */}
      <div className='from-Primary-500/0 via-Secondary-500/0 to-Tertiary-500/0 group-hover:from-Primary-500/5 group-hover:via-Secondary-500/5 group-hover:to-Tertiary-500/5 absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-300' />
    </Link>
  );
}
