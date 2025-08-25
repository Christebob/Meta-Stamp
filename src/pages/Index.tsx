import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformUploader } from "@/components/PlatformUploader";
import { EarningsTicker } from "@/components/EarningsTicker";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Upload, Zap, TrendingUp, Play, Eye, DollarSign, Activity, Sparkles } from 'lucide-react';

const Index = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [aiTouches, setAiTouches] = useState(285643);
  const [earningsPerTouch] = useState(0.875);
  
  // Initialize with 47 fake timestamps spread over the last hour
  const [recentIncreases, setRecentIncreases] = useState<number[]>(() => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const timestamps = [];
    for (let i = 0; i < 47; i++) {
      // Spread 47 timestamps randomly over the last hour
      const randomTime = oneHourAgo + Math.random() * (60 * 60 * 1000);
      timestamps.push(randomTime);
    }
    return timestamps.sort((a, b) => a - b);
  });
  
  const [hourlyIncrease, setHourlyIncrease] = useState(47);


  // Random AI touches ticker - increases 30-60 times per hour (every 60-120 seconds)
  useEffect(() => {
    const scheduleNextTick = () => {
      // Random interval between 60-120 seconds (to get 30-60 ticks per hour)
      const randomInterval = Math.random() * 60000 + 60000; // 60-120 seconds in ms
      
      setTimeout(() => {
        const now = Date.now();
        setAiTouches(prev => prev + 1);
        setRecentIncreases(prev => [...prev, now]);
        scheduleNextTick(); // Schedule the next tick
      }, randomInterval);
    };

    scheduleNextTick();
  }, []);

  // Update hourly counter every minute by filtering timestamps from last 60 minutes
  useEffect(() => {
    const updateHourlyCount = () => {
      const oneHourAgo = Date.now() - 60 * 60 * 1000; // 60 minutes ago
      const increasesInLastHour = recentIncreases.filter(timestamp => timestamp > oneHourAgo);
      
      // Also clean up old timestamps to prevent memory buildup
      setRecentIncreases(increasesInLastHour);
      setHourlyIncrease(increasesInLastHour.length);
    };

    // Update immediately and then every minute
    updateHourlyCount();
    const interval = setInterval(updateHourlyCount, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [recentIncreases]);

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
        <EarningsTicker userName="Chris Coyne" currentEarnings={aiTouches * earningsPerTouch} />
        
        {/* User Controls */}
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Welcome back, Creator
            </div>
          </div>
        </div>

        {/* Earnings Dashboard - Prominently Featured */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
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
                <div className="text-xs text-muted-foreground">+{hourlyIncrease} in last hour</div>
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

          {/* Live Activity Feed */}
          <div className="mb-8">
            <ActivityFeed />
          </div>
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

      {/* Main Section - Platform Uploader */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 space-y-12">
        <PlatformUploader />

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
