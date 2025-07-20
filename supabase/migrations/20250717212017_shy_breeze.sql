/*
  # Fix User Profiles Schema

  1. Clean up existing policies and functions
  2. Create user_profiles table with proper structure
  3. Set up RLS policies without conflicts
  4. Create trigger for automatic profile creation

  ## Tables
  - `user_profiles` - User profile information
  - `user_goals` - User wellness goals
  - `user_progress` - Daily progress tracking
  - `daily_recommendations` - AI-generated daily tasks

  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users only
  - Automatic profile creation on signup
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can manage own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view own recommendations" ON daily_recommendations;
DROP POLICY IF EXISTS "Users can update own recommendations" ON daily_recommendations;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
DROP FUNCTION IF EXISTS create_user_profile();

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  full_name text,
  age integer,
  gender text,
  occupation text,
  interests text[],
  onboarding_completed boolean DEFAULT false,
  subscription_type text DEFAULT 'explorer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  goal_type text NOT NULL,
  goal_description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  completed_sessions integer DEFAULT 0,
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 10),
  zen_garden_points integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS daily_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  recommendation_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own goals" ON user_goals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendations" ON daily_recommendations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations" ON daily_recommendations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, onboarding_completed, subscription_type)
  VALUES (NEW.id, false, 'explorer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();