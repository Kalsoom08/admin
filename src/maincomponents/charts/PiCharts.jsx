import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Utilities', value: 400 },
  { name: 'Supplies', value: 300 },
  { name: 'Food', value: 300 },
];

const COLORS = ['#FF8042', '#0088FE', '#00C49F'];

function Chart() {
  return (
    <ResponsiveContainer width="100%" height={130}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* Legend added here */}
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default Chart;
