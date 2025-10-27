import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle,CardFooter } from '@maincomponents/components/ui/card';
import {  ChartContainer, ChartTooltip, ChartTooltipContent,ChartLegend,ChartLegendContent } from '@maincomponents/components/ui/chart';
const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
 
  { browser: 'other', visitors: 90, fill: 'var(--color-other)' }
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'Chrome',
    color: '#7CB5EC'
  },
  safari: {
    label: 'Safari',
    color: '#FF8C00'
  },
  firefox: {
    label: 'Firefox',
    color: '#00FF58'
  },

  other: {
    label: 'Other',
    color: '#ffb900'
  }
};

export default function Component() {
  return (
    <Card className="flex flex-col m-0">
      <CardHeader className="flex justify-start  pt-2">
        <CardTitle>Pie Chart - Legend</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] w-full"
        >
          <PieChart>
            <Pie data={chartData} dataKey="visitors" />
            {/* <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            /> */}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
