import { cn } from '@/utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import type { JSX } from 'react';
import { forwardRef } from 'react';
import { NAME_ICON, EMAIL_ICON, PASSWORD_ICON, LINK_ICON, SEARCH_ICON, TITLE_ICON,AT_ICON } from './Icons';

type IconType = 'name' | 'email' | 'search' | 'password' | 'title' | 'link' | 'at';

// eslint-disable-next-line react-refresh/only-export-components
export const icons: Record<IconType, JSX.Element> = {
  name: NAME_ICON,
  email: EMAIL_ICON,
  password: PASSWORD_ICON,
  link: LINK_ICON,
  search: SEARCH_ICON,
  title: TITLE_ICON,
  at:AT_ICON
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  type?: IconType | React.HTMLInputTypeAttribute;
  icon?: IconType;
  label?: string;
  parentClassname?: string;
  error?: string | null;
  description?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { children, type, icon, label, parentClassname, error,description, ...props },
  ref
) {
  const { placeholder } = props;
  const [parent] = useAutoAnimate();

  const Icon = icons[type as IconType] || (icon && icons[icon]);

  return (
    <div className={cn('flex flex-col gap-2', parentClassname)} ref={parent}>
      <div className='relative rounded-xl'>
        <span className='text-Grey-600 absolute top-1/2 left-4 z-10 -translate-y-1/2'>{Icon}</span>
        <input
          ref={ref}
          type={type || 'text'}
          placeholder={type === 'email' ? 'eg. hello@example.com' : placeholder}
          id={props.name}
          {...props}
          className={cn(
            'peer text-Grey-100 focus:placeholder:text-Grey-600 relative z-10 w-full rounded-xl border-2 bg-white/5 pt-4.5 pb-1.5 text-sm outline-hidden transition-colors duration-200 placeholder:text-sm placeholder:text-transparent read-only:bg-transparent focus:bg-transparent',
            error
              ? 'border-Error-500 focus:border-Error-500'
              : 'focus:border-Primary-500 read-only:focus:border-Primary-300 border-white/5',
            Icon ? 'pr-4 pl-14' : 'px-4',
            props.className
          )}
        />
        <label
          className={cn(
            'text-Grey-400 absolute top-1/2 z-0 -translate-y-1/2 cursor-text text-sm transition-all duration-300 peer-not-placeholder-shown:z-10 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-xs peer-focus:z-10 peer-focus:-translate-y-5 peer-focus:text-xs focus:text-white',
            Icon ? 'left-14' : 'left-4'
          )}
          htmlFor={props.id || props.name}
        >
          {label}
        </label>

        {children}
      </div>
      {error && <span className='text-Error-500 text-sm'>{error}</span>}
      {description && <span className='text-Grey-400 text-sm'>{description}</span>}
    </div>
  );
});
