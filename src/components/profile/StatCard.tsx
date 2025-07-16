import { motion } from 'framer-motion';
import { Percent, type LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className: string;
  layoutClassName?: string;
  description?: string;
  delay?: number;
  percentage?: number;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  className,
  layoutClassName,
  description,
  delay = 0,
  percentage,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: delay * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
      className={cn(
        'group relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        className,
        layoutClassName
      )}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='mb-1 flex items-center gap-2'>
            <Icon className='size-4' />
            <span className='text-Grey-200 text-sm font-medium'>{label}</span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay * 0.1 + 0.2 }}
            className='mb-1 text-2xl leading-tight font-bold'
          >
            {value}
          </motion.div>

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay * 0.1 + 0.3 }}
              className='text-Grey-400 text-xs leading-tight'
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
      {!percentage || (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay * 0.1 + 0.3 }}
          className={cn(
            'absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            className
          )}
        >
          <Percent className={cn('h-3 w-3', percentage < 0 && 'rotate-180')} />
          <span>{percentage}%</span>
        </motion.div>
      )}

      {/* Simple background pattern */}
      <div className='absolute -top-4 -right-4 opacity-5'>
        <Icon className='size-16' />
      </div>
    </motion.div>
  );
}
