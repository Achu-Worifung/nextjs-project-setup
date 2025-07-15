'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, X } from "lucide-react"

export default function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [input, setInput] = useState("")
  const [recording, setRecording] = useState(false)
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  const recognitionRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  useEffect(() => {
    if (!SpeechRecognition) return

    const recog = new SpeechRecognition()
    recog.continuous = false
    recog.interimResults = true
    recog.lang = "en-US"

    recog.onstart = () => setRecording(true)
    recog.onend = () => setRecording(false)

    recog.onresult = (event: any) => {
      const last = event.results[event.results.length - 1]
      const text = last[0].transcript
      setInput(text)
      if (last.isFinal) {
        onSend(text)
        setInput("")
      }
    }

    recognitionRef.current = recog
  }, [onSend, SpeechRecognition])

  const handleMicClick = () => {
    if (!recognitionRef.current) return
    if (recording) recognitionRef.current.stop()
    else recognitionRef.current.start()
  }

  const handleSend = () => {
    if (input.trim()) {
      onSend(input)
      setInput("")
    }
  }

  return (
    <div className="flex items-end gap-2">
      <button
        onClick={handleMicClick}
        className={`p-2 rounded-md border ${
          recording
            ? "bg-red-100 border-red-400"
            : "bg-white border-gray-300"
        }`}
        title={recording ? "Stop recording" : "Speak"}
      >
        {recording ? <X /> : <Mic />}
      </button>
      <textarea
        ref={textareaRef}
        className="flex-1 border border-pink-300 rounded-md px-4 py-2 text-base leading-normal focus:outline-none focus:border-pink-500 resize-none overflow-hidden"
        placeholder="Type or speak"
        rows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
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
  )
}