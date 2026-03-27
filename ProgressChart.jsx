import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { day: 'Mon', calories: 2100 },
  { day: 'Tue', calories: 1900 },
  { day: 'Wed', calories: 2400 },
  { day: 'Thu', calories: 1800 },
  { day: 'Fri', calories: 2200 },
  { day: 'Sat', calories: 2600 },
  { day: 'Sun', calories: 2000 },
];

const ProgressChart = () => {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #ffffff20',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#22d3ee' }}
          />
          <Area 
            type="monotone" 
            dataKey="calories" 
            stroke="#22d3ee" 
            fillOpacity={1} 
            fill="url(#colorCal)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
