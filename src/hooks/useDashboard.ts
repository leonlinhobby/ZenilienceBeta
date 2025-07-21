import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { checkAndGenerateLessons } from '../services/lessonService';
import { 
  UserHealthMetrics, 
  UserSettings, 
  UserStreaks, 
  Lesson, 
  ChatSession, 
  ChatMessage 
} from '../types/dashboard';

export const useDashboard = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [streaks, setStreaks] = useState<UserStreaks | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      checkAndGenerateLessons(user.id);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!settingsData) {
        // No settings found, create default settings
        const { data: newSettings } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            chat_personality: 'friendly',
            daily_lesson_limit: 1,
            notifications_enabled: true,
            theme: 'light'
          })
          .select()
          .maybeSingle();
        setSettings(newSettings);
      } else {
        setSettings(settingsData);
      }

      // Fetch user streaks
      const { data: streaksData, error: streaksError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!streaksData) {
        // No streaks found, create default streak record
        const { data: newStreaks } = await supabase
          .from('user_streaks')
          .insert({
            user_id: user.id,
            current_streak: 0,
            longest_streak: 0,
            zen_garden_points: 0,
            total_lessons_completed: 0,
            streak_freeze_used: false
          })
          .select()
          .maybeSingle();
        setStreaks(newStreaks);
      } else {
        setStreaks(streaksData);
      }

      // Fetch lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('position_in_queue', { ascending: true })
        .limit(5);

      setLessons(lessonsData || []);

      // Fetch chat sessions
      const { data: sessionsData } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false })
        .limit(10);

      setChatSessions(sessionsData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const recordHealthMetrics = async (metrics: Partial<UserHealthMetrics>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_health_metrics')
        .insert({
          user_id: user.id,
          ...metrics
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording health metrics:', error);
    }
  };

  const completeLesson = async (lessonId: string) => {
    if (!user) return;

    try {
      // Mark lesson as completed
      const { error: lessonError } = await supabase
        .from('lessons')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', lessonId)
        .eq('user_id', user.id);

      if (lessonError) throw lessonError;

      // Update user streak
      await supabase.rpc('update_user_streak', { user_uuid: user.id });

      // Refresh data
      await fetchDashboardData();
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const createChatSession = async (title: string = 'New Chat') => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title
        })
        .select()
        .single();

      if (error) throw error;
      
      setChatSessions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
  };

  const addChatMessage = async (sessionId: string, content: string, role: 'user' | 'assistant') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          content,
          role
        });

      if (error) throw error;

      // Update session last message time
      await supabase
        .from('chat_sessions')
        .update({
          last_message_at: new Date().toISOString(),
          message_count: supabase.rpc('increment', { x: 1 })
        })
        .eq('id', sessionId);

    } catch (error) {
      console.error('Error adding chat message:', error);
    }
  };

  const getChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  };

  return {
    settings,
    streaks,
    lessons,
    chatSessions,
    loading,
    updateSettings,
    recordHealthMetrics,
    completeLesson,
    createChatSession,
    addChatMessage,
    getChatMessages,
    fetchDashboardData
  };
};