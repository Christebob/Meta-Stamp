import { EarningsCounter } from '@/components/EarningsCounter';
import { EarningsTicker } from '@/components/EarningsTicker';
import { ContentLibrary } from '@/components/ContentLibrary';
import { RevenueChart } from '@/components/RevenueChart';
import { AchievementBadges } from '@/components/AchievementBadges';
import { LiveNotifications } from '@/components/LiveNotifications';
import { VideoWatermarking } from '@/components/VideoWatermarking';
import { AIDetectionNetwork } from '@/components/AIDetectionNetwork';
import { PlatformUploader } from '@/components/PlatformUploader';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-background to-background/90 p-3 overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-creator rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-creator bg-clip-text text-transparent">
            Claim Your Cut
          </h1>
        </div>
        <EarningsTicker userName="Chris Coyne" />
      </div>

      {/* Command Center Grid */}
      <div className="grid grid-cols-12 gap-3 h-[calc(100vh-80px)]">
        {/* Left Panel - Upload & Control */}
        <div className="col-span-4 space-y-3">
          <PlatformUploader />
          <VideoWatermarking />
          <AIDetectionNetwork />
        </div>

        {/* Center Panel - Analytics */}
        <div className="col-span-5 space-y-3">
          <EarningsCounter 
            totalEarnings={158.92}
            dailyEarnings={3.45}
            monthlyEarnings={89.23}
          />
          <RevenueChart />
        </div>

        {/* Right Panel - Status & Achievements */}
        <div className="col-span-3 space-y-3">
          <LiveNotifications />
          <AchievementBadges />
          <ContentLibrary />
        </div>
      </div>
    </div>
  );
};

export default Index;
