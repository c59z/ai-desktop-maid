import React from 'react'
import { useTheme } from '../theme/ThemeProvider'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const { theme } = useTheme()

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: theme.colors.overlay }}
      onClick={onClose}
    >
      <div
        className={`w-full ${sizeClasses[size]} rounded-2xl overflow-hidden flex flex-col shadow-2xl`}
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {/* 底部 */}
        {footer && (
          <div
            className="px-5 py-4 border-t"
            style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
