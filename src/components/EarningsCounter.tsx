import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface EarningsCounterProps {
  totalEarnings: number;
  dailyEarnings: number;
  monthlyEarnings: number;
}

export const EarningsCounter = ({ totalEarnings, dailyEarnings, monthlyEarnings }: EarningsCounterProps) => {
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedDaily, setAnimatedDaily] = useState(0);
  const [animatedMonthly, setAnimatedMonthly] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = totalEarnings / steps;
    const dailyIncrement = dailyEarnings / steps;
    const monthlyIncrement = monthlyEarnings / steps;

    let current = 0;
    const timer = setInterval(() => {
      current++;
      setAnimatedTotal(increment * current);
      setAnimatedDaily(dailyIncrement * current);
      setAnimatedMonthly(monthlyIncrement * current);

      if (current >= steps) {
        clearInterval(timer);
        setAnimatedTotal(totalEarnings);
        setAnimatedDaily(dailyEarnings);
        setAnimatedMonthly(monthlyEarnings);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalEarnings, dailyEarnings, monthlyEarnings]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-500">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Earnings</p>
          <p className="text-4xl font-bold text-primary">
            ${animatedTotal.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">All-time passive income</p>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-success/20 to-success/5 border-success/20 hover:shadow-[0_0_20px_hsl(var(--success)/0.3)] transition-all duration-500">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">Today's Earnings</p>
          <p className="text-4xl font-bold text-success">
            ${animatedDaily.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">AI usage today</p>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-electric/20 to-electric/5 border-electric/20 hover:shadow-[0_0_25px_hsl(var(--electric)/0.3)] transition-all duration-500">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">This Month</p>
          <p className="text-4xl font-bold text-electric">
            ${animatedMonthly.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Monthly residuals</p>
        </div>
      </Card>
    </div>
  );
};