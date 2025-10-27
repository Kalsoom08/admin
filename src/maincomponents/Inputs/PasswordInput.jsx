import React, { useState } from 'react';
import { Input } from '@maincomponents/components/ui/input';
import { FormControl, FormItem, FormLabel, FormMessage } from '@maincomponents/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ label, placeHolder, field }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className='relative'>
        <FormControl>
          <Input type={showPassword ? 'text' : 'password'} placeholder={placeHolder} {...field} className='pr-10' />
        </FormControl>

        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
        </button>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default PasswordInput;
