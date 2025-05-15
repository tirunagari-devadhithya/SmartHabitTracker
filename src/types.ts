export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  current_streak: number;
  best_streak: number;
  created_at: string;
  user_id: string;
  color: string;
  icon: string;
  last_completed?: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  timezone?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
  };
}