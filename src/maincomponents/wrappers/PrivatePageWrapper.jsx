import { cn } from '@maincomponents/lib/utils';

export const PrivatePageWrapper = ({ fixed, className, ...props }) => {
  return (
    <main
      className={cn(
        'peer-[.header-fixed]/header:mt-16',
        'px-3 py-2',
        fixed && 'fixed-main flex grow flex-col overflow-hidden',
        className
      )}
      {...props}
    />
  );
};
