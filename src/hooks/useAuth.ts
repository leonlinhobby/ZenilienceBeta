import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with error handling
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        // Clear any invalid session data
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED' && !session) {
          // Handle refresh token failure
          console.log('Token refresh failed, signing out');
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      return { data, error: authError };
    }
    
    // If signup successful, create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          onboarding_completed: false,
          subscription_type: 'explorer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // If profile creation fails, sign out the user to prevent orphaned auth records
        await supabase.auth.signOut();
        return { data: null, error: profileError };
      }
      
      // Create default user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert({
          user_id: data.user.id,
          chat_personality: 'friendly',
          daily_lesson_limit: 1,
          notifications_enabled: true,
          theme: 'light'
        });
      
      if (settingsError) {
        console.error('Error creating user settings:', settingsError);
        await supabase.auth.signOut();
        return { data: null, error: settingsError };
      }
      
      // Create default user streak
      const { error: streakError } = await supabase
        .from('user_streaks')
        .insert({
          user_id: data.user.id,
          current_streak: 0,
          longest_streak: 0,
          zen_garden_points: 0,
          total_lessons_completed: 0,
          streak_freeze_used: false
        });
      
      if (streakError) {
        console.error('Error creating user streak:', streakError);
        await supabase.auth.signOut();
        return { data: null, error: streakError };
      }
    }
    
    return { data, error: authError };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    // Clear local state first
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