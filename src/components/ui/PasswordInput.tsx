import { useState } from 'react';
import { Input, type InputProps } from './Input';
import { InvisibleIcon, VisibleIcon } from './Icons';

export function PasswordInput({ ...props }: InputProps) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <Input type={visible ? 'text' : 'password'} placeholder='●●●●●●●●●●' icon='password' {...props}>
      <button
        className='text-Grey-600 hover:text-Grey-400 absolute top-1/2 right-4 z-10 -translate-y-1/2 transition-colors duration-200'
        type='button'
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <InvisibleIcon /> : <VisibleIcon />}
      </button>
    </Input>
  );
}
