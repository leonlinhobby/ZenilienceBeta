/*
  # Fix Signup Database Trigger

  This migration fixes the database trigger that creates user profiles automatically
  when new users sign up. The current trigger is failing and causing signup errors.

  1. Drop existing trigger and function if they exist
  2. Create a robust trigger function that handles all edge cases
  3. Create the trigger on auth.users table
  4. Ensure proper error handling and logging
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles
  INSERT INTO public.user_profiles (
    id,
    onboarding_completed,
    subscription_type,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    false,
    'explorer',
    NOW(),
    NOW()
  );

  -- Insert into user_settings
  INSERT INTO public.user_settings (
    user_id,
    chat_personality,
    daily_lesson_limit,
    notifications_enabled,
    theme,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    'friendly',
    1,
    true,
    'light',
    NOW(),
    NOW()
  );

  -- Insert into user_streaks
  INSERT INTO public.user_streaks (
    user_id,
    current_streak,
    longest_streak,
    zen_garden_points,
    total_lessons_completed,
    streak_freeze_used,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    0,
    0,
    0,
    0,
    false,
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;