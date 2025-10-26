import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { getLinks } from './Shared';

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className='bg-blur blur-bg fixed right-0 bottom-0 left-0 z-30 border-t border-white/10 pb-2 backdrop-blur-xl md:hidden'
      role='navigation'
      aria-label='Bottom navigation'
    >
      <div className='flex items-center justify-around p-2'>
        {getLinks(['home', 'tv', 'library', 'movies', 'search']).map((item) => {
          const isActive = item.matches?.some((match) => location.pathname.startsWith(match));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`focus:ring-Primary-500/50 flex flex-col items-center gap-1 rounded-lg px-2 xs:px-3 py-1.5 transition-all duration-200 focus:ring-2 text-nowrap focus:outline-none ${
                isActive ? 'text-Primary-400 bg-Primary-500/20' : 'text-Grey-400 hover:bg-white/5 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className='size-4 xs:size-6' />
              <span className='text-xs font-medium'>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
