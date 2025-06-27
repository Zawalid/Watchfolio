import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedRingProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success';
  ringCount?: 1 | 2 | 3;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  glowEffect?: boolean;
  floatingIcons?: Array<{
    icon: ReactNode;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success';
    delay?: number;
  }>;
  className?: string;
  contentClassName?: string;
  onHover?: boolean;
}

const sizeConfig = {
  sm: { container: 'h-16 w-16', icon: 'h-6 w-6', floating: 'h-6 w-6' },
  md: { container: 'h-24 w-24', icon: 'h-8 w-8', floating: 'h-7 w-7' },
  lg: { container: 'h-32 w-32', icon: 'h-12 w-12', floating: 'h-8 w-8' },
  xl: { container: 'h-40 w-40', icon: 'h-16 w-16', floating: 'h-10 w-10' },
};

const colorConfig = {
  primary: {
    border: 'border-Primary-400/30',
    background: 'from-Primary-500/20 to-Primary-600/30',
    ring1: 'border-Primary-500/30',
    ring2: 'border-Primary-400/20',
    glow: 'rgba(99, 102, 241, 0.3)',
    glowIntense: 'rgba(99, 102, 241, 0.5)',
  },
  secondary: {
    border: 'border-Secondary-400/30',
    background: 'from-Secondary-500/20 to-Secondary-600/30',
    ring1: 'border-Secondary-500/30',
    ring2: 'border-Secondary-400/20',
    glow: 'rgba(139, 92, 246, 0.3)',
    glowIntense: 'rgba(139, 92, 246, 0.5)',
  },
  tertiary: {
    border: 'border-Tertiary-400/30',
    background: 'from-Tertiary-500/20 to-Tertiary-600/30',
    ring1: 'border-Tertiary-500/30',
    ring2: 'border-Tertiary-400/20',
    glow: 'rgba(34, 197, 94, 0.3)',
    glowIntense: 'rgba(34, 197, 94, 0.5)',
  },
  error: {
    border: 'border-Error-400/30',
    background: 'from-Error-500/20 to-Error-600/30',
    ring1: 'border-Error-500/30',
    ring2: 'border-Error-400/20',
    glow: 'rgba(255, 97, 97, 0.3)',
    glowIntense: 'rgba(255, 97, 97, 0.5)',
  },
  warning: {
    border: 'border-Warning-400/30',
    background: 'from-Warning-500/20 to-Warning-600/30',
    ring1: 'border-Warning-500/30',
    ring2: 'border-Warning-400/20',
    glow: 'rgba(251, 191, 36, 0.3)',
    glowIntense: 'rgba(251, 191, 36, 0.5)',
  },
  success: {
    border: 'border-Success-400/30',
    background: 'from-Success-500/20 to-Success-600/30',
    ring1: 'border-Success-500/30',
    ring2: 'border-Success-400/20',
    glow: 'rgba(34, 197, 94, 0.3)',
    glowIntense: 'rgba(34, 197, 94, 0.5)',
  },
};

const speedConfig = {
  slow: { duration: 3, delay: 0.8 },
  normal: { duration: 2, delay: 0.5 },
  fast: { duration: 1.5, delay: 0.3 },
};

const floatingPositions = {
  'top-left': '-top-4 -left-4',
  'top-right': '-top-4 -right-4',
  'bottom-left': '-bottom-4 -left-4',
  'bottom-right': '-bottom-4 -right-4',
};

export function AnimatedRing({
  children,
  size = 'lg',
  color = 'primary',
  ringCount = 2,
  animationSpeed = 'normal',
  glowEffect = true,
  floatingIcons = [],
  className = '',
  contentClassName = '',
  onHover = true,
}: AnimatedRingProps) {
  const sizeStyles = sizeConfig[size];
  const colorStyles = colorConfig[color];
  const speedStyles = speedConfig[animationSpeed];

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: speedStyles.duration + 1,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const contentVariants = {
    animate: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: speedStyles.duration * 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const glowAnimation = glowEffect
    ? {
        boxShadow: [
          `0 0 20px ${colorStyles.glow}`,
          `0 0 40px ${colorStyles.glowIntense}`,
          `0 0 20px ${colorStyles.glow}`,
        ],
      }
    : {};

  return (
    <div className={`relative ${className}`}>
      {/* Animated rings */}
      {ringCount >= 1 && (
        <motion.div
          className={`${sizeStyles.container} ${colorStyles.ring1} absolute inset-0 rounded-full border-2`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: speedStyles.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {ringCount >= 2 && (
        <motion.div
          className={`${sizeStyles.container} ${colorStyles.ring2} absolute inset-0 rounded-full border`}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: speedStyles.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: speedStyles.delay,
          }}
        />
      )}

      {ringCount >= 3 && (
        <motion.div
          className={`${sizeStyles.container} ${colorStyles.ring1} absolute inset-0 rounded-full border`}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: speedStyles.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: speedStyles.delay * 2,
          }}
        />
      )}

      {/* Main content container */}
      <motion.div
        className={`
          ${sizeStyles.container} 
          ${colorStyles.border} 
          ${colorStyles.background} 
          relative flex items-center justify-center rounded-full border bg-gradient-to-br backdrop-blur-xl
          ${contentClassName}
        `}
        whileHover={onHover ? { scale: 1.05 } : {}}
        animate={glowAnimation}
        transition={{
          duration: speedStyles.duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div variants={contentVariants} animate='animate'>
          {children}
        </motion.div>
      </motion.div>

      {/* Floating icons */}
      {floatingIcons.map((floatingIcon, index) => {
        const iconColorStyles = floatingIcon.color ? colorConfig[floatingIcon.color] : colorStyles;
        const iconColorClass = floatingIcon.color 
          ? `text-${floatingIcon.color === 'primary' ? 'Primary' : 
               floatingIcon.color === 'secondary' ? 'Secondary' :
               floatingIcon.color === 'tertiary' ? 'Tertiary' :
               floatingIcon.color === 'error' ? 'Error' :
               floatingIcon.color === 'warning' ? 'Warning' : 'Success'}-400`
          : `text-${color === 'primary' ? 'Primary' : 
               color === 'secondary' ? 'Secondary' :
               color === 'tertiary' ? 'Tertiary' :
               color === 'error' ? 'Error' :
               color === 'warning' ? 'Warning' : 'Success'}-400`;

        return (
          <motion.div
            key={index}
            variants={floatingVariants}
            animate='animate'
            style={{ animationDelay: `${(floatingIcon.delay || index) * 1}s` }}
            className={`
              ${iconColorStyles.background} 
              ${iconColorStyles.border} 
              ${sizeStyles.floating} 
              ${floatingPositions[floatingIcon.position]}
              absolute flex items-center justify-center rounded-full border backdrop-blur-xl
            `}
          >
            <div className={iconColorClass}>
              {floatingIcon.icon}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}