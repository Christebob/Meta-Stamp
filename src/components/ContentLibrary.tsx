import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, TrendingUp, Zap, Upload } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  aiTouches: number;
  earnings: number;
  lastUsed: string;
  status: 'active' | 'trending' | 'hot';
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Digital Art Tutorial: Color Theory',
    thumbnail: '/placeholder.svg',
    aiTouches: 1247,
    earnings: 89.45,
    lastUsed: '2 hours ago',
    status: 'hot'
  },
  {
    id: '2',
    title: 'Creative Process Behind Abstract Art',
    thumbnail: '/placeholder.svg',
    aiTouches: 892,
    earnings: 65.30,
    lastUsed: '5 hours ago',
    status: 'trending'
  },
  {
    id: '3',
    title: 'Music Production Workflow',
    thumbnail: '/placeholder.svg',
    aiTouches: 567,
    earnings: 42.15,
    lastUsed: '1 day ago',
    status: 'active'
  }
];

export const ContentLibrary = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'trending': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot': return <Zap className="w-3 h-3" />;
      case 'trending': return <TrendingUp className="w-3 h-3" />;
      default: return <Play className="w-3 h-3" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Content Library</h2>
          <p className="text-muted-foreground">Track your stamped content and AI usage</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
          <Upload className="w-4 h-4 mr-2" />
          Upload & Stamp New Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockContent.map((item) => (
          <Card key={item.id} className="p-4 hover:shadow-lg transition-all duration-300 border-muted">
            <div className="relative mb-4">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-32 object-cover rounded-lg bg-muted"
              />
              <Badge className={`absolute top-2 right-2 text-white ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
                <span className="ml-1 capitalize">{item.status}</span>
              </Badge>
            </div>
            
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Touches:</span>
                <span className="font-medium text-electric">{item.aiTouches.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Earnings:</span>
                <span className="font-medium text-success">${item.earnings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Used:</span>
                <span className="text-muted-foreground">{item.lastUsed}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-muted">
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm">View Details</Button>
                <div className="text-xs text-muted-foreground">
                  ${(item.earnings / item.aiTouches * 1000).toFixed(3)} per 1K touches
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};