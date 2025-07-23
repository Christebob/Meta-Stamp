import { EarningsCounter } from '@/components/EarningsCounter';
import { ContentLibrary } from '@/components/ContentLibrary';
import { RevenueChart } from '@/components/RevenueChart';
import { AchievementBadges } from '@/components/AchievementBadges';
import { LiveNotifications } from '@/components/LiveNotifications';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-electric bg-clip-text text-transparent">
              AI Royalty Tracker
            </h1>
            <Zap className="w-8 h-8 text-electric" />
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            Watch your creative work generate passive income through AI usage
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span>Real-time tracking</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-electric" />
              <span>Instant notifications</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Achievement rewards</span>
            </div>
          </div>
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
