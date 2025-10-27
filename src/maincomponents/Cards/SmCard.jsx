import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
const SmCard = ({ name, totalPrice, btnIcon, className, iconColor }) => {
  return (
    <Card className={`rounded-2xl shadow-xs py-5 my-6 md:my-0 ${className} `}>
      <CardHeader className='flex justify-between items-center'>
        <CardTitle className='flex flex-col justify-center'>
          <span className=' font-normal text-sm'>{name}</span>
          <h2 className={` font-bold text-2xl`}>{totalPrice}</h2>
        </CardTitle>
        <CardDescription className='flex justify-center'>
          <span
            className={`text-xl font-semibold w-10 h-10 flex items-center justify-center rounded-2xl bg-[#E5E7EB] px-1 py-0.5rounded-lg flex-shrink-0 ${iconColor}`}
          >
            {btnIcon}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default SmCard;
