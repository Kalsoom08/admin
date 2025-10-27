import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@maincomponents/components/ui/command';
import { Button } from '@maincomponents/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@maincomponents/components/ui/popover';
import { CirclePlus, CheckIcon } from 'lucide-react';
import { cn } from '@maincomponents/lib/utils';

const FilterSelect = ({ label, value, setValue, onClose, options, onOpen = () => {} }) => {
  function handleStatusFilter(value) {
    setValue(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]));
  }

  return (
    <Popover
      onOpenChange={open => {
        if (!open && typeof onClose === 'function') {
          onClose();
        } else {
          onOpen();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant='outline'>
          <CirclePlus className='h-4 w-4' />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search' />
          <CommandList>
            <CommandEmpty>No result found</CommandEmpty>
            <CommandGroup>
              {options?.map((item, index) => (
                <CommandItem key={index} onSelect={() => handleStatusFilter(item.value)}>
                  <div
                    className={cn(
                      'border-primary flex h-4 w-4 items-center justify-center rounded-sm border',
                      value.includes(item.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <CheckIcon className='h-4 w-4' />
                  </div>
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {value.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => setValue([])} className='justify-center text-center'>
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterSelect;
