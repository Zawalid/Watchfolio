import { usePageTitle } from '@/hooks/usePageTitle';
import { containerVariants, itemVariants } from '@/lib/animations';
import { motion } from 'framer-motion';

export default function PageLayout({
  Icon,
  title,
  subtitle,
  pageTitle,
  children,
  headerChildren,
  headerClassName,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  pageTitle?: string | null;
  children: React.ReactNode;
  headerChildren?: React.ReactNode;
  headerClassName?: string;
}) {
  usePageTitle(pageTitle !== null ? pageTitle || title : undefined);

  return (
    <motion.div
      className='mobile:space-y-8 space-y-6 pt-6'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {/* Header */}
      <motion.div variants={itemVariants} className={headerClassName || 'space-y-6'}>
        <div className='flex items-center gap-3'>
          <div className='from-Success-400 to-Primary-400 flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br'>
            <Icon className='size-6 text-white' />
          </div>
          <div>
            <h1 className='heading gradient max-sm:text-3xl max-xs:text-2xl'>{title}</h1>
            <p className='text-Grey-400 max-sm:text-sm'>{subtitle}</p>
          </div>
        </div>
        {headerChildren}
      </motion.div>
      {children}
    </motion.div>
  );
}
