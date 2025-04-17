import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { API_BASE_URL } from '../../config/config';
import { log } from 'console';

interface Task {
  id: string;
  type: string;
  location: string;
  assignedCrew: string | null; 
  status: string;
  time: string;
}

const config = {
  garbage: {
    color: '#9b87f5',
  },
  spill: {
    color: '#D946EF',
  },
};

const TaskDistributionChart = ({chartData}) => {
  // const [tasks, setTasks] = useState<Task[]>([]); 
  // const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]); 
  // const [loading, setLoading] = useState(true); 
  // const [error, setError] = useState<string | null>(null); 

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/tasks`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch tasks');
  //       }
  //       const data: Task[] = await response.json();
  //       setTasks(data);

  
  //       const garbageCount = data.filter((task) => task.type === 'garbage').length;
  //       const spillCount = data.filter((task) => task.type === 'spill').length;

  //       console.log(garbageCount)

  //       setChartData([
  //         { name: 'Garbage', value: garbageCount },
  //         { name: 'Spill', value: spillCount },
  //       ]);

  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching tasks:', error);
  //       setError(error.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchTasks();
  // }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <ChartContainer config={config} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={config[entry.name.toLowerCase() as keyof typeof config]?.color || '#ccc'}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TaskDistributionChart;