import { FormControl, FormItem, FormLabel, FormMessage } from '@maincomponents/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@maincomponents/components/ui/select';
import React from 'react';

const SelectBox = ({ label, placeholder, field, options = [] }) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className='w-full'>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default SelectBox;
