import { Habit, HabitLog } from '../types';

// Local Storage Keys
const HABITS_KEY = 'habits';
const HABIT_LOGS_KEY = 'habit_logs';
const USER_KEY = 'user';

// User Management
export function saveUser(email: string) {
  const user = {
    id: crypto.randomUUID(),
    email,
    created_at: new Date().toISOString()
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

// Habit Management
export function getHabits(): Habit[] {
  const habits = localStorage.getItem(HABITS_KEY);
  return habits ? JSON.parse(habits) : [];
}

export function createHabit(habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'current_streak' | 'best_streak'>): Habit {
  const habits = getHabits();
  const user = getUser();
  
  const newHabit: Habit = {
    ...habit,
    id: crypto.randomUUID(),
    user_id: user?.id || '',
    created_at: new Date().toISOString(),
    current_streak: 0,
    best_streak: 0
  };
  
  habits.push(newHabit);
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  return newHabit;
}

export function updateHabit(id: string, updates: Partial<Habit>): Habit {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === id);
  
  if (index === -1) {
    throw new Error('Habit not found');
  }
  
  const updatedHabit = { ...habits[index], ...updates };
  habits[index] = updatedHabit;
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  return updatedHabit;
}

export function deleteHabit(id: string) {
  const habits = getHabits();
  const filteredHabits = habits.filter(h => h.id !== id);
  localStorage.setItem(HABITS_KEY, JSON.stringify(filteredHabits));
  
  // Also delete associated logs
  const logs = getHabitLogs();
  const filteredLogs = logs.filter(l => l.habit_id !== id);
  localStorage.setItem(HABIT_LOGS_KEY, JSON.stringify(filteredLogs));
}

// Habit Logs
export function getHabitLogs(): HabitLog[] {
  const logs = localStorage.getItem(HABIT_LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
}

export function logHabitCompletion(habitId: string, notes?: string): HabitLog {
  const logs = getHabitLogs();
  
  const newLog: HabitLog = {
    id: crypto.randomUUID(),
    habit_id: habitId,
    completed_at: new Date().toISOString(),
    notes
  };
  
  logs.push(newLog);
  localStorage.setItem(HABIT_LOGS_KEY, JSON.stringify(logs));
  
  // Update streaks
  updateStreaks(habitId);
  
  return newLog;
}

function updateStreaks(habitId: string) {
  const habits = getHabits();
  const logs = getHabitLogs().filter(l => l.habit_id === habitId);
  const habit = habits.find(h => h.id === habitId);
  
  if (!habit) return;
  
  // Sort logs by date
  logs.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  
  let currentStreak = 0;
  let bestStreak = habit.best_streak;
  
  if (logs.length > 0) {
    currentStreak = 1;
    for (let i = 1; i < logs.length; i++) {
      const curr = new Date(logs[i - 1].completed_at);
      const prev = new Date(logs[i].completed_at);
      const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }
  }
  
  updateHabit(habitId, { current_streak: currentStreak, best_streak: bestStreak });
}