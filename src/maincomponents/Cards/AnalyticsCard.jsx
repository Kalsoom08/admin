const AnalyticsCard = ({ title, stats }) => {
  return (
    <div className='flex w-full py-2 flex-col rounded-md border px-4 gap-3'>
      <h2 className='text-xl font-bold tracking-tight'>{title}</h2>
      {stats.map((item, index) => (
        <div key={index} className='flex justify-between w-full'>
          <h1 className='text-base font text-[#4B5563]'>{item.label}</h1>
          <p className='text-sm font-semibold'>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCard;
