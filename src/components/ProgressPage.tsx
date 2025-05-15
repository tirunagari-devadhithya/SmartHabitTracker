import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { Habit } from '../types';
import { Lightbulb, Calendar, Award, TrendingUp } from 'lucide-react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface ProgressPageProps {
  habits: Habit[];
  insights: string[];
}

export function ProgressPage({ habits, insights }: ProgressPageProps) {
  // Generate last 30 days of data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      completed: habits.filter(habit => 
        habit.last_completed && format(new Date(habit.last_completed), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ).length
    };
  }).reverse();

  // Calculate completion rate
  const totalCompletions = last30Days.reduce((sum, day) => sum + day.completed, 0);
  const completionRate = Math.round((totalCompletions / (habits.length * 30)) * 100);

  // Get the best streak across all habits
  const bestStreak = Math.max(...habits.map(h => h.best_streak));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Best Streak</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{bestStreak} days</p>
          <p className="text-sm text-gray-500 mt-1">Keep it up!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Active Days</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {last30Days.filter(day => day.completed > 0).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Out of last 30 days</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MMM d')}
                interval={6}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                formatter={(value) => [`${value} habits`, 'Completed']}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#4F46E5" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Calendar</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <CalendarHeatmap
              startDate={subDays(new Date(), 365)}
              endDate={new Date()}
              values={last30Days.map(day => ({
                date: day.date,
                count: day.completed
              }))}
              classForValue={(value) => {
                if (!value || value.count === 0) return 'color-empty';
                return `color-scale-${Math.min(value.count, 4)}`;
              }}
              titleForValue={(value) => {
                if (!value) return 'No data';
                return `${format(new Date(value.date), 'MMM d, yyyy')}: ${value.count} habits completed`;
              }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Lightbulb className="text-yellow-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-4 bg-yellow-50/50 backdrop-blur-sm rounded-lg border border-yellow-100"
            >
              <p className="text-gray-700">{insight}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}