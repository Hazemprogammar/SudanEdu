import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'يناير', revenue: 15400 },
  { month: 'فبراير', revenue: 22800 },
  { month: 'مارس', revenue: 34500 },
  { month: 'أبريل', revenue: 48200 },
  { month: 'مايو', revenue: 56700 },
  { month: 'يونيو', revenue: 63400 },
  { month: 'يوليو', revenue: 71200 },
  { month: 'أغسطس', revenue: 78900 },
  { month: 'سبتمبر', revenue: 82300 },
  { month: 'أكتوبر', revenue: 89100 },
  { month: 'نوفمبر', revenue: 94800 },
  { month: 'ديسمبر', revenue: 102500 },
];

export default function RevenueChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            formatter={(value: number) => [`${value.toLocaleString()} ج.س`, 'الإيرادات']}
          />
          <Bar 
            dataKey="revenue" 
            fill="hsl(158, 64%, 52%)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
