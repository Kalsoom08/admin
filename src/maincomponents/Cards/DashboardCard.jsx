import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import LoaderButton from '@maincomponents/loaders/LoaderButton';
import { FaPlus, FaTags } from 'react-icons/fa6';
import { Icon } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
const DashboardCards = ({
  bgColor,
  bgIcon,
  textColor,
  icon,
  totalPrice,
  name,
  subTitle,
  btnText,
  btnIcon,
  buttonClassName,
  className,
  route
}) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (route) navigate(route);
  };
  return (
    <Card className={`w-full rounded-2xl py-6 shadow-lg my-6 md:my-0 ${bgColor} ${className}`}>
      <CardHeader >
        <CardTitle className='flex flex-col justify-center gap-1.5'>
          <span
            className={`text-xl font-semibold w-12 h-12 flex items-center justify-center rounded-lg text-white flex-shrink-0 ${bgIcon}`}
          >
            {icon}
          </span>
          <span className=' font-semibold text-lg text-[#1F2937] dark:text-white'>{name}</span>
          <h2 className={` font-bold text-3xl ${textColor}`}>{totalPrice}</h2>
          <p className=' font-normal text-[#4B5563] text-sm dark:text-white'>{subTitle}</p>
        </CardTitle>
        <CardDescription className='flex justify-center pt-2'>
          {btnText && (
            <LoaderButton
              btnText={btnText}
              btnIcon={btnIcon}
              type='button'
              onClick={handleNavigate}
              className={clsx('w-full', buttonClassName || defaultButtonClasses)}
            />
          )}
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
export default DashboardCards;