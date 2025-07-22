/*
  # Complete Database Reset and Setup

  1. Drop all existing tables and functions
  2. Create fresh database schema
  3. Set up proper RLS policies
  4. Create database triggers for user management
  5. Add helper functions
*/

-- Drop all existing tables and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_user_profile();
DROP FUNCTION IF EXISTS public.update_user_streak(uuid);

DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.user_health_metrics CASCADE;
DROP TABLE IF EXISTS public.user_streaks CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.daily_recommendations CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.user_goals CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Create user_profiles table
CREATE TABLE public.user_profiles (
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
CREATE TABLE public.user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  goal_type text NOT NULL,
  goal_description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
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
CREATE TABLE public.daily_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create user_settings table
CREATE TABLE public.user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  chat_personality text DEFAULT 'friendly' CHECK (chat_personality IN ('friendly', 'professional')),
  daily_lesson_limit integer DEFAULT 1,
  notifications_enabled boolean DEFAULT true,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_streaks table
CREATE TABLE public.user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
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
CREATE TABLE public.user_health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
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
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
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
CREATE TABLE public.chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title text DEFAULT 'New Chat',
  message_count integer DEFAULT 0,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Create RLS policies for user_goals
CREATE POLICY "Users can manage own goals" ON public.user_goals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_progress
CREATE POLICY "Users can manage own progress" ON public.user_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for daily_recommendations
CREATE POLICY "Users can manage own recommendations" ON public.daily_recommendations
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_settings
CREATE POLICY "Users can manage own settings" ON public.user_settings
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_streaks
CREATE POLICY "Users can manage own streaks" ON public.user_streaks
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_health_metrics
CREATE POLICY "Users can manage own health metrics" ON public.user_health_metrics
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for lessons
CREATE POLICY "Users can manage own lessons" ON public.lessons
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for chat_sessions
CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can manage own chat messages" ON public.chat_messages
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert user profile
  INSERT INTO public.user_profiles (id, onboarding_completed, subscription_type)
  VALUES (NEW.id, false, 'explorer');
  
  -- Insert user settings
  INSERT INTO public.user_settings (user_id, chat_personality, daily_lesson_limit, notifications_enabled, theme)
  VALUES (NEW.id, 'friendly', 1, true, 'light');
  
  -- Insert user streaks
  INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, zen_garden_points, total_lessons_completed)
  VALUES (NEW.id, 0, 0, 0, 0);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update user streak
CREATE OR REPLACE FUNCTION public.update_user_streak(user_uuid uuid)
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
  FROM public.user_streaks 
  WHERE user_id = user_uuid;
  
  -- Check if user completed a lesson today
  IF EXISTS (
    SELECT 1 FROM public.user_progress 
    WHERE user_id = user_uuid 
    AND date = today_date 
    AND completed_sessions > 0
  ) THEN
    -- Check if user also completed yesterday (continuing streak)
    IF EXISTS (
      SELECT 1 FROM public.user_progress 
      WHERE user_id = user_uuid 
      AND date = yesterday_date 
      AND completed_sessions > 0
    ) THEN
      -- Continue streak
      current_streak_val := current_streak_val + 1;
    ELSE
      -- Start new streak
      current_streak_val := 1;
    END IF;
    
    -- Update longest streak if current is higher
    IF current_streak_val > longest_streak_val THEN
      longest_streak_val := current_streak_val;
    END IF;
    
    -- Update streak record
    UPDATE public.user_streaks 
    SET 
      current_streak = current_streak_val,
      longest_streak = longest_streak_val,
      last_activity_date = today_date,
      total_lessons_completed = total_lessons_completed + 1,
      zen_garden_points = zen_garden_points + 10,
      updated_at = now()
    WHERE user_id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;