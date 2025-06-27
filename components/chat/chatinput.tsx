import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        ref={textareaRef}
        className="flex-1 border border-pink-300 rounded-md px-4 py-2 text-base leading-normal focus:outline-none focus:border-pink-500 resize-none overflow-hidden"
        placeholder="Type a message…"
        rows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button
        className="bg-pink-500 text-white hover:bg-pink-600"
        onClick={handleSend}
      >
        Send
      </Button>
    </div>
  );
}