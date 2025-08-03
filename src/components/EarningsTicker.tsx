import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EarningsTickerProps {
  userName?: string;
}

export const EarningsTicker = ({ userName = "Chris Coyne" }: EarningsTickerProps) => {
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [lastNotificationAmount, setLastNotificationAmount] = useState(0);

  // Fetch real-time earnings from database
  const fetchEarnings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('content_registry')
        .select('total_earned');
      
      if (error) throw error;
      
      const totalEarnings = data?.reduce((sum: number, content: any) => sum + (content.total_earned || 0), 0) || 0;
      setCurrentEarnings(totalEarnings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEarnings();

    // Set up real-time subscription to ai_usage_logs
    const channel = supabase
      .channel('earnings_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_usage_logs'
        },
        (payload) => {
          console.log('New AI usage detected:', payload);
          fetchEarnings(); // Refresh earnings when new usage is logged
          
          const earnings = payload.new?.earnings;
          if (earnings) {
            toast.success(
              `🤖 AI used your content! +$${earnings.toFixed(4)} earned`,
              {
                duration: 3000,
                description: "Real-time earnings update"
              }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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