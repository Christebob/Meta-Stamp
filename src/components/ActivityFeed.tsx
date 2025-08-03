import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Bot, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityItem {
  id: string;
  ai_model: string;
  usage_type: string;
  duration_seconds: number;
  earnings: number;
  detected_at: string;
}

export const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('ai_usage_logs')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Set up real-time subscription
    const channel = supabase
      .channel('activity_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_usage_logs'
        },
        (payload) => {
          console.log('New activity:', payload);
          fetchActivities(); // Refresh the activity feed
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getModelColor = (model: string) => {
    switch (model) {
      case 'GPT-4': return 'bg-green-500';
      case 'Claude': return 'bg-blue-500';
      case 'Midjourney': return 'bg-purple-500';
      case 'DALL-E': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading activity...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No AI usage detected yet. Upload content and simulate usage to see activity!
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getModelColor(activity.ai_model)}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.ai_model}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.usage_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {activity.duration_seconds}s • {formatTimeAgo(activity.detected_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-mono font-medium text-green-600">
                  <DollarSign className="w-4 h-4" />
                  {activity.earnings.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};