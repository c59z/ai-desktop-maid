import React from 'react'

interface PetProps {
  isSpeaking?: boolean
  mood?: 'happy' | 'normal' | 'sad' | 'thinking'
  onClick?: () => void
}

export const Pet: React.FC<PetProps> = ({
  isSpeaking = false,
  mood = 'normal',
  onClick
}) => {
  const getMoodEmoji = () => {
    switch (mood) {
      case 'happy':
        return '😊'
      case 'sad':
        return '😢'
      case 'thinking':
        return '🤔'
      default:
        return '😐'
    }
  }

  const getMoodStyles = () => {
    const baseStyles = "flex flex-col items-center gap-3 cursor-pointer transition-transform duration-300 hover:scale-105"
    
    switch (mood) {
      case 'happy':
        return `${baseStyles} animate-bounce-slow`
      case 'sad':
        return `${baseStyles} opacity-70`
      case 'thinking':
        return `${baseStyles} animate-pulse-slow`
      default:
        return baseStyles
    }
  }

  return (
    <div className={getMoodStyles()} onClick={onClick}>
      <div className="relative">
        <div className={`w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-5xl transition-all duration-300 ${isSpeaking ? 'ring-4 ring-maid-purple/50 ring-offset-2' : ''}`}>
          {getMoodEmoji()}
        </div>
        
        {isSpeaking && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-2 h-2 bg-maid-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-maid-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-maid-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        )}
      </div>
      
      <div className="text-white font-semibold text-lg drop-shadow-md">莉莉</div>
    </div>
  )
}
