'use client'

import { useState } from 'react';
import Chatbot from './chatbot';
import { MessageCircle, X, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* button */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 p-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 focus:outline-none"
          >
            <MessageCircle size={24} />
            <span className="font-medium">Need help?</span>
          </button>
        )}
      </div>

      {/* panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-16 right-4 bottom-4 w-85 bg-pink-10 border border-pink-100 rounded-2xl shadow-2xl flex flex-col z-50 max-h-[calc(100vh-4rem)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-pink-100 border-b border-pink-100 rounded-t-2xl">
              <span className="flex items-center gap-2 text-pink-600 font-bold">
                <Plane size={20} className="text-pink-600" />
                Chat with our virtual travel agent!
              </span>
              <button onClick={() => setIsOpen(false)} className="text-pink-600 hover:text-pink-600">
                <X size={20} />
              </button>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto p-2">
              <Chatbot />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}