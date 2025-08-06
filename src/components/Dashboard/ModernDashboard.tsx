import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDashboard } from '../../hooks/useDashboard';
import { NavigationPage } from '../../types/dashboard';
import { LogOut } from 'lucide-react';

import BottomNavigation from './BottomNavigation';
import DashboardHome from './DashboardHome';
import ZenGarden from './ZenGarden';
import Analytics from './Analytics';
import ZenoChat from './ZenoChat';
import ProfileSettings from './ProfileSettings';
import OnboardingTour from '../Onboarding/OnboardingTour';
import PersonalInfoForm from '../Onboarding/PersonalInfoForm';
import GoalsForm from '../Onboarding/GoalsForm';

const ModernDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, addGoal } = useUserProfile();
  const { 
    settings, 
    streaks, 
    lessons, 
    chatSessions, 
    loading: dashboardLoading,
    completeLesson,
    createChatSession,
    addChatMessage,
    getChatMessages,
    updateSettings,
    recordHealthMetrics
  } = useDashboard();

  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [onboardingStep, setOnboardingStep] = useState(0);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleOnboardingComplete = () => {
    setOnboardingStep(1);
  };

  const handlePersonalInfoComplete = async (data: any) => {
    await updateProfile(data);
    setOnboardingStep(2);
  };

  const handleGoalsComplete = async (goals: any[]) => {
    for (const goal of goals) {
      await addGoal(goal.goal_type, goal.goal_description);
    }
    await updateProfile({ onboarding_completed: true });
    setOnboardingStep(3);
  };

  if (profileLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your wellness dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Setting up your personalized experience</p>
        </div>
      </div>
    );
  }

  // Show onboarding for new users
  if (!profile || !profile.onboarding_completed) {
    if (onboardingStep === 0) {
      return <OnboardingTour onComplete={handleOnboardingComplete} />;
    } else if (onboardingStep === 1) {
      return <PersonalInfoForm onComplete={handlePersonalInfoComplete} />;
    } else if (onboardingStep === 2) {
      return <GoalsForm onComplete={handleGoalsComplete} />;
    }
  }

  const renderCurrentPage = () => {
    if (!profile) return null;

    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardHome 
            profile={profile} 
            streaks={streaks} 
            lessons={lessons}
            onCompleteLesson={completeLesson}
          />
        );
      case 'zen-garden':
        return <ZenGarden streaks={streaks} />;
      case 'analytics':
        return <Analytics profile={profile} streaks={streaks} />;
      case 'chat':
        return (
          <ZenoChat 
            profile={profile}
            settings={settings}
            chatSessions={chatSessions}
            onCreateSession={createChatSession}
            onAddMessage={addChatMessage}
            onGetMessages={getChatMessages}
            onUpdateSettings={updateSettings}
          />
        );
      case 'profile':
        return (
          <ProfileSettings 
            profile={profile} 
            settings={settings}
            onUpdateProfile={updateProfile}
            onUpdateSettings={updateSettings}
            onSignOut={handleSignOut}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/very minimalist website background, light mode, happy soft colors, shapes modern.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {renderCurrentPage()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
};

export default ModernDashboard;