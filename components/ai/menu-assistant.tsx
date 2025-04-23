"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AIAPI } from "@/lib/api"
import { useRestaurantStore } from "@/store/restaurant-store"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function MenuAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I can help you with menu recommendations, dietary information, or answer any questions about our dishes. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { restaurant } = useRestaurantStore()

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !restaurant) return

    const userMessage = input.trim()
    setInput("")

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    // Show loading state
    setIsLoading(true)

    try {
      // Call AI API
      const response = await AIAPI.askQuestion(restaurant.id, userMessage)

      // Add assistant response
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("AI Assistant error:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <Button className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg" onClick={() => setOpen(true)}>
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Chat Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="glass-card fixed bottom-0 left-0 right-0 sm:relative sm:max-w-md w-full sm:h-[600px] h-[70vh] flex flex-col rounded-t-lg sm:rounded-lg overflow-hidden z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h2 className="font-medium">Menu Assistant</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "glass"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 glass">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-75" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-150" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask about the menu..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

