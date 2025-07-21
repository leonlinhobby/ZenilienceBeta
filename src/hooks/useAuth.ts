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
        // Clear any corrupted session data
        localStorage.removeItem('supabase.auth.token');
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
          console.log('User signed in, checking profile...');
          // The database trigger should handle profile creation automatically
          // But let's verify it exists
          await verifyUserProfile(session.user);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing data...');
          // Clear any cached data
          localStorage.removeItem('supabase.auth.token');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const verifyUserProfile = async (user: User) => {
    try {
      console.log('Verifying profile for user:', user.id);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        return;
      }

      if (!profile) {
        console.log('Profile not found, creating...');
        // Profile should be created by trigger, but create manually if needed
        const { error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            onboarding_completed: false,
            subscription_type: 'explorer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          console.log('Profile created successfully');
        }
      } else {
        console.log('Profile exists');
      }

      // Verify settings exist
      const { data: settings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!settings) {
        console.log('Creating user settings...');
        await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            chat_personality: 'friendly',
            daily_lesson_limit: 1,
            notifications_enabled: true,
            theme: 'light'
          });
      }

      // Verify streaks exist
      const { data: streaks } = await supabase
        .from('user_streaks')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!streaks) {
        console.log('Creating user streaks...');
        await supabase
          .from('user_streaks')
          .insert({
            user_id: user.id,
            current_streak: 0,
            longest_streak: 0,
            zen_garden_points: 0,
            total_lessons_completed: 0,
            streak_freeze_used: false
          });
      }

      console.log('Profile verification completed');
    } catch (error) {
      console.error('Error verifying user profile:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log('Signup successful:', data.user?.id);
      return { data, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log('Signin successful:', data.user?.id);
      return { data, error: null };
    } catch (error: any) {
      console.error('Signin error:', error);
      
      // Handle specific auth errors
      if (error.message?.includes('Invalid Refresh Token') || error.message?.includes('refresh_token_not_found')) {
        console.log('Clearing corrupted session...');
        localStorage.removeItem('supabase.auth.token');
        await supabase.auth.signOut();
      }
      
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('supabase.auth.token');
      setSession(null);
      setUser(null);
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Signout error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
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