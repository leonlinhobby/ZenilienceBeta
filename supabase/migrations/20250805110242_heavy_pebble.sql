/*
  # Create Demo Account with Sample Data

  1. Demo User Setup
    - Create demo user profile with sample data
    - Set up user settings, streaks, and goals
    - Add sample lessons and chat sessions
    
  2. Sample Data
    - Health metrics history
    - Completed lessons
    - Chat messages
    - Progress tracking
*/

-- Create demo user profile (this will be created automatically by the trigger when user signs up)
-- But we'll insert the profile data manually for the demo

-- First, let's create the demo user data that would be created after signup
DO $$
DECLARE
    demo_user_id uuid := 'demo-user-id-12345678-1234-1234-1234-123456789012'::uuid;
BEGIN
    -- Insert demo user profile
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
        demo_user_id,
        'Demo User',
        28,
        'prefer_not_to_say',
        'Software Developer',
        ARRAY['Meditation', 'Technology', 'Reading', 'Nature'],
        true,
        'zenith',
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        occupation = EXCLUDED.occupation,
        interests = EXCLUDED.interests,
        onboarding_completed = EXCLUDED.onboarding_completed,
        subscription_type = EXCLUDED.subscription_type,
        updated_at = now();

    -- Insert user settings
    INSERT INTO user_settings (
        user_id,
        chat_personality,
        daily_lesson_limit,
        notifications_enabled,
        theme,
        created_at,
        updated_at
    ) VALUES (
        demo_user_id,
        'friendly',
        5,
        true,
        'light',
        now(),
        now()
    ) ON CONFLICT (user_id) DO UPDATE SET
        chat_personality = EXCLUDED.chat_personality,
        daily_lesson_limit = EXCLUDED.daily_lesson_limit,
        notifications_enabled = EXCLUDED.notifications_enabled,
        theme = EXCLUDED.theme,
        updated_at = now();

    -- Insert user streaks
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
        demo_user_id,
        7,
        12,
        CURRENT_DATE,
        false,
        150,
        15,
        now(),
        now()
    ) ON CONFLICT (user_id) DO UPDATE SET
        current_streak = EXCLUDED.current_streak,
        longest_streak = EXCLUDED.longest_streak,
        last_activity_date = EXCLUDED.last_activity_date,
        streak_freeze_used = EXCLUDED.streak_freeze_used,
        zen_garden_points = EXCLUDED.zen_garden_points,
        total_lessons_completed = EXCLUDED.total_lessons_completed,
        updated_at = now();

    -- Insert sample goals
    INSERT INTO user_goals (
        user_id,
        goal_type,
        goal_description,
        is_active,
        created_at,
        updated_at
    ) VALUES 
        (demo_user_id, 'stress-reduction', 'Reduce daily stress and anxiety levels', true, now(), now()),
        (demo_user_id, 'mindfulness', 'Increase present-moment awareness', true, now(), now()),
        (demo_user_id, 'sleep-improvement', 'Improve sleep quality and duration', true, now(), now())
    ON CONFLICT DO NOTHING;

    -- Insert sample health metrics (last 7 days)
    INSERT INTO user_health_metrics (
        user_id,
        stress_level,
        mood_score,
        sleep_quality,
        focus_level,
        anxiety_level,
        energy_level,
        recorded_at,
        created_at
    ) VALUES 
        (demo_user_id, 3, 8, 7, 8, 2, 7, now() - interval '6 days', now() - interval '6 days'),
        (demo_user_id, 4, 7, 6, 7, 3, 6, now() - interval '5 days', now() - interval '5 days'),
        (demo_user_id, 2, 9, 8, 9, 1, 8, now() - interval '4 days', now() - interval '4 days'),
        (demo_user_id, 3, 8, 7, 8, 2, 7, now() - interval '3 days', now() - interval '3 days'),
        (demo_user_id, 2, 9, 9, 9, 1, 9, now() - interval '2 days', now() - interval '2 days'),
        (demo_user_id, 1, 9, 8, 9, 1, 8, now() - interval '1 day', now() - interval '1 day'),
        (demo_user_id, 2, 8, 8, 8, 1, 8, now(), now())
    ON CONFLICT DO NOTHING;

    -- Insert sample progress (last 7 days)
    INSERT INTO user_progress (
        user_id,
        date,
        completed_sessions,
        zen_garden_points,
        mood_rating,
        stress_level,
        created_at,
        updated_at
    ) VALUES 
        (demo_user_id, CURRENT_DATE - 6, 2, 20, 8, 3, now() - interval '6 days', now() - interval '6 days'),
        (demo_user_id, CURRENT_DATE - 5, 1, 10, 7, 4, now() - interval '5 days', now() - interval '5 days'),
        (demo_user_id, CURRENT_DATE - 4, 3, 30, 9, 2, now() - interval '4 days', now() - interval '4 days'),
        (demo_user_id, CURRENT_DATE - 3, 2, 20, 8, 3, now() - interval '3 days', now() - interval '3 days'),
        (demo_user_id, CURRENT_DATE - 2, 2, 20, 9, 2, now() - interval '2 days', now() - interval '2 days'),
        (demo_user_id, CURRENT_DATE - 1, 1, 10, 9, 1, now() - interval '1 day', now() - interval '1 day'),
        (demo_user_id, CURRENT_DATE, 1, 10, 8, 2, now(), now())
    ON CONFLICT (user_id, date) DO UPDATE SET
        completed_sessions = EXCLUDED.completed_sessions,
        zen_garden_points = EXCLUDED.zen_garden_points,
        mood_rating = EXCLUDED.mood_rating,
        stress_level = EXCLUDED.stress_level,
        updated_at = now();

    -- Insert sample lessons
    INSERT INTO lessons (
        user_id,
        title,
        description,
        lesson_type,
        content,
        estimated_duration,
        difficulty_level,
        position_in_queue,
        is_completed,
        completed_at,
        created_at
    ) VALUES 
        (demo_user_id, 'Morning Meditation', 'Start your day with mindful breathing', 'meditation', 
         '{"instruction": "Find a quiet place and focus on your breath", "steps": ["Sit comfortably", "Close your eyes", "Breathe naturally", "Focus on breath"], "duration": 5, "tips": ["Don''t judge wandering thoughts", "Return gently to breath"]}', 
         5, 'beginner', 1, true, now() - interval '1 day', now() - interval '2 days'),
        (demo_user_id, 'Stress Relief Breathing', 'Quick technique for immediate calm', 'breathing',
         '{"instruction": "Use 4-7-8 breathing pattern", "steps": ["Inhale for 4", "Hold for 7", "Exhale for 8", "Repeat 4 times"], "duration": 5, "tips": ["Go at your own pace", "Stop if dizzy"]}',
         5, 'beginner', 2, true, now() - interval '2 hours', now() - interval '1 day'),
        (demo_user_id, 'Thought Challenge', 'Examine negative thought patterns', 'cbt',
         '{"instruction": "Identify and challenge a negative thought", "steps": ["Write the thought", "Find evidence against it", "Create balanced thought"], "duration": 10, "tips": ["Be patient", "Look for patterns"]}',
         10, 'intermediate', 3, false, null, now() - interval '1 day'),
        (demo_user_id, 'Mindful Walking', 'Present moment awareness through movement', 'mindfulness',
         '{"instruction": "Walk slowly and mindfully", "steps": ["Feel each step", "Notice surroundings", "Return when mind wanders"], "duration": 15, "tips": ["No destination needed", "Focus on sensations"]}',
         15, 'beginner', 4, false, null, now() - interval '1 day')
    ON CONFLICT DO NOTHING;

    -- Insert sample chat session
    INSERT INTO chat_sessions (
        user_id,
        title,
        message_count,
        last_message_at,
        created_at,
        updated_at
    ) VALUES (
        demo_user_id,
        'Getting Started with Wellness',
        6,
        now() - interval '1 hour',
        now() - interval '2 days',
        now() - interval '1 hour'
    ) ON CONFLICT DO NOTHING;

    -- Get the chat session ID for messages
    DECLARE
        session_id uuid;
    BEGIN
        SELECT id INTO session_id FROM chat_sessions WHERE user_id = demo_user_id LIMIT 1;
        
        -- Insert sample chat messages
        INSERT INTO chat_messages (
            session_id,
            user_id,
            content,
            role,
            created_at
        ) VALUES 
            (session_id, demo_user_id, 'Hi Zeno! I''m new to meditation and feeling a bit overwhelmed with stress lately.', 'user', now() - interval '2 days'),
            (session_id, demo_user_id, 'Hello! I''m so glad you''re here. It''s completely normal to feel overwhelmed, and you''ve taken a wonderful first step by reaching out. Meditation can be incredibly helpful for stress. Would you like to start with a simple 5-minute breathing exercise?', 'assistant', now() - interval '2 days' + interval '30 seconds'),
            (session_id, demo_user_id, 'That sounds perfect. I''ve never done meditation before though.', 'user', now() - interval '2 days' + interval '1 minute'),
            (session_id, demo_user_id, 'No worries at all! Everyone starts somewhere. The beauty of meditation is that there''s no "perfect" way to do it. I''ll guide you through a gentle breathing exercise that''s perfect for beginners. Just find a comfortable place to sit.', 'assistant', now() - interval '2 days' + interval '90 seconds'),
            (session_id, demo_user_id, 'I just completed my first meditation session! I feel much calmer.', 'user', now() - interval '1 hour' + interval '30 minutes'),
            (session_id, demo_user_id, 'That''s wonderful! I''m so proud of you for completing your first session. That sense of calm you''re feeling is your nervous system naturally relaxing. How are you feeling about continuing with daily practice?', 'assistant', now() - interval '1 hour')
        ON CONFLICT DO NOTHING;
    END;

    -- Insert daily recommendation
    INSERT INTO daily_recommendations (
        user_id,
        recommendation_type,
        title,
        description,
        date,
        completed,
        created_at
    ) VALUES (
        demo_user_id,
        'mindfulness',
        'Mindful Moment',
        'Take 3 deep breaths and notice 5 things you can see around you right now.',
        CURRENT_DATE,
        false,
        now()
    ) ON CONFLICT (user_id, date) DO UPDATE SET
        recommendation_type = EXCLUDED.recommendation_type,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        completed = EXCLUDED.completed;

END $$;