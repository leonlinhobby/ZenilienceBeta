import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/user';

interface WelcomeMessageProps {
  profile: UserProfile;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ profile }) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const welcomeMessages = [
    `Welcome back, ${profile.full_name || 'friend'}! Ready to continue your wellness journey?`,
    `Great to see you again, ${profile.full_name || 'friend'}! Let's make today amazing.`,
    `Hello ${profile.full_name || 'friend'}! Your mental wellness matters - let's take care of it together.`,
    `Welcome back, ${profile.full_name || 'friend'}! Every small step counts on your journey.`,
    `Hi ${profile.full_name || 'friend'}! Time to nurture your mind and spirit today.`
  ];

  const dailyImpulses = [
    "Remember: Progress, not perfection. Every step forward matters.",
    "Today's mindfulness: Focus on what you can control, let go of what you can't.",
    "Your mental health is just as important as your physical health.",
    "Take a deep breath. You've got this, one moment at a time.",
    "Resilience isn't about being strong all the time - it's about bouncing back.",
    "Small daily practices create lasting change.",
    "Be kind to yourself today. You deserve compassion.",
    "Your feelings are valid. Honor them and let them guide you to growth."
  ];

  useEffect(() => {
    const messageIndex = Math.floor(Math.random() * welcomeMessages.length);
    setCurrentMessage(messageIndex);
  }, []);

  const todayImpulse = dailyImpulses[new Date().getDate() % dailyImpulses.length];

  return (
    <div className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-stone-800 mb-2">
        {welcomeMessages[currentMessage]}
      </h2>
      <p className="text-stone-600 italic">
        💭 {todayImpulse}
      </p>
    </div>
  );
};

export default WelcomeMessage;