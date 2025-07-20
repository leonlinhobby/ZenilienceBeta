import React, { useState } from 'react';
import ModernBottomNav from './ModernBottomNav';
import DashboardHome from './DashboardHome';
import ZenGarden from './ZenGarden';
import Analytics from './Analytics';
import ZenoChat from './ZenoChat';
import ProfileSettings from './ProfileSettings';

const MainDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'zen-garden':
        return <ZenGarden />;
      case 'analytics':
        return <Analytics />;
      case 'chat':
        return <ZenoChat />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="relative">
      {renderContent()}
      <ModernBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MainDashboard;