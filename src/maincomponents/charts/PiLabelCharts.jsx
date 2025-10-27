import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { CATEGORY_COLOR } from '@data/Constants';

const defaultColors = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

const PiLabelCharts = ({ data, nameKey = 'category', valueKey = 'amount' }) => {
  if (!data?.length) return null;

  // Sum values by nameKey
  const categoryMap = {};
  data.forEach(item => {
    categoryMap[item[nameKey]] = (categoryMap[item[nameKey]] || 0) + item[valueKey];
  });

  const chartData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const renderCustomLabel = ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie dataKey="value" data={chartData} label={renderCustomLabel} outerRadius={100}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CATEGORY_COLOR.get(entry.name) || defaultColors[index % defaultColors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PiLabelCharts;
