import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Flame, MoreVertical, Target, Trophy, Trash2, Check, Lock } from 'lucide-react';
import { Habit } from '../types';
import { format, isToday, parseISO } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitCard({ habit, onComplete, onEdit, onDelete }: HabitCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isCompletedToday = habit.last_completed ? isToday(parseISO(habit.last_completed)) : false;

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleComplete = () => {
    if (!isCompletedToday) {
      onComplete();
    }
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: habit.color + '20' }}
          >
            <span className="text-2xl" style={{ color: habit.color }}>{habit.icon}</span>
          </motion.div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{habit.name}</h3>
            <p className="text-sm text-gray-500">{habit.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreVertical size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className={`text-red-400 hover:text-red-600 ${showDeleteConfirm ? 'animate-pulse' : ''}`}
            title={showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete habit'}
          >
            <Trash2 size={20} />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <Flame className="text-orange-500" size={18} />
          <div>
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="font-semibold">{habit.current_streak} days</p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <Trophy className="text-yellow-500" size={18} />
          <div>
            <p className="text-sm text-gray-500">Best Streak</p>
            <p className="font-semibold">{habit.best_streak} days</p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <Target className="text-blue-500" size={18} />
          <div>
            <p className="text-sm text-gray-500">Target</p>
            <p className="font-semibold">{habit.target} times</p>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>Started {format(new Date(habit.created_at), 'MMM d, yyyy')}</span>
        </div>
        {isCompletedToday ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <Check size={20} />
            <span>Completed Today</span>
            <Lock size={16} className="ml-1" />
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            Complete Today
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">Click the delete button again to confirm deletion</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}