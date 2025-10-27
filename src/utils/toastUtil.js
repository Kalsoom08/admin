import { toast } from 'sonner';

export const errorToast = (message = 'Something went wrong') => {
  toast.error(message, {
    position: 'top-right',
    closeButton: true,
    duration: 5000
  });
};
export const successToast = message => {
  toast.success(message, {
    position: 'top-right',
    closeButton: true,
    duration: 3000
  });
};
