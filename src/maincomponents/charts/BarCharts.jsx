import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { CATEGORY_COLOR } from '@data/Constants';

const defaultColors = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

const BarCharts = ({ data, xKey = 'title', yKey = 'amount', categoryKey = 'category' }) => {
  if (!data?.length) return null;

  // Sort by yKey descending and take top 5
  const topData = [...data]
    .sort((a, b) => b[yKey] - a[yKey])
    .slice(0, 5);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={topData}>
        <XAxis dataKey={xKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Bar dataKey={yKey} radius={[4, 4, 0, 0]}>
          {topData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CATEGORY_COLOR.get(entry[categoryKey]) || defaultColors[index % defaultColors.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarCharts;
