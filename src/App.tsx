import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { HabitList } from './components/HabitList';
import { HabitForm } from './components/HabitForm';
import { Profile } from './components/Profile';
import { ContactUs } from './components/ContactUs';
import { Navigation } from './components/Navigation';
import { ProgressPage } from './components/ProgressPage';
import { Brain, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit, User } from './types';

// Mock AI insights (in a real app, these would come from an AI service)
const mockInsights = [
  "You're most consistent with your habits on weekdays. Consider setting weekend-specific reminders to maintain your streak.",
  "Your meditation habit has the longest current streak. This consistency might be helping with other habits too!",
  "You tend to complete habits more often in the morning. Try scheduling new habits during this productive time.",
  "Based on your patterns, you might find it easier to build new habits by linking them to existing ones."
];

export default function App() {
  const { user, loading, signOut, updateUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weeklyData, setWeeklyData] = useState<Array<{ name: string; completed: number }>>([]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [currentSection, setCurrentSection] = useState('home');

  useEffect(() => {
    if (!user) return;
    const savedHabits = localStorage.getItem(`habits_${user.id}`);
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, [user]);

  useEffect(() => {
    if (user && habits.length >= 0) {
      localStorage.setItem(`habits_${user.id}`, JSON.stringify(habits));
      updateWeeklyData(habits);
    }
  }, [habits, user]);

  const updateWeeklyData = (currentHabits: Habit[]) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = weekDays.map((name) => ({ name, completed: 0 }));
    
    currentHabits.forEach(habit => {
      if (habit.last_completed && new Date(habit.last_completed).getDay() === new Date().getDay()) {
        const today = new Date().getDay();
        data[today].completed++;
      }
    });

    setWeeklyData(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleAddHabit = (habitData: any) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      user_id: user.id,
      name: habitData.name,
      description: habitData.description,
      frequency: habitData.frequency,
      target: habitData.target,
      current_streak: 0,
      best_streak: 0,
      created_at: new Date().toISOString(),
      color: habitData.color,
      icon: habitData.icon
    };
    
    setHabits([...habits, newHabit]);
    setShowHabitForm(false);
  };

  const handleCompleteHabit = (habitId: string) => {
    const today = new Date().toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        // Check if already completed today
        if (habit.last_completed && new Date(habit.last_completed).toDateString() === today) {
          return habit; // Don't update if already completed today
        }
        
        const newStreak = habit.current_streak + 1;
        return {
          ...habit,
          current_streak: newStreak,
          best_streak: Math.max(newStreak, habit.best_streak),
          last_completed: new Date().toISOString()
        };
      }
      return habit;
    }));
  };

  const handleEditHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
    setEditingHabit(null);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    updateUser(updates);
    const userData = { ...user, ...updates };
    localStorage.setItem(`user_${user.email}`, JSON.stringify(userData));
  };

  const completedToday = habits.filter(habit => 
    habit.last_completed && new Date(habit.last_completed).toDateString() === new Date().toDateString()
  ).length;

  const longestStreak = Math.max(...habits.map(h => h.best_streak), 0);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <>
            <Dashboard
              totalHabits={habits.length}
              completionRate={Math.round((completedToday / Math.max(habits.length, 1)) * 100)}
              currentStreak={Math.max(...habits.map(h => h.current_streak), 0)}
              weeklyData={weeklyData}
            />
            <div className="mt-8">
              <HabitList
                habits={habits}
                onAddHabit={() => setShowHabitForm(true)}
                onCompleteHabit={handleCompleteHabit}
                onEditHabit={setEditingHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            </div>
          </>
        );
      case 'progress':
        return (
          <ProgressPage
            habits={habits}
            insights={mockInsights}
          />
        );
      case 'settings':
        return (
          <Profile
            user={user}
            onUpdateProfile={handleUpdateProfile}
            totalHabits={habits.length}
            completedToday={completedToday}
            longestStreak={longestStreak}
          />
        );
      case 'contact':
        return <ContactUs />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center relative">
            <div className="absolute left-0 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <UserIcon className="text-gray-600" size={20} />
              <span className="text-gray-700 font-medium">
                {user.name || user.email}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Brain className="text-white" size={28} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Smart Habit Tracker
              </h1>
            </div>

            <button
              onClick={signOut}
              className="absolute right-0 px-4 py-2 text-sm font-medium text-white bg-red-500/90 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <Navigation
        currentSection={currentSection}
        onNavigate={setCurrentSection}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderCurrentSection()}
          </motion.div>
        </AnimatePresence>

        {showHabitForm && (
          <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">Create New Habit</h2>
              <HabitForm
                onSubmit={handleAddHabit}
                onCancel={() => setShowHabitForm(false)}
              />
            </motion.div>
          </div>
        )}

        {editingHabit && (
          <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">Edit Habit</h2>
              <HabitForm
                initialValues={editingHabit}
                onSubmit={handleEditHabit}
                onCancel={() => setEditingHabit(null)}
              />
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}