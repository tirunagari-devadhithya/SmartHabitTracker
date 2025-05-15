import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Target, Trophy, TrendingUp } from 'lucide-react';

interface DashboardProps {
  totalHabits: number;
  completionRate: number;
  currentStreak: number;
  weeklyData: Array<{ name: string; completed: number }>;
}

export function Dashboard({ totalHabits, completionRate, currentStreak, weeklyData }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Target className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Habits</p>
            <p className="text-2xl font-bold">{totalHabits}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-2xl font-bold">{completionRate}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Trophy className="text-orange-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="text-2xl font-bold">{currentStreak} days</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Calendar className="text-purple-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Week Progress</p>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <Bar dataKey="completed" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}