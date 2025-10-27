import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import { Skeleton } from '@maincomponents/components/ui/skeleton';
const DashboardCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          <Skeleton className='h-4 w-24' />
        </CardTitle>
        <Skeleton className='h-5 w-5 rounded-full' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-7 w-20' />
      </CardContent>
    </Card>
  );
};
export default DashboardCardSkeleton;