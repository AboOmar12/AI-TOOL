import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StatsChartProps {
  data: { time: string; latency: number }[];
}

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
        No performance data available yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
        <XAxis 
          dataKey="time" 
          stroke="#9ca3af" 
          fontSize={10} 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#9ca3af" 
          fontSize={10} 
          tickLine={false}
          axisLine={false}
          unit="ms"
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '4px' }}
          itemStyle={{ color: '#60a5fa' }}
        />
        <Line 
          type="monotone" 
          dataKey="latency" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          dot={{ fill: '#3b82f6', r: 3 }} 
          activeDot={{ r: 5, fill: '#60a5fa' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StatsChart;