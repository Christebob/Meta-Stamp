import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockData = [
  { date: 'Jan', earnings: 12.5, aiTouches: 450 },
  { date: 'Feb', earnings: 28.3, aiTouches: 720 },
  { date: 'Mar', earnings: 45.1, aiTouches: 980 },
  { date: 'Apr', earnings: 67.8, aiTouches: 1340 },
  { date: 'May', earnings: 89.2, aiTouches: 1650 },
  { date: 'Jun', earnings: 125.6, aiTouches: 2100 },
  { date: 'Jul', earnings: 158.9, aiTouches: 2450 },
];

export const RevenueChart = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Revenue Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value) => [`$${value}`, 'Earnings']}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="hsl(var(--success))"
              strokeWidth={3}
              fill="url(#earningsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">AI Touch Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value}`, 'AI Touches']}
            />
            <Line
              type="monotone"
              dataKey="aiTouches"
              stroke="hsl(var(--electric))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--electric))', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: 'hsl(var(--electric))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};