import { Button } from '@maincomponents/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';

const LoaderButton = ({ loading, btnText,btnIcon, loaderText = 'Loading...', type = 'submit', onClick,className }) => {
  return (
    <Button type={type} disabled={loading} onClick={onClick} className={`flex-grow w-full ${className}`}>
      {loading ? (
        <span className='flex items-center justify-center gap-2 '>
          <Loader2 className='h-4 w-4 animate-spin' />
          {loaderText}
        </span>
      ) : (
        <>{btnIcon}{btnText}</>
      )}
    </Button>
  );
};

export default LoaderButton;
