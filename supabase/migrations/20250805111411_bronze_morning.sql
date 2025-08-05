/*
  # Complete Database Setup for Zenilience

  1. New Tables
    - `user_profiles` - User profile information
    - `user_goals` - User wellness goals
    - `user_progress` - Daily progress tracking
    - `daily_recommendations` - Personalized daily recommendations
    - `user_settings` - User preferences and settings
    - `user_streaks` - Streak tracking and zen points
    - `user_health_metrics` - Health and wellness metrics
    - `lessons` - Personalized lessons for users
    - `chat_sessions` - Chat conversation sessions
    - `chat_messages` - Individual chat messages

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Create trigger for automatic user profile creation

  3. Functions
    - `create_user_profile()` - Automatically creates user profile on signup
    - `update_user_streak()` - Updates user streak when lessons are completed
*/

-- Drop existing objects with CASCADE to handle dependencies
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users CASCADE;
DROP FUNCTION IF EXISTS create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS update_user_streak(uuid) CASCADE;

-- Drop existing tables with CASCADE
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS user_health_metrics CASCADE;
DROP TABLE IF EXISTS user_streaks CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS daily_recommendations CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS user_goals CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- Create user_goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  goal_type text NOT NULL,
  goal_description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
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

-- Create daily_recommendations table
CREATE TABLE IF NOT EXISTS daily_recommendations (
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

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
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

-- Create user_streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
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

-- Create user_health_metrics table
CREATE TABLE IF NOT EXISTS user_health_metrics (
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

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
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

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text DEFAULT 'New Chat',
  message_count integer DEFAULT 0,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
  -- User profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
  END IF;

  -- User goals policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_goals' AND policyname = 'Users can manage own goals') THEN
    CREATE POLICY "Users can manage own goals" ON user_goals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- User progress policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_progress' AND policyname = 'Users can manage own progress') THEN
    CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Daily recommendations policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_recommendations' AND policyname = 'Users can manage own recommendations') THEN
    CREATE POLICY "Users can manage own recommendations" ON daily_recommendations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- User settings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can manage own settings') THEN
    CREATE POLICY "Users can manage own settings" ON user_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- User streaks policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_streaks' AND policyname = 'Users can manage own streaks') THEN
    CREATE POLICY "Users can manage own streaks" ON user_streaks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- User health metrics policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_health_metrics' AND policyname = 'Users can manage own health metrics') THEN
    CREATE POLICY "Users can manage own health metrics" ON user_health_metrics FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Lessons policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lessons' AND policyname = 'Users can manage own lessons') THEN
    CREATE POLICY "Users can manage own lessons" ON lessons FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Chat sessions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_sessions' AND policyname = 'Users can manage own chat sessions') THEN
    CREATE POLICY "Users can manage own chat sessions" ON chat_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Chat messages policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can manage own chat messages') THEN
    CREATE POLICY "Users can manage own chat messages" ON chat_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, created_at, updated_at)
  VALUES (NEW.id, now(), now())
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO user_settings (user_id, created_at, updated_at)
  VALUES (NEW.id, now(), now())
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO user_streaks (user_id, created_at, updated_at)
  VALUES (NEW.id, now(), now())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user streak
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
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, zen_garden_points, total_lessons_completed)
    VALUES (user_uuid, 1, 1, today_date, 10, 1)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN;
  END IF;
  
  -- Check if user already completed a lesson today
  IF EXISTS (
    SELECT 1 FROM user_streaks 
    WHERE user_id = user_uuid AND last_activity_date = today_date
  ) THEN
    -- Just update lesson count and points
    UPDATE user_streaks 
    SET 
      total_lessons_completed = total_lessons_completed + 1,
      zen_garden_points = zen_garden_points + 10,
      updated_at = now()
    WHERE user_id = user_uuid;
    RETURN;
  END IF;
  
  -- Update streak based on last activity
  IF (SELECT last_activity_date FROM user_streaks WHERE user_id = user_uuid) = yesterday_date THEN
    -- Continue streak
    current_streak_val := current_streak_val + 1;
    longest_streak_val := GREATEST(longest_streak_val, current_streak_val);
  ELSIF (SELECT last_activity_date FROM user_streaks WHERE user_id = user_uuid) < yesterday_date THEN
    -- Reset streak
    current_streak_val := 1;
  ELSE
    -- Same day or future date, just continue
    current_streak_val := GREATEST(current_streak_val, 1);
  END IF;
  
  -- Update the streak record
  UPDATE user_streaks 
  SET 
    current_streak = current_streak_val,
    longest_streak = GREATEST(longest_streak_val, current_streak_val),
    last_activity_date = today_date,
    total_lessons_completed = total_lessons_completed + 1,
    zen_garden_points = zen_garden_points + 10,
    updated_at = now()
  WHERE user_id = user_uuid;
  
EXCEPTION
  WHEN OTHERS THEN
    -- If anything fails, just log and continue
    RAISE NOTICE 'Error updating streak for user %: %', user_uuid, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user profile creation
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Create demo user data (optional - only if demo user doesn't exist)
DO $$
BEGIN
  -- Insert demo user profile if it doesn't exist
  INSERT INTO user_profiles (
    id, 
    full_name, 
    age, 
    gender, 
    occupation, 
    interests, 
    onboarding_completed, 
    subscription_type,
    created_at,
    updated_at
  ) VALUES (
    'demo-user-id-12345678-1234-1234-1234-123456789012'::uuid,
    'Demo User',
    28,
    'prefer_not_to_say',
    'Software Developer',
    ARRAY['Meditation', 'Technology', 'Reading', 'Nature'],
    true,
    'zenith',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert demo user settings
  INSERT INTO user_settings (
    user_id,
    chat_personality,
    daily_lesson_limit,
    notifications_enabled,
    theme,
    created_at,
    updated_at
  ) VALUES (
    'demo-user-id-12345678-1234-1234-1234-123456789012'::uuid,
    'friendly',
    5,
    true,
    'light',
    now(),
    now()
  ) ON CONFLICT (user_id) DO NOTHING;

  -- Insert demo user streak
  INSERT INTO user_streaks (
    user_id,
    current_streak,
    longest_streak,
    last_activity_date,
    streak_freeze_used,
    zen_garden_points,
    total_lessons_completed,
    created_at,
    updated_at
  ) VALUES (
    'demo-user-id-12345678-1234-1234-1234-123456789012'::uuid,
    7,
    12,
    CURRENT_DATE,
    false,
    150,
    15,
    now(),
    now()
  ) ON CONFLICT (user_id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    -- If demo data insertion fails, continue anyway
    RAISE NOTICE 'Demo data insertion failed: %', SQLERRM;
END $$;