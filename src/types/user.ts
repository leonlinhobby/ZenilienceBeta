export interface UserProfile {
  id: string;
  full_name?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  interests?: string[];
  onboarding_completed: boolean;
  subscription_type: 'explorer' | 'zenith';
  created_at: string;
  updated_at: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: string;
  goal_description?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  date: string;
  completed_sessions: number;
  stress_level?: number;
  mood_score?: number;
  zen_garden_points: number;
  current_streak: number;
  created_at: string;
}

export interface DailyRecommendation {
  id: string;
  user_id: string;
  date: string;
  recommendation_type: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}