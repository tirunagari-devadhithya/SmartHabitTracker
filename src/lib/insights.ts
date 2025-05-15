import { getHabits, getHabitLogs } from './storage';

export async function getInsights(habitId?: string) {
  // Implement local insights storage if needed
  return [];
}

export async function generateInsight(habitId: string) {
  const habits = getHabits();
  const logs = getHabitLogs();
  
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return null;
  
  const habitLogs = logs.filter(l => l.habit_id === habitId);
  
  // Calculate completion rate for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentLogs = habitLogs.filter(log => 
    new Date(log.completed_at) >= thirtyDaysAgo
  );
  
  const completionRate = (recentLogs.length / 30) * 100;
  
  // Generate simple insight based on completion rate
  let insightContent = '';
  if (completionRate >= 80) {
    insightContent = `Great job maintaining ${habit.name}! You've been very consistent. Consider increasing your target or adding a related habit.`;
  } else if (completionRate >= 50) {
    insightContent = `You're making good progress with ${habit.name}. Try to identify what helps you succeed and apply it on harder days.`;
  } else {
    insightContent = `It seems ${habit.name} has been challenging. Consider adjusting your target or scheduling it at a different time.`;
  }
  
  return {
    id: crypto.randomUUID(),
    habit_id: habitId,
    insight_type: 'completion_analysis',
    content: insightContent,
    created_at: new Date().toISOString()
  };
}