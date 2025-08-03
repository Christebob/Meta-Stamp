import { EarningsTicker } from '@/components/EarningsTicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Zap, TrendingUp, Play, Eye, DollarSign, Activity, Sparkles } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [aiTouches] = useState(2847);
  const [earningsPerTouch] = useState(0.0573);

  const platforms = [
    { name: 'YouTube', icon: '▶️', color: 'text-red-500' },
    { name: 'TikTok', icon: '🎵', color: 'text-foreground' },
    { name: 'Instagram', icon: '📷', color: 'text-pink-500' },
    { name: 'Twitter/X', icon: '🐦', color: 'text-primary' },
    { name: 'Facebook', icon: '👤', color: 'text-primary' },
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
    <div className="min-h-screen bg-white futuristic-grid">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 light-rays pointer-events-none" />
      
      {/* Top Section */}
      <div className="relative z-10">
        <EarningsTicker userName="Chris Coyne" />
        
        {/* Earnings Dashboard - Prominently Featured */}
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* AI Touches Counter */}
            <Card className="glass-panel border-0 rounded-3xl glow-primary floating">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-primary mr-2" />
                  <span className="text-xs font-medium text-primary">AI TOUCHES</span>
                </div>
                <div className="text-4xl font-black text-primary mb-1 holographic">
                  {aiTouches.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">+47 in last hour</div>
              </CardContent>
            </Card>

            {/* Earnings Per Touch */}
            <Card className="glass-panel border-0 rounded-3xl glow-success floating" style={{ animationDelay: '0.5s' }}>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5 text-success mr-2" />
                  <span className="text-xs font-medium text-success">PER TOUCH</span>
                </div>
                <div className="text-4xl font-black text-success mb-1 holographic">
                  ${earningsPerTouch.toFixed(4)}
                </div>
                <div className="text-xs text-muted-foreground">+12% this week</div>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="glass-panel border-0 rounded-3xl glow-primary floating" style={{ animationDelay: '1s' }}>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-primary mr-2" />
                  <span className="text-xs font-medium text-primary">TOTAL EARNED</span>
                </div>
                <div className="text-4xl font-black text-primary mb-1 holographic">
                  ${(aiTouches * earningsPerTouch).toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">All-time</div>
              </CardContent>
            </Card>
          </div>

          {/* Live Activity Feed - Highlighted Like Ticker */}
          <Card className="glass-panel border-0 rounded-3xl mb-8 shadow-elevated glow-success">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
                <Eye className="w-5 h-5 mr-2" />
                Live Activity Feed
              </h3>
              <div className="space-y-3 text-left">
                <div className="glass-panel rounded-2xl p-3 flex items-center justify-between transition-smooth hover:glow-success">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 text-primary mr-3" />
                    <span className="text-sm">GPT-4 accessed "Summer Vibes Tutorial"</span>
                  </div>
                  <span className="text-success font-bold">+$0.057</span>
                </div>
                <div className="glass-panel rounded-2xl p-3 flex items-center justify-between transition-smooth hover:glow-success">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 text-primary mr-3" />
                    <span className="text-sm">Claude-3 analyzed "Dance Moves Compilation"</span>
                  </div>
                  <span className="text-success font-bold">+$0.043</span>
                </div>
                <div className="glass-panel rounded-2xl p-3 flex items-center justify-between transition-smooth hover:glow-success">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 text-primary mr-3" />
                    <span className="text-sm">Gemini trained on "Cooking Masterclass"</span>
                  </div>
                  <span className="text-success font-bold">+$0.065</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Smaller Claim Your Cut Section */}
        <div className="text-center py-12 px-4">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-creator bg-clip-text text-transparent mb-4 holographic">
              CLAIM YOUR CUT
            </h1>
            <div className="absolute inset-0 bg-gradient-creator opacity-20 blur-3xl rounded-full" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Upload. Get Meta-Stamped. Track Your Influence. Get Paid.
          </p>
        </div>
      </div>

      {/* Main Section - Streamlined */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 space-y-12">
        
        {/* Upload Zone */}
        <div className="text-center">
          <Card className="glass-panel border-0 rounded-2xl particle-border overflow-hidden">
            <CardContent className="p-4 relative">
              <div className="light-rays absolute inset-0" />
              <div className="relative z-10 flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gradient-creator rounded-full flex items-center justify-center glow-primary floating">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Drop here to track your influence</h3>
                <p className="text-sm text-muted-foreground">Any video format</p>
                <Button size="sm" className="btn-futuristic px-4 py-2 text-sm font-semibold rounded-xl">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Selector */}
        <div className="text-center">
          <h2 className="text-lg font-bold mb-3">Choose Your Distribution Channels</h2>
          
          <div className="grid grid-cols-5 gap-2 max-w-lg mx-auto">
            {platforms.map((platform) => (
              <Card 
                key={platform.name}
                className={`glass-panel border-0 rounded-xl cursor-pointer transition-smooth hover:scale-105 floating shadow-floating ${
                  selectedPlatforms.includes(platform.name) 
                    ? 'glow-primary' 
                    : 'hover:glow-primary'
                }`}
                onClick={() => togglePlatform(platform.name)}
              >
                <CardContent className="p-2 text-center">
                  <div className="text-lg mb-1">{platform.icon}</div>
                  <p className="text-xs font-medium">{platform.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Models Using Your Content */}
        <Card className="glass-panel border-0 rounded-3xl shadow-elevated">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
              <Activity className="w-5 h-5 mr-2" />
              AI Models Using Your Content
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiModels.map((model, index) => (
                <div key={model.name} className="glass-panel rounded-2xl p-4 transition-smooth hover:glow-primary floating" style={{ animationDelay: `${index * 0.3}s` }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-sm text-success font-bold">+${model.earnings}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{model.touches}</div>
                  <div className="text-xs text-muted-foreground">touches today</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Philosophy Section */}
      <div className="relative z-10 text-center py-20 px-4 mt-20">
        <div className="glass-panel border-0 rounded-3xl p-12 max-w-4xl mx-auto shadow-elevated">
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-6">
            "No ads. No desperation. No corporate slavery.<br/>
            Just masters of their craft getting paid for their talent."
          </blockquote>
          <div className="text-sm text-muted-foreground">
            Empowering creators with fair AI compensation since 2024
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
