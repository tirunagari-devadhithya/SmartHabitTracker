import React, { useState } from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface HabitFormProps {
  onSubmit: (habit: {
    name: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    target: number;
    startDate: string;
    preferredTime: string;
    color: string;
    icon: string;
  }) => void;
  onCancel: () => void;
  initialValues?: {
    name: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    target: number;
    startDate: string;
    preferredTime: string;
    color: string;
    icon: string;
  };
}

const habitIcons = [
  { icon: "✨", label: "Sparkles" },
  { icon: "🏃", label: "Running" },
  { icon: "📚", label: "Reading" },
  { icon: "💪", label: "Exercise" },
  { icon: "🧘", label: "Meditation" },
  { icon: "🥗", label: "Healthy Food" },
  { icon: "💧", label: "Water" },
  { icon: "😴", label: "Sleep" },
  { icon: "🎨", label: "Art" },
  { icon: "🎵", label: "Music" },
  { icon: "🌱", label: "Growth" },
  { icon: "🧠", label: "Learning" },
  { icon: "💻", label: "Coding" },
  { icon: "📝", label: "Writing" },
  { icon: "🎯", label: "Focus" },
  { icon: "⚡", label: "Energy" },
  { icon: "🌟", label: "Success" },
  { icon: "🔥", label: "Motivation" },
  { icon: "🌿", label: "Nature" },
  { icon: "🎮", label: "Gaming" }
];

export function HabitForm({ onSubmit, onCancel, initialValues }: HabitFormProps) {
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    frequency: initialValues?.frequency || 'daily',
    target: initialValues?.target || 1,
    startDate: initialValues?.startDate || format(new Date(), 'yyyy-MM-dd'),
    preferredTime: initialValues?.preferredTime || '09:00',
    color: initialValues?.color || '#4F46E5',
    icon: initialValues?.icon || '✨'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Habit Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Frequency
        </label>
        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Target (times per {formData.frequency.slice(0, -2)})
        </label>
        <input
          type="number"
          min="1"
          required
          value={formData.target}
          onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          required
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Time
        </label>
        <div className="relative">
          <input
            type="time"
            required
            value={formData.preferredTime}
            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm pl-10"
          />
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <input
          type="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="mt-1 block w-full h-10 rounded-md cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Icon
        </label>
        <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 bg-white/50 backdrop-blur-sm rounded-lg">
          {habitIcons.map(({ icon, label }) => (
            <button
              key={icon}
              type="button"
              onClick={() => setFormData({ ...formData, icon })}
              className={`p-2 rounded-lg text-2xl transition-all ${
                formData.icon === icon 
                  ? 'bg-blue-100 ring-2 ring-blue-500' 
                  : 'hover:bg-gray-100'
              }`}
              title={label}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600/90 backdrop-blur-sm border border-transparent rounded-md hover:bg-blue-700"
        >
          {initialValues ? 'Update Habit' : 'Create Habit'}
        </button>
      </div>
    </form>
  );
}