'use client'

import { useState } from 'react';
import Chatbot from './chatbot';
import { MessageCircle, X, Plane, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse opacity-75"></div>
            
            {/* Content */}
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <MessageCircle size={22} className="text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                />
              </div>
              <span className="font-semibold text-sm">Chat with AI Assistant</span>
              <Sparkles size={16} className="text-yellow-300 group-hover:animate-spin transition-all duration-300" />
            </div>
          </motion.button>
        )}
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="fixed top-4 right-6 bottom-6 w-96 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl flex flex-col z-50 max-h-[calc(100vh-2rem)] overflow-hidden"
          >
            {/* Modern Header */}
            <div className="relative flex items-center justify-between p-4 bg-blue-600 text-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              
              {/* Content */}
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Plane size={20} className="text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Travel Assistant</h3>
                  <p className="text-blue-100 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online • Ready to help
                  </p>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)} 
                className="relative w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-200"
              >
                <X size={18} className="text-white" />
              </motion.button>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
              <div className="h-full overflow-y-auto p-4">
                <Chatbot />
              </div>
            </div>

            {/* Subtle bottom border for aesthetics */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}