import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@maincomponents/components/ui/popover';
import { Button } from '@maincomponents/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@maincomponents/components/ui/command';
import { Label } from '@maincomponents/components/ui/label';
import { cn } from '@maincomponents/lib/utils';
import { Badge } from '@maincomponents/components/ui/badge';

function SelectWithSearchInput({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  id,
  error,
  isMulti = false 
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

 
  const selectedValues = React.useMemo(() => {
    if (!isMulti) {
      return value ? [value] : [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string' && value !== '') {
      return [value];
    }
    return [];
  }, [value, isMulti]);

 const filteredOptions = React.useMemo(() => {
  if (!inputValue) return options;
  return options.filter(
    opt => opt?.label?.toLowerCase().includes(inputValue.toLowerCase())
  );
}, [inputValue, options]);


  const handleSelect = optionValue => {
    if (isMulti) {
      let newValues;
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter(v => v !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }
      onChange(newValues);
    } else {
      onChange(optionValue);
      setOpen(false);
    }
    setInputValue('');
  };

  const handleClearAll = e => {
    e.stopPropagation();
    onChange(isMulti ? [] : '');
  };

  const renderButtonLabel = () => {
    if (isMulti) {
      if (selectedValues.length === 0) return placeholder;
      return (
        <div className="flex flex-wrap gap-1 items-center">
          {options
            .filter(opt => selectedValues.includes(opt.value))
            .map(opt => (
              <Badge key={opt.value} variant="secondary" className="text-xs px-2 py-0">
                {opt.label}
              </Badge>
            ))}
        </div>
      );
    } else {
      const selectedOption = options.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls="select-options"
            className="w-full justify-between"
            type="button"
          >
            <div className="flex items-center gap-2 truncate w-full">{renderButtonLabel()}</div>
            <div className="flex items-center gap-1">
              {isMulti && selectedValues.length > 0 && (
                <X
                  className="h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={handleClearAll}
                />
              )}
              <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="p-0">
          <Command>
            <CommandInput
              autoFocus
              placeholder="Search..."
              value={inputValue}
              onValueChange={setInputValue}
              className="w-full max-w-[500px] min-w-[200px]"
            />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup id="select-options">
              {filteredOptions.map(option => {
                const selected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      'cursor-pointer select-none rounded-sm px-2 py-1 flex justify-between',
                      selected ? 'bg-primary text-primary-foreground' : ''
                    )}
                  >
                    {option.label}
                    {selected && <Check className="ml-auto h-4 w-4" />}
                    {option?.badge && (
                      <Badge variant="outline" className="rounded-full px-1 py-0 text-xs ml-2">
                        {option?.badge || 0}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-red-600 text-sm mt-1 px-1">{error}</p>}
    </div>
  );
}

export default SelectWithSearchInput;
