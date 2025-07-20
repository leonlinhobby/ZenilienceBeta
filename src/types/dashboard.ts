export interface UserHealthMetrics {
  id: string;
  user_id: string;
  stress_level?: number;
  mood_score?: number;
  sleep_quality?: number;
  focus_level?: number;
  anxiety_level?: number;
  energy_level?: number;
  recorded_at: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  chat_personality: 'friendly' | 'professional';
  daily_lesson_limit: number;
  notifications_enabled: boolean;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface UserStreaks {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  streak_freeze_used: boolean;
  zen_garden_points: number;
  total_lessons_completed: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  lesson_type: 'meditation' | 'breathing' | 'cbt' | 'mindfulness' | 'challenge' | 'education';
  content: any;
  estimated_duration: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  position_in_queue: number;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  message_count: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export type NavigationPage = 'dashboard' | 'zen-garden' | 'analytics' | 'chat' | 'profile';