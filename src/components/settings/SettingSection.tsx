import { cn } from '@/utils';
import { Lock } from 'lucide-react';
import { ElementType, ReactNode } from 'react';

type SettingSectionProps = {
  Icon: ElementType;
  title: string;
  children: ReactNode;
  iconClassName?: string;
  iconContainerClassName?: string;
};

export function SettingSection({ Icon, title, children, iconClassName, iconContainerClassName }: SettingSectionProps) {
  return (
    <section className='space-y-4'>
      <div className='flex items-center gap-3'>
        <div className={cn('bg-Primary-500/10 border-Primary-500/20 rounded-lg border p-2', iconContainerClassName)}>
          <Icon className={cn('text-Primary-400 size-5', iconClassName)} />
        </div>
        <h3 className='text-Primary-100 text-xl font-semibold'>{title}</h3>
      </div>
      <div className='space-y-6 rounded-xl border border-white/5 bg-white/[0.015] p-6 backdrop-blur-sm'>{children}</div>
    </section>
  );
}

interface SettingItemProps {
  title: string;
  description: string;
  children: ReactNode;
  isDisabled?: boolean;
  requiresAuth?: boolean;
  className?: string;
  comingSoon?: boolean;
  tag?:string
}

export function SettingItem({
  title,
  description,
  children,
  isDisabled = false,
  requiresAuth = false,
  className,
  comingSoon = false,
  tag
}: SettingItemProps) {
  return (
    <div className={cn('relative grid grid-cols-[1fr_auto] items-center gap-6', className)}>
      <div className={cn('transition-all duration-200', isDisabled && 'opacity-40')}>
        <div className='flex items-center gap-2'>
          <h4 className='text-Grey-200 font-semibold'>{title}</h4>
          {requiresAuth && isDisabled && <Lock className='text-Grey-500 size-3' />}
          {comingSoon && <span className='text-Grey-500 text-xs'>Coming Soon</span>}
          {tag && <span className='text-Grey-500 text-xs'>{tag}</span>}
        </div>
        <p className='text-Grey-400 mt-1 text-sm'>{description}</p>
      </div>
      <div className={cn('transition-all duration-200', isDisabled && 'pointer-events-none opacity-40')}>
        {children}
      </div>
    </div>
  );
}
