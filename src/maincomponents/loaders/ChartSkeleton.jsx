import { Skeleton } from '@maincomponents/components/ui/skeleton';
const ChartSkeleton = () => {
  return (
    <div className='w-full h-[300px]'>
      <Skeleton className='w-full h-full rounded-xl' />
    </div>
  );
};
export default ChartSkeleton;