import { EarningsTicker } from '@/components/EarningsTicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Zap, TrendingUp, Play, Eye, DollarSign, Activity } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [aiTouches] = useState(2847);
  const [earningsPerTouch] = useState(0.0573);

  const platforms = [
    { name: 'YouTube', icon: '▶️', color: 'bg-red-500' },
    { name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
    { name: 'Twitter/X', icon: '🐦', color: 'bg-blue-500' },
    { name: 'Facebook', icon: '👤', color: 'bg-blue-600' },
    { name: 'BeastTube', icon: '🦁', color: 'bg-orange-500' },
    { name: 'Meta Hub', icon: '🌐', color: 'bg-purple-500' },
  ];

  const aiModels = [
    { name: 'GPT-4', touches: 1247, earnings: 71.45 },
    { name: 'Claude-3', touches: 892, earnings: 51.12 },
    { name: 'Gemini', touches: 708, earnings: 40.59 },
  ];

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background text-foreground">
      {/* Top Section */}
      <div className="relative">
        <EarningsTicker userName="Chris Coyne" />
        
        <div className="text-center pt-24 pb-16 px-4">
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-creator bg-clip-text text-transparent mb-6">
            CLAIM YOUR CUT
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Upload. Get Meta-Stamped. Track Your Influence. Get Paid.
          </p>
        </div>
      </div>

      {/* Main Section - 3 Steps */}
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Step 1: Upload Zone */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-creator rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">1</div>
            <h2 className="text-3xl font-bold">Upload Your Masterpiece</h2>
          </div>
          
          <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-gradient-creator rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Drop Your Masterpiece Here</h3>
                <p className="text-muted-foreground">Any video format • Max 500GB</p>
                <Button size="lg" className="mt-4">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step 2: Platform Selector */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-analytics rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">2</div>
            <h2 className="text-3xl font-bold">Choose Your Distribution Channels</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {platforms.map((platform) => (
              <Card 
                key={platform.name}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedPlatforms.includes(platform.name) 
                    ? 'border-primary shadow-lg' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => togglePlatform(platform.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">{platform.icon}</div>
                  <p className="text-sm font-medium">{platform.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Step 3: Live Influence Tracker */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">3</div>
            <h2 className="text-3xl font-bold">Track Your Live Influence</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* AI Touches Counter */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">AI TOUCHES</span>
                </div>
                <div className="text-4xl font-black text-primary mb-1">
                  {aiTouches.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">+47 in last hour</div>
              </CardContent>
            </Card>

            {/* Earnings Per Touch */}
            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-6 h-6 text-success mr-2" />
                  <span className="text-sm font-medium text-success">PER TOUCH</span>
                </div>
                <div className="text-4xl font-black text-success mb-1">
                  ${earningsPerTouch.toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">+12% this week</div>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="bg-gradient-to-br from-electric/10 to-electric/5 border-electric/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-electric mr-2" />
                  <span className="text-sm font-medium text-electric">TOTAL EARNED</span>
                </div>
                <div className="text-4xl font-black text-electric mb-1">
                  ${(aiTouches * earningsPerTouch).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">All-time</div>
              </CardContent>
            </Card>
          </div>

          {/* AI Models Using Your Content */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                AI Models Using Your Content
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiModels.map((model) => (
                  <div key={model.name} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-sm text-success">+${model.earnings}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">{model.touches}</div>
                    <div className="text-sm text-muted-foreground">touches today</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Notifications */}
          <Card className="bg-gradient-to-r from-primary/5 to-electric/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Live Activity Feed
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm">GPT-4 accessed "Summer Vibes Tutorial"</span>
                  <span className="text-success font-medium">+$0.057</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm">Claude-3 analyzed "Dance Moves Compilation"</span>
                  <span className="text-success font-medium">+$0.043</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm">Gemini trained on "Cooking Masterclass"</span>
                  <span className="text-success font-medium">+$0.065</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="text-center py-20 px-4 mt-20 border-t border-border">
        <blockquote className="text-2xl md:text-3xl font-medium text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          "No ads. No desperation. No corporate slavery.<br/>
          Just masters of their craft getting paid for their talent."
        </blockquote>
        <div className="mt-8 text-sm text-muted-foreground/70">
          Empowering creators with fair AI compensation since 2024
        </div>
      </div>
    </div>
  );
};

export default Index;
