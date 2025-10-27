import { Button } from '@maincomponents/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';

const LoaderButtonDelete = ({ loading, btnText, loaderText = 'Loading...', type = 'submit', onClick }) => {
  return (
    <Button type={type} variant='destructive' disabled={loading} onClick={onClick} className='flex-grow'>
      {loading ? (
        <span className='flex items-center justify-center gap-2'>
          <Loader2 className='h-4 w-4 animate-spin' />
          {loaderText}
        </span>
      ) : (
        <>{btnText}</>
      )}
    </Button>
  );
};

export default LoaderButtonDelete;
