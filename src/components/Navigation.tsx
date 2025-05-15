import React from 'react';
import { ListTodo, BarChart2, Settings, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export function Navigation({ currentSection, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', icon: ListTodo, label: 'Habits' },
    { id: 'progress', icon: BarChart2, label: 'Progress' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'contact', icon: MessageCircle, label: 'Coach' }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-[72px] z-30">
      <div className="max-w-7xl mx-auto">
        <ul className="flex items-center">
          {navItems.map(({ id, icon: Icon, label }) => (
            <li key={id} className="flex-1">
              <button
                onClick={() => onNavigate(id)}
                className="relative w-full group py-4"
              >
                <div className="flex flex-col items-center">
                  <Icon
                    className={`transition-colors ${
                      currentSection === id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'
                    }`}
                    size={24}
                  />
                  <span className={`text-sm mt-1 font-medium transition-colors ${
                    currentSection === id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'
                  }`}>
                    {label}
                  </span>
                  {currentSection === id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}