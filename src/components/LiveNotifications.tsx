import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, DollarSign, Bot, TrendingUp, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'earning' | 'ai-touch' | 'achievement' | 'trending';
  title: string;
  message: string;
  amount?: number;
  timestamp: Date;
  isNew: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'earning',
    title: 'New Earnings!',
    message: 'AI used your "Color Theory" video',
    amount: 0.25,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isNew: true
  },
  {
    id: '2',
    type: 'ai-touch',
    title: 'AI Activity',
    message: '15 new AI touches on your content',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    isNew: true
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You reached 1,000 AI touches',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isNew: false
  },
  {
    id: '4',
    type: 'trending',
    title: 'Content Trending',
    message: 'Your "Abstract Art" video is hot right now!',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    isNew: false
  }
];

export const LiveNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'earning' : 'ai-touch',
        title: Math.random() > 0.5 ? 'New Earnings!' : 'AI Activity',
        message: Math.random() > 0.5 
          ? 'AI used your content for training' 
          : `${Math.floor(Math.random() * 20 + 1)} new AI touches`,
        amount: Math.random() > 0.5 ? Math.random() * 0.5 + 0.1 : undefined,
        timestamp: new Date(),
        isNew: true
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'earning': return <DollarSign className="w-4 h-4" />;
      case 'ai-touch': return <Bot className="w-4 h-4" />;
      case 'achievement': return <Zap className="w-4 h-4" />;
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'earning': return 'text-success';
      case 'ai-touch': return 'text-electric';
      case 'achievement': return 'text-primary';
      case 'trending': return 'text-orange-500';
      default: return 'text-muted-foreground';
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Live Activity</h3>
          <p className="text-sm text-muted-foreground">Real-time AI usage and earnings</p>
        </div>
        <Badge className="bg-electric text-electric-foreground">
          {notifications.filter(n => n.isNew).length} New
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        {displayedNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
              notification.isNew 
                ? 'bg-electric/10 border-electric/30 shadow-sm' 
                : 'bg-card border-muted'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-card ${getIconColor(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground">{notification.title}</h4>
                  {notification.amount && (
                    <Badge className="bg-success/20 text-success">
                      +${notification.amount.toFixed(2)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {notifications.length > 5 && (
        <Button
          variant="outline"
          onClick={() => setShowAll(!showAll)}
          className="w-full"
        >
          {showAll ? 'Show Less' : `Show All ${notifications.length} Notifications`}
        </Button>
      )}
    </Card>
  );
};