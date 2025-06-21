import { cn } from '@/utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children?: React.ReactNode;
  label?: string;
  parentclassname?: string;
  error?: string;
}

export function Textarea({ children, label, ...props }: InputProps) {
  const { parentclassname, error } = props;
  const [parent] = useAutoAnimate();

  return (
    <div className={cn('flex flex-col gap-2', parentclassname)} ref={parent}>
      <div className='relative rounded-xl'>
        <textarea
          {...props}
          className={cn(
            'peer text-Grey-100 focus:placeholder:text-Grey-600 pb-1. relative z-10 w-full rounded-xl border-2 bg-white/5 px-5 pb-1.5 pt-4.5 text-sm outline-hidden transition-colors duration-200 placeholder:text-sm placeholder:text-transparent read-only:bg-transparent focus:bg-transparent min-h-14 max-h-64',
            error
              ? 'border-Error-500 focus:border-Error-500'
              : 'focus:border-Primary-500 read-only:focus:border-Primary-300 border-white/5',
            props.className
          )}
        />
        <label className='text-Grey-400 absolute top-1/2 left-5 z-0 -translate-y-1/2 cursor-text text-sm transition-all duration-300 peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:z-10 peer-not-placeholder-shown:text-xs peer-focus:top-3 peer-focus:z-10 peer-focus:text-xs focus:text-white'>
          {label}
        </label>

        {children}
      </div>
      {error && <span className='text-Error-500 text-sm'>{error}</span>}
    </div>
  );
}
