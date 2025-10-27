import { Button } from '@maincomponents/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@maincomponents/components/ui/dialog';
import { cn } from '@maincomponents/lib/utils';
import LoaderButton from '@maincomponents/loaders/LoaderButton';
import React from 'react';

const AddEditBaseModal = ({
  open,
  onClose,
  title,
  onSubmit,
  isLoading,
  isShowSubmit = true,
  children
}) => {
  function onOpenChange() {
    if (!isLoading) onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] sm:w-[75%] md:w-[60%] lg:w-1/2 xl:w-[40%] max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {children}

        <DialogFooter className={cn('grid gap-3', isShowSubmit ? 'grid-cols-2' : 'grid-cols-1')}>
          <DialogClose asChild>
            <Button className="flex-grow" disabled={isLoading} variant="outline">
              Cancel
            </Button>
          </DialogClose>

          {isShowSubmit ? (
            <LoaderButton
              type="submit"  
              btnText="Submit"
              loading={isLoading}
              onClick={onSubmit || undefined} 
            />
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditBaseModal;
