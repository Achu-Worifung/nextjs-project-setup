'use client'

import { useState, useRef, useEffect } from "react";
import ChatInput from "./chatinput"; 

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const systemMessage = {
      role: "system",
      content: "You are a friendly travel agent. Help me make travel plans by recommending hotels, flights, and cars."
    };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [systemMessage, ...messages, userMessage] }),
    });

    const data = await res.json();
    const botMessage = { role: "assistant", content: data.message };
    setMessages((prev) => [...prev, botMessage]);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
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
                ? "self-end bg-pink-100 text-pink-700 text-right"
                : "self-start bg-white border border-pink-200 text-pink-800 text-left")
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
      <div className="p-2 border-t border-pink-200 bg-pink-50">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}