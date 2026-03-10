import React from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatBubbleProps {
  messages: ChatMessage[]
  isTyping?: boolean
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  messages,
  isTyping = false
}) => {
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return (
    <div className="w-full h-80 overflow-y-auto bg-white/90 rounded-2xl shadow-xl p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col max-w-[80%] ${
              message.role === 'user' 
                ? 'ml-auto items-end' 
                : 'mr-auto items-start'
            }`}
          >
            <div 
              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-maid-purple to-maid-violet text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1 px-1">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex flex-col max-w-[80%] mr-auto items-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
