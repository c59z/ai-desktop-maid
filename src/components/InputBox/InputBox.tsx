import React, { useState } from "react";

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const InputBox: React.FC<InputBoxProps> = ({
  onSend,
  disabled = false,
  placeholder = "输入消息...",
}) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-end">
      {/* 输入框容器 - 透明背景，无边框 */}
      <div className="flex-1 relative">
        <textarea
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl resize-none text-sm text-white placeholder-white/50 outline-none transition-all duration-200 focus:bg-white/15 focus:border-white/30 min-h-[44px] max-h-32"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
        />
      </div>
      
      {/* 发送按钮 - 圆形，融入主题色 */}
      <button
        className="w-11 h-11 flex items-center justify-center bg-white/20 border border-white/30 rounded-full text-white transition-all duration-200 hover:bg-white/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        onClick={handleSend}
        disabled={disabled || !input.trim()}
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
          />
        </svg>
      </button>
    </div>
  );
};
