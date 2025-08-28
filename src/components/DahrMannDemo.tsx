import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Eye, DollarSign, Brain, TrendingUp, Video } from 'lucide-react';

interface VideoContent {
  id: string;
  title: string;
  views: number;
  duration: string;
  uploadDate: string;
  aiTouches: {
    openai: number;
    grok: number;
    google: number;
    anthropic: number;
  };
  revenue: number;
  thumbnail: string;
}

interface AICompany {
  name: string;
  color: string;
  bgColor: string;
  rate: number;
}

const aiCompanies: Record<string, AICompany> = {
  openai: { name: 'OpenAI', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', rate: 0.95 },
  grok: { name: 'Grok', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', rate: 0.88 },
  google: { name: 'Google', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', rate: 0.82 },
  anthropic: { name: 'Anthropic', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', rate: 0.91 }
};

const generateDahrMannContent = (): VideoContent[] => {
  const videoTitles = [
    "Student Gets BULLIED For Being POOR, What Happens Next Will SHOCK You",
    "Kid Gets KICKED OUT Of Restaurant For Being HOMELESS, Ending Is SHOCKING",
    "Teen REFUSES To Help DISABLED Classmate, Lives To REGRET It",
    "Girl Gets MADE FUN OF For Her ACNE, The Ending Will MAKE You CRY",
    "Boy STEALS From CHARITY, You Won't BELIEVE What Happens Next",
    "Student CHEATS On Test, What The Teacher Does Is SHOCKING",
    "Teen LIES About FAMILY WEALTH, The Truth Will SURPRISE You",
    "Girl JUDGES Boy By His CLOTHES, What Happens Next Is INCREDIBLE",
    "Kid REFUSES To Share LUNCH, The Ending Will SHOCK You",
    "Student MOCKS TEACHER'S ACCENT, What Happens Next Is UNBELIEVABLE"
  ];

  return videoTitles.map((title, index) => ({
    id: `dahr-${index + 1}`,
    title,
    views: Math.floor(Math.random() * 50000000) + 1000000,
    duration: `${Math.floor(Math.random() * 10) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    uploadDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    aiTouches: {
      openai: Math.floor(Math.random() * 500000) + 100000,
      grok: Math.floor(Math.random() * 300000) + 50000,
      google: Math.floor(Math.random() * 400000) + 75000,
      anthropic: Math.floor(Math.random() * 250000) + 40000
    },
    revenue: 0,
    thumbnail: `https://picsum.photos/320/180?random=${index + 1}`
  })).map(video => ({
    ...video,
    revenue: Object.entries(video.aiTouches).reduce((total, [company, touches]) => 
      total + (touches * aiCompanies[company].rate), 0
    )
  }));
};

const DahrMannDemo = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const content = generateDahrMannContent();
      setVideos(content);
      setSelectedVideo(content[0]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const totalRevenue = videos.reduce((sum, video) => sum + video.revenue, 0);
  const totalTouches = videos.reduce((sum, video) => 
    sum + Object.values(video.aiTouches).reduce((a, b) => a + b, 0), 0
  );

  const companyTotals = Object.keys(aiCompanies).reduce((acc, company) => {
    acc[company] = {
      touches: videos.reduce((sum, video) => sum + video.aiTouches[company as keyof typeof video.aiTouches], 0),
      revenue: videos.reduce((sum, video) => sum + (video.aiTouches[company as keyof typeof video.aiTouches] * aiCompanies[company].rate), 0)
    };
    return acc;
  }, {} as Record<string, { touches: number; revenue: number }>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium">Loading Dahr Mann Content Library...</p>
          <Progress value={75} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Dahr Mann AI Revenue Demo</h1>
        <p className="text-xl text-muted-foreground">Complete Content Library with AI Touch Monetization</p>
        
        {/* Total Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <Video className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{videos.length}</div>
              <div className="text-sm text-muted-foreground">Total Videos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{totalTouches.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">AI Touches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">${(totalRevenue / totalTouches).toFixed(3)}</div>
              <div className="text-sm text-muted-foreground">Per Touch</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Company Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>AI Company Revenue Breakdown</CardTitle>
              <CardDescription>Revenue generated by each AI company's touches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(aiCompanies).map(([key, company]) => (
                  <div key={key} className={`p-4 rounded-lg ${company.bgColor}`}>
                    <div className="text-center space-y-2">
                      <div className={`text-lg font-bold ${company.color}`}>
                        ${companyTotals[key].revenue.toLocaleString()}
                      </div>
                      <div className="text-sm font-medium">{company.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {companyTotals[key].touches.toLocaleString()} touches
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${company.rate}/touch
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Generating Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videos
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((video, index) => (
                    <div key={video.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-bold text-primary">#{index + 1}</div>
                        <img src={video.thumbnail} alt="" className="w-16 h-9 rounded object-cover" />
                        <div>
                          <div className="font-medium text-sm">{video.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {video.views.toLocaleString()} views • {video.duration}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          ${video.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Object.values(video.aiTouches).reduce((a, b) => a + b, 0).toLocaleString()} touches
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{video.views.toLocaleString()} views</span>
                      <span>{video.duration}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-lg font-bold text-primary">
                        ${video.revenue.toLocaleString()}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1">
                        {Object.entries(video.aiTouches).map(([company, touches]) => (
                          <div key={company} className={`text-xs p-1 rounded ${aiCompanies[company].bgColor}`}>
                            <span className={aiCompanies[company].color}>
                              {aiCompanies[company].name}: {touches.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {selectedVideo && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed AI Analysis: {selectedVideo.title}</CardTitle>
                <CardDescription>AI touches and revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedVideo.aiTouches).map(([company, touches]) => (
                    <div key={company} className={`p-4 rounded-lg ${aiCompanies[company].bgColor}`}>
                      <div className="text-center space-y-2">
                        <div className={`text-2xl font-bold ${aiCompanies[company].color}`}>
                          {touches.toLocaleString()}
                        </div>
                        <div className="font-medium">{aiCompanies[company].name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${(touches * aiCompanies[company].rate).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">AI Touch Distribution</h4>
                  {Object.entries(selectedVideo.aiTouches).map(([company, touches]) => {
                    const total = Object.values(selectedVideo.aiTouches).reduce((a, b) => a + b, 0);
                    const percentage = (touches / total) * 100;
                    return (
                      <div key={company} className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`font-medium ${aiCompanies[company].color}`}>
                            {aiCompanies[company].name}
                          </span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DahrMannDemo;