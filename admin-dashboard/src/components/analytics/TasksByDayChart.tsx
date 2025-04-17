
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

const data = [
  { day: 'Mon', tasks: 12 },
  { day: 'Tue', tasks: 19 },
  { day: 'Wed', tasks: 15 },
  { day: 'Thu', tasks: 22 },
  { day: 'Fri', tasks: 18 },
  { day: 'Sat', tasks: 10 },
  { day: 'Sun', tasks: 8 },
];

const config = {
  tasks: {
    color: '#9b87f5',
  },
};

const TasksByDayChart = () => {
  return (
    <ChartContainer config={config} className="w-full h-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <ChartTooltip />
        <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

export default TasksByDayChart;
