import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Ensure user profile exists when signing in
          await ensureUserProfile(session.user);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!existingProfile) {
        console.log('Creating user profile for:', user.id);
        
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            onboarding_completed: false,
            subscription_type: 'explorer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw profileError;
        }

        // Create user settings
        const { error: settingsError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            chat_personality: 'friendly',
            daily_lesson_limit: 1,
            notifications_enabled: true,
            theme: 'light'
          });

        if (settingsError) {
          console.error('Error creating settings:', settingsError);
        }

        // Create user streaks
        const { error: streakError } = await supabase
          .from('user_streaks')
          .insert({
            user_id: user.id,
            current_streak: 0,
            longest_streak: 0,
            zen_garden_points: 0,
            total_lessons_completed: 0,
            streak_freeze_used: false
          });

        if (streakError) {
          console.error('Error creating streak:', streakError);
        }

        console.log('User profile setup completed');
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Profile will be created in the auth state change handler
      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
};