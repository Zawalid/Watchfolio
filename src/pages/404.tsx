import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { itemVariants } from '@/lib/animations';
import { Status } from '@/components/ui/Status';

export default function NotFound() {
  return (
    <div className='blur-bg relative flex min-h-dvh items-center justify-center overflow-hidden'>
      <Status.NotFound message="The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.">
        <motion.div
          variants={itemVariants}
          className='mt-8 max-w-lg rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl'
        >
          <p className='text-Grey-400 text-sm leading-relaxed'>
            <span className='text-Grey-300 font-semibold'>Need help?</span> Use the search bar to find movies and TV
            shows, or navigate back to the home page to explore trending content.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className='grid gap-3 text-center'>
          <p className='text-Grey-400 text-sm font-medium'>Quick navigation:</p>
          <div className='flex flex-wrap justify-center gap-2'>
            {[
              { path: '/movies', label: 'Movies' },
              { path: '/tv', label: 'TV Shows' },
              { path: '/library', label: 'Library' },
              { path: '/search', label: 'Search' },
              { path: '/networks', label: 'Networks' },
              { path: '/collections', label: 'Collections' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className='pill-bg text-Grey-300 hover:text-Grey-100 px-3 py-1 text-xs hover:bg-white/10'
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </Status.NotFound>
    </div>
  );
}
