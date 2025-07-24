import { EarningsCounter } from '@/components/EarningsCounter';
import { ContentLibrary } from '@/components/ContentLibrary';
import { RevenueChart } from '@/components/RevenueChart';
import { AchievementBadges } from '@/components/AchievementBadges';
import { LiveNotifications } from '@/components/LiveNotifications';
import { VideoWatermarking } from '@/components/VideoWatermarking';
import { AIDetectionNetwork } from '@/components/AIDetectionNetwork';
import BlockchainSetup from '@/components/BlockchainSetup';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Creator Studio Header */}
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-creator rounded-lg blur-xl opacity-20"></div>
            <div className="relative bg-card border border-border rounded-lg p-8 shadow-elevated">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-creator rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-creator bg-clip-text text-transparent">
                  Creator Studio
                </h1>
                <div className="w-12 h-12 bg-gradient-analytics rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-4">
                Your AI royalty command center - track earnings, protect content, build your empire
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 bg-success/10 text-success px-3 py-2 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Live Analytics</span>
                </div>
                <div className="flex items-center space-x-2 bg-electric/10 text-electric px-3 py-2 rounded-full">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">AI Protection</span>
                </div>
                <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-2 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Smart Rewards</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Watermarking System */}
        <div className="mb-8">
          <VideoWatermarking />
        </div>

        {/* AI Detection Network */}
        <div className="mb-8">
          <AIDetectionNetwork />
        </div>

        {/* Blockchain Watermark Registry */}
        <div className="mb-8">
          <BlockchainSetup />
        </div>

        {/* Earnings Counter */}
        <EarningsCounter 
          totalEarnings={158.92}
          dailyEarnings={3.45}
          monthlyEarnings={89.23}
        />

        {/* Charts */}
        <RevenueChart />

        {/* Achievements */}
        <AchievementBadges />

        {/* Content Library and Live Notifications */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <ContentLibrary />
          </div>
          <div className="xl:col-span-1">
            <LiveNotifications />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 border-t border-muted">
          <p className="text-muted-foreground">
            Empowering artists with fair AI compensation since 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
