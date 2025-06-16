"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, Minimize2 } from "lucide-react"

interface Message {
  id: number
  from: string
  to: string
  message: string
  timestamp: string
  read: boolean
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "Atendimento SIGELU",
      to: "user",
      message: "Hello, welcome to SIGELU Service 😊",
      timestamp: "4:00 PM",
      read: true,
    },
  ])
  const [unreadCount, setUnreadCount] = useState(0)

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      from: "user",
      to: "Atendimento SIGELU",
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simular resposta automática
    setTimeout(() => {
      const autoReply: Message = {
        id: Date.now() + 1,
        from: "Atendimento SIGELU",
        to: "user",
        message: "Obrigado pela sua mensagem! Nossa equipe irá responder em breve.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      }
      setMessages((prev) => [...prev, autoReply])
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1)
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setUnreadCount(0)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={openChat}
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full h-16 w-16 p-0 shadow-lg relative"
        >
          <MessageCircle className="h-8 w-8" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-6 w-6 rounded-full flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-xl ${isMinimized ? "h-14" : "h-96"} transition-all duration-300`}>
        <CardHeader className="bg-teal-500 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-1">
                <MessageCircle className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Suporte SIGELU</CardTitle>
                {!isMinimized && (
                  <p className="text-xs text-teal-100">Atendimento disponível das 08:00 às 17:00 em dias úteis</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={minimizeChat}
                className="h-6 w-6 p-0 text-white hover:bg-teal-600"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChat}
                className="h-6 w-6 p-0 text-white hover:bg-teal-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0 h-64 overflow-y-auto bg-gray-50">
              <div className="p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs p-3 rounded-lg text-sm ${
                        msg.from === "user"
                          ? "bg-teal-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      {msg.from !== "user" && <div className="text-xs text-gray-500 mb-1">{msg.timestamp}</div>}
                      <div>{msg.message}</div>
                      {msg.from === "user" && (
                        <div className="text-xs text-teal-100 mt-1 text-right">{msg.timestamp}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="p-3 border-t bg-white rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message"
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-white h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
