import { supabase } from './supabase';
import type { Habit } from '../types';

export async function createHabit(habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'current_streak' | 'best_streak'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('habits')
    .insert([{
      ...habit,
      user_id: user.id,
      current_streak: 0,
      best_streak: 0
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getHabits() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function updateHabit(id: string, updates: Partial<Habit>) {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteHabit(id: string) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function completeHabit(habitId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  // Log completion
  const { error: logError } = await supabase
    .from('habit_logs')
    .insert([{
      habit_id: habitId,
      completed_at: new Date().toISOString()
    }]);
  
  if (logError) throw logError;

  // Get current streaks
  const { data: habit, error: habitError } = await supabase
    .from('habits')
    .select('current_streak, best_streak')
    .eq('id', habitId)
    .single();
  
  if (habitError) throw habitError;

  // Update streaks
  const newStreak = habit.current_streak + 1;
  const newBestStreak = Math.max(habit.best_streak, newStreak);

  const { error: updateError } = await supabase
    .from('habits')
    .update({
      current_streak: newStreak,
      best_streak: newBestStreak
    })
    .eq('id', habitId);
  
  if (updateError) throw updateError;

  return { currentStreak: newStreak, bestStreak: newBestStreak };
}