import { ElementType, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { useQueryState } from 'nuqs';
import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import {
  Search,
  FunnelX,
  AlertTriangle,
  RotateCcw,
  CircleOff,
  Film,
  Tv,
  FileQuestion,
  SearchSlash,
  UsersIcon,
  Home,
  ArrowLeft,
} from 'lucide-react';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { AnimatedRing } from '@/components/ui/AnimatedRing';
import { useFilters } from '@/hooks/useFilters';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
    },
  },
};

function StatusContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='flex h-full min-h-[70vh] flex-1 flex-col items-center justify-center gap-6 px-4 text-center'
    >
      {children}
    </motion.div>
  );
}

function NoResults({ title, message, children }: { title?: string; message?: string; children?: ReactNode }) {
  const { hasFilters, clearAllFilters } = useFilters();
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });

  return (
    <StatusContainer>
      {hasFilters && (
        <>
          <motion.div
            variants={itemVariants}
            className='rounded-full border border-white/10 bg-white/5 p-6 backdrop-blur-md'
          >
            <FunnelX className='text-Warning-400 size-12' />
          </motion.div>
          <motion.div variants={itemVariants} className='space-y-4'>
            <h3 className='text-Grey-50 mb-2 text-xl font-semibold'>{title || 'No matches found'}</h3>
            <p className='text-Grey-400 max-w-md'>
              Your current filters are too specific. Try adjusting them to see more content.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Tooltip
              content={<ShortcutTooltip shortcutName='clearFilters' className='kbd-sm!' />}
              className='tooltip-secondary!'
            >
              <Button className='button-secondary!' onPress={clearAllFilters}>
                Clear Filters
              </Button>
            </Tooltip>
          </motion.div>
          {children && <motion.div variants={itemVariants}>{children}</motion.div>}
        </>
      )}
      {query && (
        <>
          <motion.div
            variants={itemVariants}
            className='rounded-full border border-white/10 bg-white/5 p-6 backdrop-blur-md'
          >
            <Search className='text-Grey-400 size-12' />
          </motion.div>
          <motion.div variants={itemVariants} className='space-y-4'>
            <h3 className='text-Grey-50 mb-2 text-xl font-semibold'>No results found</h3>
            <p className='text-Grey-400 max-w-md'>
              {message || `Couldn't find any shows or movies matching "${query}". Try a different search term.`}
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Tooltip
              content={<ShortcutTooltip shortcutName='clearSearch' className='kbd-sm!' />}
              className='tooltip-secondary!'
            >
              <Button className='button-secondary!' onPress={() => setQuery(null)}>
                Clear Search
              </Button>
            </Tooltip>
          </motion.div>
          {children && <motion.div variants={itemVariants}>{children}</motion.div>}
        </>
      )}
    </StatusContainer>
  );
}

function Empty({
  Icon,
  iconColor,
  title,
  message,
  children,
}: {
  Icon?: ElementType;
  iconColor?: string;
  title?: string;
  message?: string;
  children?: ReactNode;
}) {
  return (
    <StatusContainer>
      <motion.div
        variants={itemVariants}
        className='rounded-full border border-white/10 bg-white/5 p-6 backdrop-blur-md'
      >
        {Icon ? <Icon className={`size-12 ${iconColor}`} /> : <CircleOff className='text-Grey-400 size-12' />}
      </motion.div>
      <motion.div variants={itemVariants} className='space-y-4'>
        <h3 className='text-Grey-50 mb-2 text-xl font-semibold'>{title || 'Nothing here yet'}</h3>
        <p className='text-Grey-400 max-w-md'>{message || 'No content yet'}</p>
      </motion.div>
      {children && <motion.div variants={itemVariants}>{children}</motion.div>}
    </StatusContainer>
  );
}

export function Error({
  title,
  message,
  children,
  onRetry,
}: {
  title?: string;
  message?: string;
  children?: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <StatusContainer>
      <motion.div variants={itemVariants}>
        <AnimatedRing
          color='error'
          size='md'
          ringCount={3}
          animationSpeed='slow'
          glowEffect={true}
          floatingIcons={[
            {
              icon: <AlertTriangle className='h-4 w-4' />,
              position: 'top-center',
              color: 'warning',
              delay: 0,
            },
            {
              icon: <RotateCcw className='h-4 w-4' />,
              position: 'bottom-right',
              color: 'primary',
              delay: 1.5,
            },
          ]}
        >
          <AlertTriangle className='h-12 w-12 text-red-400' />
        </AnimatedRing>
      </motion.div>

      <motion.div variants={itemVariants} className='space-y-4'>
        <h3 className='text-Grey-50 mb-2 text-xl font-semibold'>{title || ' Oops! Something went wrong'}</h3>
        <p className='text-Grey-400 max-w-md'>
          {message || 'There was an error processing your request. Please try again.'}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className='flex gap-3'>
        <Button onPress={onRetry} className='button-primary!' startContent={<RotateCcw className='h-4 w-4' />}>
          Try Again
        </Button>
        <Button as={Link} to='/' className='button-secondary!'>
          Go Home
        </Button>
      </motion.div>

      {children && <motion.div variants={itemVariants}>{children}</motion.div>}
    </StatusContainer>
  );
}

function NotFound({ title, message, children }: { title?: string; message?: string; children?: ReactNode }) {
  const navigate = useNavigate();

  return (
    <StatusContainer>
      <motion.div variants={itemVariants}>
        <AnimatedRing
          color='secondary'
          size='lg'
          ringCount={2}
          animationSpeed='normal'
          glowEffect={true}
          floatingIcons={[
            {
              icon: <Film className='h-4 w-4' />,
              position: 'top-right',
              color: 'primary',
              delay: 0,
            },
            {
              icon: <Tv className='h-4 w-4' />,
              position: 'bottom-left',
              color: 'tertiary',
              delay: 1,
            },
            {
              icon: <SearchSlash className='h-4 w-4' />,
              position: 'top-left',
              color: 'warning',
              delay: 2,
            },
            {
              icon: <UsersIcon className='h-4 w-4' />,
              position: 'bottom-right',
              color: 'warning',
              delay: 2,
            },
          ]}
        >
          <FileQuestion className='text-Secondary-400 size-16' />
        </AnimatedRing>
      </motion.div>

      {/* Title and description */}
      <motion.div variants={itemVariants} className='max-w-lg space-y-4'>
        <h2 className='heading gradient'>{title || 'Page Not Found'}</h2>
        <p className='text-Grey-300 text-base leading-relaxed'>
          {message || 'There was an error processing your request. Please try again.'}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className='flex w-full max-w-lg flex-col items-center gap-3'>
        <div className='grid w-full grid-cols-2 gap-3'>
          <Button as={Link} to='/home' color='primary' startContent={<Home className='h-4 w-4' />}>
            Go Home
          </Button>
          <Button
            onPress={() => navigate(-1)}
            variant='bordered'
            className='button-secondary! bg-transparent!'
            startContent={<ArrowLeft className='h-4 w-4' />}
          >
            Go Back
          </Button>
        </div>
      </motion.div>

      {children}
    </StatusContainer>
  );
}

export const Status = () => <></>;

Status.NoResults = NoResults;
Status.Empty = Empty;
Status.Error = Error;
Status.NotFound = NotFound;
