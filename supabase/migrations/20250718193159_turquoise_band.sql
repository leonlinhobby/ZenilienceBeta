/*
  # Complete Dashboard Schema Update

  1. New Tables
    - `lessons` - AI-generated lessons for users
    - `chat_sessions` - Chat session management
    - `chat_messages` - Chat message history
    - `user_settings` - User preferences and settings
    - `user_streaks` - Streak tracking data
    - `user_health_metrics` - Health metrics for AI personalization

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.user_streaks CASCADE;
DROP TABLE IF EXISTS public.user_health_metrics CASCADE;

-- Drop existing tables from previous migration
DROP TABLE IF EXISTS public.user_goals CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.daily_recommendations CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.create_user_profile CASCADE;

-- 1. User Profiles Table
CREATE TABLE public.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    age integer,
    gender text,
    occupation text,
    interests text[],
    onboarding_completed boolean DEFAULT false,
    subscription_type text DEFAULT 'explorer'::text CHECK (subscription_type IN ('explorer', 'zenith')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. User Health Metrics Table (for AI personalization)
CREATE TABLE public.user_health_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
    mood_score integer CHECK (mood_score >= 1 AND mood_score <= 10),
    sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    focus_level integer CHECK (focus_level >= 1 AND focus_level <= 10),
    anxiety_level integer CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    energy_level integer CHECK (energy_level >= 1 AND energy_level <= 10),
    recorded_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- 3. User Settings Table
CREATE TABLE public.user_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    chat_personality text DEFAULT 'friendly'::text CHECK (chat_personality IN ('friendly', 'professional')),
    daily_lesson_limit integer DEFAULT 1,
    notifications_enabled boolean DEFAULT true,
    theme text DEFAULT 'light'::text CHECK (theme IN ('light', 'dark')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id)
);

-- 4. User Streaks Table
CREATE TABLE public.user_streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    last_activity_date date,
    streak_freeze_used boolean DEFAULT false,
    zen_garden_points integer DEFAULT 0,
    total_lessons_completed integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id)
);

-- 5. Lessons Table
CREATE TABLE public.lessons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    lesson_type text NOT NULL CHECK (lesson_type IN ('meditation', 'breathing', 'cbt', 'mindfulness', 'challenge', 'education')),
    content jsonb NOT NULL,
    estimated_duration integer DEFAULT 5,
    difficulty_level text DEFAULT 'beginner'::text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    position_in_queue integer DEFAULT 1,
    is_completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- 6. Chat Sessions Table
CREATE TABLE public.chat_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title text DEFAULT 'New Chat',
    message_count integer DEFAULT 0,
    last_message_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 7. Chat Messages Table
CREATE TABLE public.chat_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    role text NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON public.user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_health_metrics
CREATE POLICY "Users can manage own health metrics" ON public.user_health_metrics
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_settings
CREATE POLICY "Users can manage own settings" ON public.user_settings
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_streaks
CREATE POLICY "Users can manage own streaks" ON public.user_streaks
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for lessons
CREATE POLICY "Users can manage own lessons" ON public.lessons
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for chat_sessions
CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can manage own chat messages" ON public.chat_messages
FOR ALL USING (auth.uid() = user_id);

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile
  INSERT INTO public.user_profiles (id, onboarding_completed, subscription_type)
  VALUES (NEW.id, false, 'explorer');
  
  -- Insert user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  -- Insert user streaks
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_profile();

-- Function to update streak
CREATE OR REPLACE FUNCTION public.update_user_streak(user_uuid uuid)
RETURNS void AS $$
DECLARE
  last_activity date;
  current_streak_val integer;
  streak_freeze boolean;
BEGIN
  -- Get current streak data
  SELECT last_activity_date, current_streak, streak_freeze_used
  INTO last_activity, current_streak_val, streak_freeze
  FROM public.user_streaks
  WHERE user_id = user_uuid;
  
  -- Update streak logic
  IF last_activity IS NULL OR last_activity < CURRENT_DATE THEN
    IF last_activity = CURRENT_DATE - 1 THEN
      -- Consecutive day, increment streak
      UPDATE public.user_streaks
      SET current_streak = current_streak + 1,
          last_activity_date = CURRENT_DATE,
          longest_streak = GREATEST(longest_streak, current_streak + 1),
          total_lessons_completed = total_lessons_completed + 1,
          zen_garden_points = zen_garden_points + 10,
          updated_at = now()
      WHERE user_id = user_uuid;
    ELSIF last_activity = CURRENT_DATE - 2 AND NOT streak_freeze THEN
      -- One day missed, use freeze
      UPDATE public.user_streaks
      SET current_streak = current_streak + 1,
          last_activity_date = CURRENT_DATE,
          streak_freeze_used = true,
          total_lessons_completed = total_lessons_completed + 1,
          zen_garden_points = zen_garden_points + 10,
          updated_at = now()
      WHERE user_id = user_uuid;
    ELSIF last_activity IS NULL THEN
      -- First lesson
      UPDATE public.user_streaks
      SET current_streak = 1,
          last_activity_date = CURRENT_DATE,
          longest_streak = 1,
          total_lessons_completed = 1,
          zen_garden_points = 10,
          updated_at = now()
      WHERE user_id = user_uuid;
    ELSE
      -- Reset streak
      UPDATE public.user_streaks
      SET current_streak = 1,
          last_activity_date = CURRENT_DATE,
          streak_freeze_used = false,
          total_lessons_completed = total_lessons_completed + 1,
          zen_garden_points = zen_garden_points + 10,
          updated_at = now()
      WHERE user_id = user_uuid;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;