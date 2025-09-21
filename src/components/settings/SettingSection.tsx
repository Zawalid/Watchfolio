import { cn } from '@/utils';
import { Lock } from 'lucide-react';
import { ElementType, ReactNode } from 'react';
import { Switch } from '../ui/Switch';

type SettingSectionProps = {
  Icon: ElementType;
  title: string;
  children: ReactNode;
  iconClassName?: string;
  iconContainerClassName?: string;
};

export function SettingSection({ Icon, title, children, iconClassName, iconContainerClassName }: SettingSectionProps) {
  return (
    <section className='space-y-5'>
      <div className='mobile:gap-3 flex items-center gap-2'>
        <div
          className={cn(
            'bg-Primary-500/10 border-Primary-500/20 mobile:p-2 rounded-lg border p-1.5',
            iconContainerClassName
          )}
        >
          <Icon className={cn('text-Primary-400 mobile:size-5 size-4', iconClassName)} />
        </div>
        <h3 className='text-Primary-100 text-lg font-semibold sm:text-xl'>{title}</h3>
      </div>
      <div className='mobile:space-y-6 mobile:p-6 space-y-4 rounded-xl border border-white/5 bg-white/[0.015] p-4 backdrop-blur-sm'>
        {children}
      </div>
    </section>
  );
}

interface SettingItemProps {
  title: string;
  description: string;
  children?: ReactNode;
  isDisabled?: boolean;
  requiresAuth?: boolean;
  className?: string;
  comingSoon?: boolean;
  tag?: string;
  isChecked?: boolean;
  isSwitchDisabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function SettingItem({
  title,
  description,
  children,
  isDisabled = false,
  requiresAuth = false,
  className,
  comingSoon = false,
  tag,
  isChecked,
  isSwitchDisabled,
  onChange,
}: SettingItemProps) {
  return (
    <div
      className={cn(
        'xs:grid xs:grid-cols-[1fr_auto] xs:items-center xs:gap-4 relative flex flex-col gap-3 lg:gap-6',
        className
      )}
    >
      <div className={cn('transition-all duration-200', isDisabled && 'opacity-40')}>
        <div className='flex flex-wrap items-center gap-2'>
          <h4 className='text-Grey-200 text-sm font-semibold sm:text-base'>{title}</h4>
          {requiresAuth && isDisabled && <Lock className='text-Grey-500 size-3 flex-shrink-0' />}
          {comingSoon && <span className='text-Grey-500 text-xs'>Coming Soon</span>}
          {tag && <span className='text-Grey-500 text-xs'>{tag}</span>}
        </div>
        <p className='text-Grey-400 mt-1 text-xs sm:text-sm'>{description}</p>
      </div>
      <div
        className={cn(
          'transition-all duration-200 self-end',
          isDisabled && 'pointer-events-none opacity-40'
        )}
      >
        {children || (
          <Switch checked={isChecked} onChange={(e) => onChange?.(e.target.checked)} disabled={isSwitchDisabled} />
        )}
      </div>
    </div>
  );
}
