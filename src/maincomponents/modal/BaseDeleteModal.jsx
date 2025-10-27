import { Button } from '@maincomponents/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@maincomponents/components/ui/dialog';
import LoaderButtonDelete from '@maincomponents/loaders/LoaderButtonDelete';
import React from 'react';

const BaseDeleteModal = ({ title, message, onClose, onSubmit, open, isLoading }) => {
  function onOpenChange() {
    if (isLoading) {
      return;
    } else {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-red-600'>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter className='grid grid-cols-2 gap-3'>
          <DialogClose asChild>
            <Button className='flex-grow' disabled={isLoading} variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <LoaderButtonDelete type='button' btnText='Confirm' onClick={onSubmit} loading={isLoading} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BaseDeleteModal;
