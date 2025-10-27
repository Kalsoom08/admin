import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const data = [
  {
    name: 'Mon',
    total: 2000
  },
  {
    name: 'Tue',
    total: 2500
  },
  {
    name: 'Wed',
    total: 1200,
    pv: 9800,
    amt: 2290
  },
  {
    name: 'Thu',
    total: 1000
  },
  {
    name: 'Fri',
    total: 1890
  },
  {
    name: 'Stu',
    total: 2390
  },
  {
    name: 'Sun',
    total: 1580
  }
];

function LineCharts() {
  return (
    <ResponsiveContainer width='100%' height={200}>
      <AreaChart data={data}>
        <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
        <Area type='monotone' dataKey='total' fill='#3B82F6' />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default LineCharts;
