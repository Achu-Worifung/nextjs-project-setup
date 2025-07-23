'use client'

import { useState, useRef, useEffect } from "react";
import ChatInput from "./chatinput"; 
import { apiHelpers, API_ENDPOINTS } from '../../lib/api-config'; 

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.3;
    utterance.pitch = 1.4;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("chatbotGreeted")) {
      const greeting = "Hello there! How can I assist you with your travel plans today?";
      setMessages([{ role: "assistant", content: greeting }]);
      speak(greeting);
      sessionStorage.setItem("chatbotGreeted", "true");
    }
  }, []);

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const systemMessage = {
      role: "system",
      content:
        "You are a friendly travel agent. Help me make travel plans by recommending hotels, flights, and cars.",
    };

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [systemMessage, ...messages, userMessage] }),
    });

    const data = await res.json();
    const botContent = data.error ?? data.message;
    const botMessage = { role: "assistant", content: botContent };

    setMessages((prev) => [...prev, botMessage]);
    speak(botContent);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <div className="p-2">
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded-lg hover:bg-pink-600 dark:hover:bg-pink-700 transition"
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 py-2 flex flex-col space-y-3"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              `max-w-[75%] px-4 py-2 rounded-lg break-words whitespace-pre-wrap ` +
              (msg.role === "user"
                ? "self-end bg-pink-100 dark:bg-pink-800 text-pink-700 dark:text-pink-100 text-right"
                : "self-start bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-600 text-pink-800 dark:text-pink-200 text-left")
            }
          >
            <span className="block font-semibold">
              {msg.role === "user" ? "You" : "Bot"}
            </span>
            <p className="mt-1">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 border-t border-pink-200 dark:border-pink-600 bg-pink-50 dark:bg-gray-800">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}