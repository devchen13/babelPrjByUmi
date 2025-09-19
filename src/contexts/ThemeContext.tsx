import React, { createContext, useContext, useState, useEffect } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'

// 主题类型定义
export type Theme = 'light' | 'dark'

// 主题上下文
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 默认使用暗黑模式
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'dark'
  })

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // 应用主题到 document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.className = `theme-${theme}`
  }, [theme])

  // Ant Design 主题配置
  const themeConfig = {
    algorithm:
      theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      colorBgBase: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      colorTextBase: theme === 'dark' ? '#ffffff' : '#333333',
      colorBgContainer: theme === 'dark' ? '#2d2d2d' : '#ffffff',
      colorBorder: theme === 'dark' ? '#404040' : '#e8e8e8',
      colorText: theme === 'dark' ? '#ffffff' : '#333333',
      colorTextSecondary: theme === 'dark' ? '#cccccc' : '#666666',
      colorTextTertiary: theme === 'dark' ? '#999999' : '#999999',
      colorBgElevated: theme === 'dark' ? '#3a3a3a' : '#ffffff',
      colorBgLayout: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      colorBgSpotlight: theme === 'dark' ? '#2d2d2d' : '#fafafa',
      colorBgMask:
        theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.45)',
      boxShadow:
        theme === 'dark'
          ? '0 6px 16px 0 rgba(0, 0, 0, 0.3), 0 3px 6px -4px rgba(0, 0, 0, 0.2), 0 9px 28px 8px rgba(0, 0, 0, 0.1)'
          : '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    },
    components: {
      Card: {
        colorBgContainer: theme === 'dark' ? '#2d2d2d' : '#ffffff',
        colorBorderSecondary: theme === 'dark' ? '#404040' : '#e8e8e8',
      },
      Button: {
        colorPrimary: '#1890ff',
        colorPrimaryHover: '#40a9ff',
        colorPrimaryActive: '#096dd9',
      },
      Input: {
        colorBgContainer: theme === 'dark' ? '#2d2d2d' : '#ffffff',
        colorBorder: theme === 'dark' ? '#404040' : '#d9d9d9',
        colorText: theme === 'dark' ? '#ffffff' : '#333333',
      },
      Typography: {
        colorText: theme === 'dark' ? '#ffffff' : '#333333',
        colorTextSecondary: theme === 'dark' ? '#cccccc' : '#666666',
      },
    },
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  )
}

// 使用主题的 Hook
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 主题切换按钮组件
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className='theme-toggle'
      title={`切换到${theme === 'light' ? '暗黑' : '明亮'}模式`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
