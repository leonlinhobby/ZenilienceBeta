import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, UserGoal, UserProgress, DailyRecommendation } from '../types/user';
import { useAuth } from './useAuth';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [dailyRecommendation, setDailyRecommendation] = useState<DailyRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserGoals();
      fetchUserProgress();
      fetchDailyRecommendation();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          setProfile(null);
        }
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching goals:', error);
        return;
      }

      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching progress:', error);
        return;
      } else if (error && error.code === 'PGRST116') {
        setProgress(null);
      }

      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchDailyRecommendation = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching recommendation:', error);
        return;
      }

      if (!data) {
        // Create daily recommendation if none exists
        await createDailyRecommendation();
      } else {
        setDailyRecommendation(data);
      }
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    }
  };

  const createDailyRecommendation = async () => {
    if (!user) return;

    const recommendations = [
      {
        type: 'meditation',
        title: 'Morning Mindfulness',
        description: 'Start your day with a 5-minute guided meditation to center yourself.'
      },
      {
        type: 'cbt',
        title: 'Thought Challenge',
        description: 'Practice identifying and reframing negative thought patterns.'
      },
      {
        type: 'breathing',
        title: 'Box Breathing',
        description: 'Use the 4-4-4-4 breathing technique to reduce stress and anxiety.'
      },
      {
        type: 'gratitude',
        title: 'Gratitude Practice',
        description: 'Write down three things you\'re grateful for today.'
      }
    ];

    const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)];

    try {
      const { data, error } = await supabase
        .from('daily_recommendations')
        .insert({
          user_id: user.id,
          recommendation_type: randomRec.type,
          title: randomRec.title,
          description: randomRec.description,
          date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating recommendation:', error);
        return;
      }

      setDailyRecommendation(data);
    } catch (error) {
      console.error('Error creating recommendation:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addGoal = async (goalType: string, goalDescription?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          goal_type: goalType,
          goal_description: goalDescription
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding goal:', error);
        return;
      }

      setGoals(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          date: today,
          ...updates
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        return;
      }

      setProgress(data);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const completeRecommendation = async () => {
    if (!user || !dailyRecommendation) return;

    try {
      const { data, error } = await supabase
        .from('daily_recommendations')
        .update({ completed: true })
        .eq('id', dailyRecommendation.id)
        .select()
        .single();

      if (error) {
        console.error('Error completing recommendation:', error);
        return;
      }

      setDailyRecommendation(data);
      
      // Update progress
      await updateProgress({
        completed_sessions: (progress?.completed_sessions || 0) + 1,
        zen_garden_points: (progress?.zen_garden_points || 0) + 10
      });
    } catch (error) {
      console.error('Error completing recommendation:', error);
    }
  };

  return {
    profile,
    goals,
    progress,
    dailyRecommendation,
    loading,
    updateProfile,
    addGoal,
    updateProgress,
    completeRecommendation
  };
};