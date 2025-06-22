import { ReactNode } from 'react';
import { Button } from '@heroui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

interface SettingGuardProps {
  children: ReactNode;
  isDisabled: boolean;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  overlayClassName?: string;
}

export default function SettingGuard({
  children,
  isDisabled,
  title = 'Feature Unavailable',
  description = 'This feature is currently unavailable.',
  icon: Icon,
  actionText = 'Enable',
  onAction,
  className,
  overlayClassName,
}: SettingGuardProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Content */}
      <div className={cn('transition-all duration-300', isDisabled && 'pointer-events-none opacity-30 blur-[1px]')}>
        {children}
      </div>

      {/* Overlay */}
      {isDisabled && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-[2px]',
            overlayClassName
          )}
        >
          <div className='border-Primary-500/30 bg-Primary-500/10 mx-6 max-w-md rounded-lg border p-6 text-center backdrop-blur-sm'>
            {Icon && (
              <div className='mb-3 flex justify-center'>
                <Icon className='text-Primary-400 size-8' />
              </div>
            )}
            <h4 className='text-Primary-200 mb-2 font-semibold'>{title}</h4>
            <p className='text-Grey-300 mb-4 text-sm'>{description}</p>
            {onAction && (
              <Button color='primary' size='sm' onPress={onAction}>
                {actionText}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
