import { motion } from 'framer-motion';
import { User, Mic, Users, Clapperboard } from 'lucide-react';
import { Tooltip } from '@heroui/react';
import { cn } from '@/utils';

interface PersonRoleBadgesProps {
  roles: string[];
  primaryRole?: string;
  maxVisible?: number;
}

export function PersonRoleBadges({ roles, primaryRole, maxVisible = 2 }: PersonRoleBadgesProps) {
  const displayRoles = roles.slice(0, maxVisible);
  const remainingRoles = roles.slice(maxVisible);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3, staggerChildren: 0.1 }}
      className='absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5'
    >
      {displayRoles.map((role, index) => (
        <RoleBadge key={role} role={role} primaryRole={primaryRole} delay={index * 0.1} />
      ))}
      {remainingRoles.length > 0 && <OverflowBadge remainingRoles={remainingRoles} delay={displayRoles.length * 0.1} />}
    </motion.div>
  );
}

interface RoleBadgeProps {
  role: string;
  primaryRole?: string;
  delay?: number;
}

function RoleBadge({ role, primaryRole, delay = 0 }: RoleBadgeProps) {
  const getIcon = () => {
    if (primaryRole === 'voice' || role.toLowerCase().includes('voice')) return <Mic className='h-3 w-3' />;
    if (primaryRole === 'guest' || role.includes('Self') || role.includes('Host')) return <Users className='h-3 w-3' />;
    if (role.includes('Director') || role.includes('Producer') || role.includes('Writer'))
      return <Clapperboard className='h-3 w-3' />;
    return <User className='h-3 w-3' />;
  };

  const getColor = () => {
    if (primaryRole === 'voice' || role.toLowerCase().includes('voice'))
      return 'bg-Tertiary-500/20 text-Tertiary-300 border-Tertiary-500/30';
    if (primaryRole === 'guest') return 'bg-Secondary-500/20 text-Secondary-300 border-Secondary-500/30';
    if (role.includes('Director')) return 'bg-Error-500/20 text-Error-300 border-Error-500/30';
    if (role.includes('Producer')) return 'bg-Warning-500/20 text-Warning-300 border-Warning-500/30';
    if (role.includes('Writer')) return 'bg-Success-500/20 text-Success-300 border-Success-500/30';
    return 'bg-Primary-500/20 text-Primary-300 border-Primary-500/30';
  };

  const formattedRole = role
    .replace('as ', '')
    .replace('Executive ', 'Exec ')
    .replace('Associate ', 'Assoc ')
    .replace('Co-', 'Co');

  return (
    <Tooltip
      content={formattedRole.length > 12 ? role : undefined}
      className='tooltip-secondary!'
      isDisabled={formattedRole.length <= 12}
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className={cn(
          'flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md',
          getColor()
        )}
      >
        {getIcon()}
        <span className='line-clamp-1 max-w-20'>{formattedRole}</span>
      </motion.div>
    </Tooltip>
  );
}

interface OverflowBadgeProps {
  remainingRoles: string[];
  delay?: number;
}

function OverflowBadge({ remainingRoles, delay = 0 }: OverflowBadgeProps) {
  return (
    <Tooltip
      content={
        <div className='space-y-1'>
          <p className='text-xs font-medium text-white'>Additional roles:</p>
          {remainingRoles.map((role) => (
            <p key={role} className='text-Grey-300 text-xs'>
              {role}
            </p>
          ))}
        </div>
      }
      className='tooltip-secondary!'
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className='border-Grey-500/30 bg-Grey-500/20 text-Grey-300 flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md'
      >
        <span>+{remainingRoles.length}</span>
      </motion.div>
    </Tooltip>
  );
}
