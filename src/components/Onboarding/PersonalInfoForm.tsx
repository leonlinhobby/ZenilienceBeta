import React, { useState } from 'react';
import { ArrowRight, User, Briefcase, Heart } from 'lucide-react';

interface PersonalInfoFormProps {
  onComplete: (data: {
    full_name: string;
    age: number;
    gender: string;
    occupation: string;
    interests: string[];
  }) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    occupation: '',
    interests: [] as string[]
  });

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const interestOptions = [
    'Meditation', 'Exercise', 'Reading', 'Music', 'Art', 'Nature',
    'Technology', 'Cooking', 'Travel', 'Writing', 'Sports', 'Gaming',
    'Photography', 'Learning', 'Volunteering', 'Socializing'
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      full_name: formData.full_name,
      age: parseInt(formData.age),
      gender: formData.gender,
      occupation: formData.occupation,
      interests: formData.interests
    });
  };

  const isValid = formData.full_name && formData.age && formData.gender && formData.occupation;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/very minimalist website background, light mode, happy soft colors, shapes modern.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-stone-200">
            <div className="text-center mb-8">
              <div className="bg-stone-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-stone-600" />
              </div>
              <h2 className="text-3xl font-bold text-stone-800 mb-2">
                Tell us about yourself
              </h2>
              <p className="text-stone-600">
                This helps us personalize your wellness journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="Your age"
                    min="13"
                    max="120"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select gender</option>
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  placeholder="What do you do for work?"
                  required
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  <Heart className="w-4 h-4 inline mr-1" />
                  Interests (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.interests.includes(interest)
                          ? 'border-stone-600 bg-stone-600 text-white'
                          : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-stone-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center group"
              >
                Continue to Goals
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;