import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap, DollarSign, Target, Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  total: number;
  reward: string;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Dollar',
    description: 'Earn your first dollar from AI usage',
    icon: <DollarSign className="w-6 h-6" />,
    unlocked: true,
    progress: 1,
    total: 1,
    reward: '$0.10 bonus'
  },
  {
    id: '2',
    title: 'Touch Magnet',
    description: 'Reach 1,000 AI touches',
    icon: <Zap className="w-6 h-6" />,
    unlocked: true,
    progress: 1000,
    total: 1000,
    reward: '$5.00 bonus'
  },
  {
    id: '3',
    title: 'Century Club',
    description: 'Earn $100 in total revenue',
    icon: <Trophy className="w-6 h-6" />,
    unlocked: false,
    progress: 85,
    total: 100,
    reward: '$10.00 bonus'
  },
  {
    id: '4',
    title: 'Viral Creator',
    description: 'Get 10,000 AI touches in one month',
    icon: <Star className="w-6 h-6" />,
    unlocked: false,
    progress: 2450,
    total: 10000,
    reward: '$25.00 bonus'
  },
  {
    id: '5',
    title: 'Daily Earner',
    description: 'Earn money for 30 consecutive days',
    icon: <Target className="w-6 h-6" />,
    unlocked: false,
    progress: 7,
    total: 30,
    reward: '$15.00 bonus'
  },
  {
    id: '6',
    title: 'AI Legend',
    description: 'Reach $1,000 in total earnings',
    icon: <Award className="w-6 h-6" />,
    unlocked: false,
    progress: 158,
    total: 1000,
    reward: '$100.00 bonus'
  }
];

export const AchievementBadges = () => {
  return (
    <Card className="p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
        <p className="text-muted-foreground">Unlock rewards as you grow your passive income</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border transition-all duration-300 ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.2)]'
                : 'bg-card border-muted hover:border-muted-foreground/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                achievement.unlocked 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {achievement.icon}
              </div>
              {achievement.unlocked && (
                <Badge className="bg-success text-success-foreground">
                  Unlocked!
                </Badge>
              )}
            </div>

            <h3 className={`font-semibold mb-1 ${
              achievement.unlocked ? 'text-primary' : 'text-foreground'
            }`}>
              {achievement.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-3">
              {achievement.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-muted-foreground">
                  {achievement.progress.toLocaleString()} / {achievement.total.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-primary to-primary/80'
                      : 'bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/30'
                  }`}
                  style={{ width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-success font-medium">
                Reward: {achievement.reward}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};