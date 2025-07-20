import React from 'react';
import { UserProfile, UserProgress, DailyRecommendation } from '../../types/user';
import WelcomeMessage from './WelcomeMessage';
import DailyRecommendationCard from './DailyRecommendation';
import ZenGarden from './ZenGarden';
import ProgressTracker from './ProgressTracker';
import QuickAccess from './QuickAccess';
import PersonalizedRecommendations from './PersonalizedRecommendations';

interface MainDashboardProps {
  profile: UserProfile;
  progress: UserProgress | null;
  dailyRecommendation: DailyRecommendation | null;
  onCompleteRecommendation: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  profile,
  progress,
  dailyRecommendation,
  onCompleteRecommendation
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <WelcomeMessage profile={profile} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Recommendation */}
          {dailyRecommendation && (
            <DailyRecommendationCard
              recommendation={dailyRecommendation}
              profile={profile}
              onComplete={onCompleteRecommendation}
            />
          )}

          {/* Progress Tracker */}
          <ProgressTracker progress={progress} />

          {/* Quick Access */}
          <QuickAccess />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Zen Garden */}
          <ZenGarden progress={progress} />

          {/* Personalized Recommendations */}
          <PersonalizedRecommendations profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;