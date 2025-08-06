import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { User, Settings, Save, LogOut, Bell, Palette } from 'lucide-react';

interface UserProfile {
  full_name: string;
  age: number;
  gender: string;
  occupation: string;
  interests: string[];
  subscription_type: string;
}

const ProfileSettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    age: 0,
    gender: '',
    occupation: '',
    interests: [],
    subscription_type: 'explorer'
  });
  const [userSettings, setUserSettings] = useState({
    chat_personality: 'friendly',
    daily_lesson_limit: 1,
    notifications_enabled: true,
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserSettings();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        setProfile({
          full_name: 'Demo User',
          age: 28,
          gender: 'prefer_not_to_say',
          occupation: 'Software Developer',
          interests: ['Meditation', 'Technology', 'Reading', 'Nature'],
          subscription_type: 'zenith'
        });
        console.log('Demo profile settings loaded');
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSettings = async () => {
    try {
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        setUserSettings({
          chat_personality: 'friendly',
          daily_lesson_limit: 5,
          notifications_enabled: true,
          theme: 'light'
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (data) {
        setUserSettings(data);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        alert('Profile saved successfully! (Demo mode)');
        setSaving(false);
        return;
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        alert('Settings saved successfully! (Demo mode)');
        setSaving(false);
        return;
      }
      
      const { error } = await supabase
        .from('user_settings')
        .update({
          ...userSettings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const availableInterests = [
    'Meditation', 'Yoga', 'Sports', 'Reading', 'Music', 'Nature',
    'Cooking', 'Travel', 'Art', 'Technology', 'Photography', 'Writing'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pb-24">
      <div className="text-center pt-8 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="mx-4 mb-6">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <User size={20} className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Settings size={20} className="inline mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="mx-4">
        {activeTab === 'profile' ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Please select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={profile.occupation}
                  onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your occupation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        profile.interests.includes(interest)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Save size={20} />
                    <span>Save Profile</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Settings size={20} className="mr-2" />
                Chat Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chat Personality
                  </label>
                  <select
                    value={userSettings.chat_personality}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, chat_personality: e.target.value as 'friendly' | 'professional' }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="friendly">Friendly & Empathetic</option>
                    <option value="professional">Professional & Clinical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bell size={16} className="inline mr-1" />
                    Notifications
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={userSettings.notifications_enabled}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, notifications_enabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Enable push notifications</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette size={16} className="inline mr-1" />
                    Theme
                  </label>
                  <select
                    value={userSettings.theme}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
              </div>

              <button
                onClick={saveSettings}
                disabled={saving}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Save size={20} />
                    <span>Save Settings</span>
                  </div>
                )}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscription</h2>
              <div className={`p-4 rounded-lg ${
                profile.subscription_type === 'zenith' 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200'
                  : 'bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200'
              }`}>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {profile.subscription_type === 'zenith' ? '✨ Zenith Premium' : '🌟 Explorer'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {profile.subscription_type === 'zenith' 
                    ? 'Unlimited lessons and chat messages'
                    : 'One lesson per day, 5 chat messages daily'
                  }
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                
                <button
                  onClick={signOut}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;