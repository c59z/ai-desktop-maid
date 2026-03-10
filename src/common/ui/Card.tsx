import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  selected?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  selected = false,
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl p-4 transition-all duration-200
        ${hover ? 'cursor-pointer hover:shadow-lg hover:border-maid-purple' : ''}
        ${selected 
          ? 'bg-gradient-to-r from-maid-purple/10 to-maid-violet/10 border-2 border-maid-purple shadow-lg' 
          : 'border-2 border-transparent shadow-sm'
        }
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="text-base font-semibold text-gray-800">{title}</h4>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mt-3 pt-3 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export const CardContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="space-y-2">{children}</div>
}
