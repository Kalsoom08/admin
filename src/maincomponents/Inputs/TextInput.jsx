import { FormControl, FormItem, FormLabel, FormMessage } from '@maincomponents/components/ui/form';
import { Input } from '@maincomponents/components/ui/input';
import React from 'react';

const TextInput = ({ label, placeHolder, type, field }) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input type={type} placeholder={placeHolder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default TextInput;
