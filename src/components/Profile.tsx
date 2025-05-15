import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Clock, Save } from 'lucide-react';
import type { User as UserType } from '../types';
import { format } from 'date-fns';

interface ProfileProps {
  user: UserType;
  onUpdateProfile: (updates: Partial<UserType>) => void;
  totalHabits: number;
  completedToday: number;
  longestStreak: number;
}

export function Profile({ user, onUpdateProfile, totalHabits, completedToday, longestStreak }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    notification_preferences: user.notification_preferences || { email: true, push: false }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name || 'Anonymous User'}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-400">Member since {format(new Date(user.created_at), 'MMMM d, yyyy')}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          <Settings size={20} />
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Habits</h3>
          <p className="text-3xl font-bold text-blue-600">{totalHabits}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Completed Today</h3>
          <p className="text-3xl font-bold text-green-600">{completedToday}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Longest Streak</h3>
          <p className="text-3xl font-bold text-purple-600">{longestStreak} days</p>
        </div>
      </div>

      {isEditing ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Intl.supportedValuesOf('timeZone').map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bell size={16} className="inline mr-2" />
                Notifications
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notification_preferences.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences,
                        email: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notification_preferences.push}
                    onChange={(e) => setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences,
                        push: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Push notifications</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save size={20} />
              Save Changes
            </motion.button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose max-w-none"
        >
          {user.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} />
              <span>Timezone: {formData.timezone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Bell size={16} />
              <span>
                Notifications: {Object.entries(formData.notification_preferences)
                  .filter(([, enabled]) => enabled)
                  .map(([type]) => type)
                  .join(', ') || 'None enabled'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}