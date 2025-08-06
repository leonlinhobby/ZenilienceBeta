/*
  # Complete Zenilience Database Setup

  1. New Tables
    - `user_profiles` - User personal information and subscription details
    - `user_settings` - User preferences and configuration
    - `user_streaks` - Streak tracking and zen garden points
    - `user_health_metrics` - Health and wellness metrics tracking
    - `lessons` - Personalized wellness lessons
    - `chat_sessions` - Chat conversation sessions
    - `chat_messages` - Individual chat messages
    - `user_goals` - User wellness goals
    - `user_progress` - Daily progress tracking
    - `daily_recommendations` - Daily personalized recommendations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Foreign key constraints for data integrity

  3. Functions
    - Automatic user profile creation on signup
    - Streak update functionality
*/

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS daily_recommendations CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS user_goals CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS user_health_metrics CASCADE;
DROP TABLE IF EXISTS user_streaks CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS update_user_streak(uuid) CASCADE;

-- Create user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  age integer,
  gender text,
  occupation text,
  interests text[],
  onboarding_completed boolean DEFAULT false,
  subscription_type text DEFAULT 'explorer' CHECK (subscription_type IN ('explorer', 'zenith')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create user_settings table
CREATE TABLE user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  chat_personality text DEFAULT 'friendly' CHECK (chat_personality IN ('friendly', 'professional')),
  daily_lesson_limit integer DEFAULT 1,
  notifications_enabled boolean DEFAULT true,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_streaks table
CREATE TABLE user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  streak_freeze_used boolean DEFAULT false,
  zen_garden_points integer DEFAULT 0,
  total_lessons_completed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streaks"
  ON user_streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_health_metrics table
CREATE TABLE user_health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 10),
  sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  focus_level integer CHECK (focus_level >= 1 AND focus_level <= 10),
  anxiety_level integer CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 10),
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_health_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own health metrics"
  ON user_health_metrics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create lessons table
CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  lesson_type text NOT NULL CHECK (lesson_type IN ('meditation', 'breathing', 'cbt', 'mindfulness', 'challenge', 'education')),
  content jsonb NOT NULL,
  estimated_duration integer DEFAULT 5,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  position_in_queue integer DEFAULT 1,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lessons"
  ON lessons
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text DEFAULT 'New Chat',
  message_count integer DEFAULT 0,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat sessions"
  ON chat_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat messages"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_goals table
CREATE TABLE user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  goal_type text NOT NULL,
  goal_description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
  ON user_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_progress table
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  completed_sessions integer DEFAULT 0,
  zen_garden_points integer DEFAULT 0,
  mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 10),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create daily_recommendations table
CREATE TABLE daily_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own recommendations"
  ON daily_recommendations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, onboarding_completed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    false
  );
  
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);
  
  INSERT INTO user_streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid uuid)
RETURNS void AS $$
DECLARE
  today_date date := CURRENT_DATE;
  yesterday_date date := CURRENT_DATE - INTERVAL '1 day';
  current_streak_val integer := 0;
  longest_streak_val integer := 0;
BEGIN
  -- Get current streak values
  SELECT current_streak, longest_streak
  INTO current_streak_val, longest_streak_val
  FROM user_streaks
  WHERE user_id = user_uuid;
  
  -- Check if user completed a lesson yesterday or today
  IF EXISTS (
    SELECT 1 FROM lessons 
    WHERE user_id = user_uuid 
    AND is_completed = true 
    AND DATE(completed_at) = yesterday_date
  ) OR EXISTS (
    SELECT 1 FROM lessons 
    WHERE user_id = user_uuid 
    AND is_completed = true 
    AND DATE(completed_at) = today_date
  ) THEN
    -- Continue or start streak
    current_streak_val := current_streak_val + 1;
  ELSE
    -- Reset streak if no activity yesterday
    current_streak_val := 1;
  END IF;
  
  -- Update longest streak if current is higher
  IF current_streak_val > longest_streak_val THEN
    longest_streak_val := current_streak_val;
  END IF;
  
  -- Update the streak record
  UPDATE user_streaks
  SET 
    current_streak = current_streak_val,
    longest_streak = longest_streak_val,
    last_activity_date = today_date,
    total_lessons_completed = total_lessons_completed + 1,
    zen_garden_points = zen_garden_points + 10,
    updated_at = now()
  WHERE user_id = user_uuid;
  
EXCEPTION
  WHEN OTHERS THEN
    -- If error, just add points without streak logic
    UPDATE user_streaks
    SET 
      zen_garden_points = zen_garden_points + 10,
      total_lessons_completed = total_lessons_completed + 1,
      updated_at = now()
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert demo user data (this will be handled by the application, not the database)
-- The demo user will be created in the application layer with ID: demo-user-id-12345678-1234-1234-1234-123456789012

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_type);
CREATE INDEX IF NOT EXISTS idx_lessons_user_completed ON lessons(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_recommendations_date ON daily_recommendations(user_id, date);