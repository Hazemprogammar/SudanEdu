import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'يناير', users: 2400 },
  { month: 'فبراير', users: 3200 },
  { month: 'مارس', users: 4100 },
  { month: 'أبريل', users: 5800 },
  { month: 'مايو', users: 7200 },
  { month: 'يونيو', users: 8900 },
  { month: 'يوليو', users: 10500 },
  { month: 'أغسطس', users: 12100 },
  { month: 'سبتمبر', users: 13800 },
  { month: 'أكتوبر', users: 15200 },
  { month: 'نوفمبر', users: 16800 },
  { month: 'ديسمبر', users: 18500 },
];

export default function UserGrowthChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
          />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="hsl(207, 90%, 54%)" 
            strokeWidth={3}
            dot={{ fill: 'hsl(207, 90%, 54%)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(207, 90%, 54%)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
