import React, { useState } from 'react';
import { MessageCircle, Send, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

const coachResponses = {
  greeting: [
    "Hello! I'm your habit coach. How can I help you today?",
    "Welcome! I'm here to help you build better habits. What's on your mind?",
    "Hi there! Ready to work on your habits? Let me know what you'd like to discuss."
  ],
  motivation: [
    "Remember, small steps lead to big changes. Keep going!",
    "You're doing great! Consistency is key to forming lasting habits.",
    "Every habit streak starts with a single day. You've got this!"
  ],
  tips: [
    "Try linking new habits to existing ones - this is called habit stacking.",
    "Make your habits obvious, attractive, easy, and satisfying.",
    "Start with a habit so small you can't say no to it.",
    "Track your progress - what gets measured gets managed.",
    "Design your environment to support your habits."
  ]
};

export function ContactUs() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: coachResponses.greeting[Math.floor(Math.random() * coachResponses.greeting.length)],
      sender: 'coach',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI coach thinking and response
    setTimeout(() => {
      let response: string;
      if (newMessage.toLowerCase().includes('motivat')) {
        response = coachResponses.motivation[Math.floor(Math.random() * coachResponses.motivation.length)];
      } else {
        response = coachResponses.tips[Math.floor(Math.random() * coachResponses.tips.length)];
      }

      const coachMessage: Message = {
        id: crypto.randomUUID(),
        text: response,
        sender: 'coach',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-sm p-8 h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Bot className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Habit Coach</h2>
          <p className="text-gray-600">Get personalized advice and motivation</p>
        </div>
      </div>

      <div className="h-[calc(100%-8rem)] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-gray-500"
            >
              <Bot size={20} />
              <span className="text-sm">Coach is typing...</span>
              <Sparkles className="animate-pulse" size={16} />
            </motion.div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask your coach for advice..."
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}