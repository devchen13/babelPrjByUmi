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
      colorBgBase: theme === 'dark' ? '#141414' : '#ffffff',
      colorTextBase: theme === 'dark' ? '#ffffff' : '#000000',
      colorBgContainer: theme === 'dark' ? '#1f1f1f' : '#ffffff',
      colorBgLayout: theme === 'dark' ? '#141414' : '#f5f5f5',
      colorText: theme === 'dark' ? '#ffffff' : '#000000',
      colorTextSecondary: theme === 'dark' ? '#a6a6a6' : '#00000073',
      colorBorder: theme === 'dark' ? '#424242' : '#d9d9d9',
    },
    components: {
      Layout: {
        // Header 相关配置
        headerBg: theme === 'dark' ? '#1f1f1f' : '#ffffff',
        headerColor: theme === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.88)',
        headerHeight: 64,
        headerPadding: '0 50px',

        // Sider 相关配置
        siderBg: theme === 'dark' ? '#001529' : '#ffffff',
        lightSiderBg: '#ffffff',

        // Trigger 相关配置
        triggerBg: theme === 'dark' ? '#002140' : '#ffffff',
        triggerColor: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.88)',
        lightTriggerBg: '#ffffff',
        lightTriggerColor: 'rgba(0, 0, 0, 0.88)',
        triggerHeight: 48,
        zeroTriggerHeight: 40,
        zeroTriggerWidth: 40,

        // Body 和 Footer 相关配置
        bodyBg: theme === 'dark' ? '#141414' : '#f5f5f5',
        footerBg: theme === 'dark' ? '#141414' : '#f5f5f5',
        footerPadding: '24px 50px',
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
