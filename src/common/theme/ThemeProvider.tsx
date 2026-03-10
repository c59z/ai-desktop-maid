import React, { createContext, useContext, useState, useCallback } from 'react'
import { Theme, ThemeMode, getTheme } from './theme'

interface ThemeContextType {
  theme: Theme
  themeMode: ThemeMode
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeMode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'purple',
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultTheme)
  const [theme, setTheme] = useState<Theme>(getTheme(defaultTheme))

  const handleSetTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode)
    setTheme(getTheme(mode))
  }, [])

  const toggleTheme = useCallback(() => {
    const themes: ThemeMode[] = ['purple', 'blue', 'pink', 'green', 'dark']
    const currentIndex = themes.indexOf(themeMode)
    const nextIndex = (currentIndex + 1) % themes.length
    handleSetTheme(themes[nextIndex])
  }, [themeMode, handleSetTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// Hook 使用主题
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 获取主题类名（用于 Tailwind）
export const useThemeClasses = () => {
  const { theme } = useTheme()
  
  return {
    // 背景
    bgGradient: `bg-gradient-to-br ${theme.colors.backgroundGradient}`,
    bgSurface: theme.colors.surface,
    bgSurfaceHover: theme.colors.surfaceHover,
    
    // 文字
    textPrimary: theme.colors.text,
    textSecondary: theme.colors.textSecondary,
    textMuted: theme.colors.textMuted,
    
    // 边框
    border: theme.colors.border,
    borderLight: theme.colors.borderLight,
    
    // 主色
    primary: theme.colors.primary,
    primaryLight: theme.colors.primaryLight,
    accent: theme.colors.accent,
  }
}
