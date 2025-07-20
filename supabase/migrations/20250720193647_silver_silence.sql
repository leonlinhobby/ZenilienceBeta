/*
  # Add Missing Tables for Complete Dashboard

  1. New Tables
    - `user_goals` - User goals and objectives
    - `user_progress` - Daily progress tracking
    - `daily_recommendations` - Daily AI recommendations

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- User Goals Table
CREATE TABLE IF NOT EXISTS public.user_goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    goal_type text NOT NULL,
    goal_description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    date date NOT NULL,
    completed_sessions integer DEFAULT 0,
    zen_garden_points integer DEFAULT 0,
    mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 10),
    stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Daily Recommendations Table
CREATE TABLE IF NOT EXISTS public.daily_recommendations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    recommendation_type text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own goals" ON public.user_goals
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON public.user_progress
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own recommendations" ON public.daily_recommendations
FOR ALL USING (auth.uid() = user_id);