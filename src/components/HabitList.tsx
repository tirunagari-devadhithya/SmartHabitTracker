import React from 'react';
import { HabitCard } from './HabitCard';
import { Habit } from '../types';
import { Plus } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onAddHabit: () => void;
  onCompleteHabit: (habitId: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

export function HabitList({ habits, onAddHabit, onCompleteHabit, onEditHabit, onDeleteHabit }: HabitListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Habits</h2>
        <button
          onClick={onAddHabit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Habit
        </button>
      </div>
      
      {habits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Welcome to Smart Habit Tracker!</h3>
          <p className="mt-2 text-gray-600">Get started by adding your first habit using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={() => onCompleteHabit(habit.id)}
              onEdit={() => onEditHabit(habit)}
              onDelete={() => onDeleteHabit(habit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}