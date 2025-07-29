import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface EarningsTickerProps {
  userName?: string;
}

export const EarningsTicker = ({ userName = "Chris Coyne" }: EarningsTickerProps) => {
  const [currentEarnings, setCurrentEarnings] = useState(158.9234);
  const [lastNotificationAmount, setLastNotificationAmount] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.random() * 0.0087 + 0.0023; // Random increment between $0.0023 and $0.0110
      setCurrentEarnings(prev => {
        const newAmount = prev + increment;
        
        // Check if we've crossed a $100 threshold
        const currentThreshold = Math.floor(newAmount / 100) * 100;
        const previousThreshold = Math.floor(prev / 100) * 100;
        
        if (currentThreshold > previousThreshold && currentThreshold >= lastNotificationAmount + 100) {
          setLastNotificationAmount(currentThreshold);
          toast.success(
            `🎉 You just earned another $100! Total: $${newAmount.toFixed(4)}`,
            {
              duration: 5000,
              description: "Your content is working for you!"
            }
          );
        }
        
        return newAmount;
      });
    }, 1200); // Update every 1.2 seconds

    return () => clearInterval(interval);
  }, [lastNotificationAmount]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <Card className="bg-gradient-to-r from-primary/95 to-electric/95 border-none shadow-lg backdrop-blur-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">
                  {userName}'s Current Earnings
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-white font-mono">
                    ${currentEarnings.toFixed(4)}
                  </span>
                  <div className="flex items-center text-green-300">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-white/90 text-xs">AI Usage Revenue</p>
              <p className="text-white text-sm font-medium">Real-Time</p>
            </div>
          </div>
          
          {/* Animated ticker line */}
          <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};