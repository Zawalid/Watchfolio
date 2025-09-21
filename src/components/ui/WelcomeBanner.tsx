import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface WelcomeBannerProps {
  title: string;
  description: string;
  icon: ReactNode;
  variant?: 'default' | 'rating' | 'library';
  onDismiss: () => void;
  show: boolean;
}

const variantStyles = {
  default: 'border-Primary-500/20 from-Primary-500/10 via-Secondary-500/5 to-Tertiary-500/10',
  rating: 'border-Warning-500/20 from-Warning-500/10 to-Tertiary-500/10',
  library: 'border-Success-500/20 from-Success-500/10 to-Secondary-500/10',
};

export function WelcomeBanner({ title, description, icon, variant = 'default', onDismiss, show }: WelcomeBannerProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-r p-4 backdrop-blur-sm sm:p-6 ${variantStyles[variant]}`}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50' />
      <div className='from-Primary-500/20 absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl to-transparent blur-2xl sm:h-32 sm:w-32' />

      <div className='relative flex flex-col items-center gap-3 sm:flex-row sm:gap-4'>
        <div className='bg-Grey-800/80 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 backdrop-blur-sm sm:h-12 sm:w-12'>
          {icon}
        </div>

        <div className='w-full flex-1 text-center sm:text-left'>
          <h3 className='mb-1 text-base font-bold text-white sm:mb-2 sm:text-lg'>{title}</h3>
          <p className='text-Grey-300 text-sm leading-relaxed sm:text-base'>{description}</p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className='text-Grey-400 hover:text-Grey-300 absolute top-2 right-5 mt-2 rounded-xl p-2 transition-all duration-200 hover:bg-white/10 sm:mt-0'
        aria-label='Dismiss'
      >
        <X className='h-5 w-5' />
      </button>
    </motion.div>
  );
}
