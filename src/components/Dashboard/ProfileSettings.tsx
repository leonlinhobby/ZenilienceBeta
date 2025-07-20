import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Save, 
  Crown, 
  Bell,
  Shield,
  CreditCard,
  Edit3
} from 'lucide-react';
import { UserProfile } from '../../types/user';
import { UserSettings } from '../../types/dashboard';

interface ProfileSettingsProps {
  profile: UserProfile;
  settings: UserSettings | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onUpdateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  onSignOut: () => Promise<void>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'subscription'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: profile.full_name || '',
    age: profile.age || '',
    occupation: profile.occupation || '',
    interests: profile.interests || []
  });

  const handleSaveProfile = async () => {
    await onUpdateProfile({
      full_name: editForm.full_name,
      age: parseInt(editForm.age.toString()) || undefined,
      occupation: editForm.occupation,
      interests: editForm.interests
    });
    setIsEditing(false);
  };

  const handleAddInterest = (interest: string) => {
    if (interest && !editForm.interests.includes(interest)) {
      setEditForm(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const interestSuggestions = [
    'Meditation', 'Yoga', 'Lesen', 'Musik', 'Sport', 'Kochen',
    'Reisen', 'Natur', 'Kunst', 'Technologie', 'Fotografie', 'Schreiben'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200 px-4 py-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-stone-400 to-stone-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">
            {profile.full_name || 'Dein Profil'}
          </h1>
          <p className="text-stone-600">
            {profile.subscription_type === 'zenith' ? 'Zenith Member' : 'Explorer Member'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4">
        <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1">
          {[
            { id: 'profile', label: 'Profil', icon: User },
            { id: 'account', label: 'Konto', icon: Settings },
            { id: 'subscription', label: 'Abo', icon: Crown }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-stone-600 text-white shadow-lg'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-stone-800">Persönliche Daten</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-stone-600 hover:text-stone-800 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Vollständiger Name
                    </label>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Alter
                      </label>
                      <input
                        type="number"
                        value={editForm.age}
                        onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Beruf
                      </label>
                      <input
                        type="text"
                        value={editForm.occupation}
                        onChange={(e) => setEditForm(prev => ({ ...prev, occupation: e.target.value }))}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Interessen
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editForm.interests.map((interest) => (
                        <span
                          key={interest}
                          className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {interest}
                          <button
                            onClick={() => handleRemoveInterest(interest)}
                            className="ml-2 text-stone-500 hover:text-stone-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {interestSuggestions
                        .filter(interest => !editForm.interests.includes(interest))
                        .map((interest) => (
                          <button
                            key={interest}
                            onClick={() => handleAddInterest(interest)}
                            className="bg-stone-50 text-stone-600 px-3 py-1 rounded-full text-sm hover:bg-stone-100 transition-colors"
                          >
                            + {interest}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-stone-600 text-white py-3 px-6 rounded-lg hover:bg-stone-700 transition-colors flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Speichern
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 text-stone-600 hover:text-stone-800 transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-stone-600">Name</label>
                      <p className="font-medium text-stone-800">
                        {profile.full_name || 'Nicht angegeben'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-stone-600">Alter</label>
                      <p className="font-medium text-stone-800">
                        {profile.age || 'Nicht angegeben'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-stone-600">Beruf</label>
                    <p className="font-medium text-stone-800">
                      {profile.occupation || 'Nicht angegeben'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-stone-600">Interessen</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.interests && profile.interests.length > 0 ? (
                        profile.interests.map((interest) => (
                          <span
                            key={interest}
                            className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-stone-500">Keine Interessen angegeben</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200">
              <h3 className="text-xl font-bold text-stone-800 mb-4">Konto-Einstellungen</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-stone-600 mr-3" />
                    <span className="text-stone-800">Benachrichtigungen</span>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ 
                      notifications_enabled: !settings?.notifications_enabled 
                    })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings?.notifications_enabled ? 'bg-stone-600' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                      settings?.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-stone-600 mr-3" />
                    <span className="text-stone-800">Datenschutz</span>
                  </div>
                  <button className="text-stone-600 hover:text-stone-800 transition-colors">
                    Verwalten
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-3xl p-6 border border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-4">Gefahrenbereich</h3>
              
              <div className="space-y-4">
                <button
                  onClick={onSignOut}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Abmelden
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200">
              <h3 className="text-xl font-bold text-stone-800 mb-4">Aktueller Plan</h3>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {profile.subscription_type === 'zenith' ? (
                    <Crown className="w-8 h-8 text-yellow-600 mr-3" />
                  ) : (
                    <User className="w-8 h-8 text-stone-600 mr-3" />
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-stone-800">
                      {profile.subscription_type === 'zenith' ? 'Zenith' : 'Explorer'}
                    </h4>
                    <p className="text-stone-600">
                      {profile.subscription_type === 'zenith' ? 'Premium Plan' : 'Kostenloser Plan'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-stone-800">
                    {profile.subscription_type === 'zenith' ? '5,99€' : 'Kostenlos'}
                  </div>
                  {profile.subscription_type === 'zenith' && (
                    <div className="text-sm text-stone-600">/Monat</div>
                  )}
                </div>
              </div>

              {profile.subscription_type === 'explorer' && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Upgrade zu Zenith
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1 mb-4">
                    <li>• Unbegrenzte Lektionen</li>
                    <li>• Unbegrenzter Zeno Chat</li>
                    <li>• Erweiterte Analytik</li>
                    <li>• Premium Inhalte</li>
                  </ul>
                  <button className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Upgrade (Coming Soon)
                  </button>
                </div>
              )}

              {profile.subscription_type === 'zenith' && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Zenith Vorteile
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1 mb-4">
                    <li>✓ Unbegrenzte Lektionen</li>
                    <li>✓ Unbegrenzter Zeno Chat</li>
                    <li>✓ Erweiterte Analytik</li>
                    <li>✓ Premium Inhalte</li>
                  </ul>
                  <button className="w-full bg-stone-600 text-white py-3 px-6 rounded-lg hover:bg-stone-700 transition-colors">
                    Abo verwalten (Coming Soon)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;