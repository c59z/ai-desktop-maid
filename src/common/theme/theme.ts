// 主题配置系统
// 定义颜色、间距、字体等设计令牌

export type ThemeMode = 'purple' | 'blue' | 'pink' | 'green' | 'dark'

export interface ThemeColors {
  // 主色调
  primary: string
  primaryLight: string
  primaryDark: string
  
  // 背景色
  background: string
  backgroundGradient: string
  surface: string
  surfaceHover: string
  
  // 文字色
  text: string
  textSecondary: string
  textMuted: string
  
  // 边框色
  border: string
  borderLight: string
  
  // 状态色
  success: string
  warning: string
  error: string
  info: string
  
  // 特殊色
  accent: string
  overlay: string
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface ThemeBorderRadius {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  full: string
}

export interface ThemeShadows {
  sm: string
  md: string
  lg: string
  xl: string
}

export interface Theme {
  name: ThemeMode
  colors: ThemeColors
  spacing: ThemeSpacing
  borderRadius: ThemeBorderRadius
  shadows: ThemeShadows
}

// 紫色主题（默认）
export const purpleTheme: Theme = {
  name: 'purple',
  colors: {
    primary: '#667eea',
    primaryLight: '#764ba2',
    primaryDark: '#5a67d8',
    
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundGradient: 'from-maid-purple to-maid-violet',
    surface: 'rgba(255, 255, 255, 0.1)',
    surfaceHover: 'rgba(255, 255, 255, 0.15)',
    
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    
    border: 'rgba(255, 255, 255, 0.2)',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
    
    accent: '#f472b6',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
}

// 蓝色主题
export const blueTheme: Theme = {
  ...purpleTheme,
  name: 'blue',
  colors: {
    ...purpleTheme.colors,
    primary: '#4299e1',
    primaryLight: '#63b3ed',
    primaryDark: '#3182ce',
    background: 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
    backgroundGradient: 'from-blue-400 to-blue-600',
    accent: '#f687b3',
  },
}

// 粉色主题
export const pinkTheme: Theme = {
  ...purpleTheme,
  name: 'pink',
  colors: {
    ...purpleTheme.colors,
    primary: '#ed64a6',
    primaryLight: '#f687b3',
    primaryDark: '#d53f8c',
    background: 'linear-gradient(135deg, #ed64a6 0%, #9f7aea 100%)',
    backgroundGradient: 'from-pink-400 to-purple-500',
    accent: '#4299e1',
  },
}

// 绿色主题
export const greenTheme: Theme = {
  ...purpleTheme,
  name: 'green',
  colors: {
    ...purpleTheme.colors,
    primary: '#48bb78',
    primaryLight: '#68d391',
    primaryDark: '#38a169',
    background: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)',
    backgroundGradient: 'from-green-400 to-teal-500',
    accent: '#f6ad55',
  },
}

// 深色主题
export const darkTheme: Theme = {
  ...purpleTheme,
  name: 'dark',
  colors: {
    ...purpleTheme.colors,
    primary: '#667eea',
    primaryLight: '#764ba2',
    primaryDark: '#5a67d8',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    backgroundGradient: 'from-gray-800 to-gray-900',
    surface: 'rgba(255, 255, 255, 0.05)',
    surfaceHover: 'rgba(255, 255, 255, 0.1)',
    text: '#e2e8f0',
    textSecondary: 'rgba(226, 232, 240, 0.8)',
    textMuted: 'rgba(226, 232, 240, 0.5)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',
    accent: '#f472b6',
  },
}

// 主题映射
export const themes: Record<ThemeMode, Theme> = {
  purple: purpleTheme,
  blue: blueTheme,
  pink: pinkTheme,
  green: greenTheme,
  dark: darkTheme,
}

// 获取主题
export const getTheme = (mode: ThemeMode): Theme => {
  return themes[mode] || purpleTheme
}

// 当前主题（可以从配置中读取）
let currentThemeMode: ThemeMode = 'purple'

export const setCurrentTheme = (mode: ThemeMode): void => {
  currentThemeMode = mode
}

export const getCurrentTheme = (): Theme => {
  return getTheme(currentThemeMode)
}

export const getCurrentThemeMode = (): ThemeMode => {
  return currentThemeMode
}
