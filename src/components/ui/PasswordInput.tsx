import { useState } from 'react';
import { Input , type InputProps } from './Input';
import { INVISIBLE_ICON, VISIBLE_ICON } from './Icons';

export  function PasswordInput({ ...props }: InputProps) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <Input type={visible ? 'text' : 'password'} placeholder='●●●●●●●●●●' icon='password' {...props}>
      <button
        className='transition-colors duration-200 text-Grey-600 hover:text-Grey-400 absolute right-4 top-1/2 z-10 -translate-y-1/2'
        type='button'
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? INVISIBLE_ICON : VISIBLE_ICON}
      </button>
    </Input>
  );
}
